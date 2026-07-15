'use strict';

/* =========================================================
   AURELIA — Premium Interior Studio Landing
   Vanilla JS: content loading, scroll reveal, before/after
   slider, quiz calculator, phone mask, Web3Forms submission.
   ========================================================= */

// Get your free key at https://web3forms.com and paste it below.
// Then enable the Telegram integration in the Web3Forms dashboard
// (Integrations → Telegram) — no bot token ever touches this file.
const WEB3FORMS_ACCESS_KEY = 'YOUR_WEB3FORMS_ACCESS_KEY';
const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';

const ICONS = {
  compass: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="9"/><path d="M14.5 9.5l-2 5-5 2 2-5z"/></svg>',
  key: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="8" cy="15" r="4"/><path d="M11 12l8-8M16 5l3 3M13 8l2 2"/></svg>',
  eye: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>',
  sofa: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 13v5M20 13v5M4 13a2 2 0 012-2h12a2 2 0 012 2M6 11V8a2 2 0 012-2h8a2 2 0 012 2v3M3 15h18v3H3z"/></svg>',
  cpu: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="7" y="7" width="10" height="10" rx="1.5"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.5 4.5l2 2M17.5 17.5l2 2M19.5 4.5l-2 2M6.5 17.5l-2 2"/></svg>',
  sparkles: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 3l1.8 4.9L18.7 9.7 13.8 11.5 12 16.4 10.2 11.5 5.3 9.7l4.9-1.8z"/><path d="M19 17l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z"/></svg>'
};

let CONTENT = null;

document.addEventListener('DOMContentLoaded', init);

async function init() {
  setupPreloader();
  setupHeaderScroll();
  setupMobileMenu();
  document.getElementById('footer-year').textContent = new Date().getFullYear();

  CONTENT = await loadContent();

  renderHero(CONTENT.hero, CONTENT.brand);
  renderStats(CONTENT.hero.stats);
  renderServices(CONTENT.services);
  renderProcess(CONTENT.process);
  renderBeforeAfter(CONTENT.beforeAfter);
  renderTestimonials(CONTENT.testimonials);
  renderFAQ(CONTENT.faq);
  renderFooterContacts(CONTENT.contacts);

  setupScrollReveal();
  setupBeforeAfterSliders();
  setupTestimonialCarousel();
  setupFAQAccordion();
  setupQuiz(CONTENT.calculator);
  setupPhoneMask(document.getElementById('quiz-phone'));
}

/* ---------------------------------------------------------
   Content loading (fed by data/content.json — editable
   via the Decap CMS admin panel without touching code)
   --------------------------------------------------------- */
async function loadContent() {
  try {
    const res = await fetch('data/content.json', { cache: 'no-store' });
    if (!res.ok) throw new Error('content.json not reachable');
    return await res.json();
  } catch (err) {
    console.warn('Не удалось загрузить data/content.json, использую заглушку.', err);
    return FALLBACK_CONTENT;
  }
}

/* ---------------------------------------------------------
   Preloader / header / mobile menu
   --------------------------------------------------------- */
function setupPreloader() {
  window.addEventListener('load', () => {
    const pre = document.getElementById('preloader');
    setTimeout(() => pre.classList.add('is-hidden'), 400);
  });
}

function setupHeaderScroll() {
  const header = document.getElementById('site-header');
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 24);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

function setupMobileMenu() {
  const toggle = document.getElementById('menu-toggle');
  const menu = document.getElementById('mobile-menu');
  toggle.addEventListener('click', () => menu.classList.toggle('hidden'));
  menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => menu.classList.add('hidden')));
}

/* ---------------------------------------------------------
   Scroll reveal — IntersectionObserver
   --------------------------------------------------------- */
function setupScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('[data-animate]').forEach((el) => {
    const delay = el.getAttribute('data-delay');
    if (delay) el.style.transitionDelay = `${delay}ms`;
    observer.observe(el);
  });
}

function markAnimated(el, delay) {
  el.setAttribute('data-animate', '');
  if (delay) el.setAttribute('data-delay', String(delay));
  return el;
}

/* ---------------------------------------------------------
   Hero + animated stat counters
   --------------------------------------------------------- */
function renderHero(hero, brand) {
  document.querySelectorAll('[data-cms="brand.name"]').forEach((el) => { el.textContent = brand.name; });
  document.querySelectorAll('[data-cms="brand.tagline"]').forEach((el) => { el.textContent = brand.tagline; });
  document.getElementById('hero-badge').textContent = hero.badge;
  document.getElementById('hero-title').textContent = hero.title;
  document.getElementById('hero-subtitle').textContent = hero.subtitle;
  document.getElementById('hero-cta-primary').textContent = hero.ctaPrimary;
  document.getElementById('hero-cta-secondary').textContent = hero.ctaSecondary;
}

function renderStats(stats) {
  const row = document.getElementById('stats-row');
  row.innerHTML = '';
  stats.forEach((stat, i) => {
    const el = document.createElement('div');
    markAnimated(el, i * 100);
    el.innerHTML = `
      <div class="font-display text-3xl lg:text-4xl text-gradient-gold">
        <span class="stat-count" data-target="${stat.value}">0</span>${stat.suffix}
      </div>
      <div class="mt-1 text-sm text-platinum">${stat.label}</div>`;
    row.appendChild(el);
  });

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  row.querySelectorAll('.stat-count').forEach((el) => counterObserver.observe(el));
}

function animateCount(el) {
  const target = parseFloat(el.getAttribute('data-target'));
  const duration = 1400;
  const start = performance.now();
  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(target * eased);
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

/* ---------------------------------------------------------
   Services
   --------------------------------------------------------- */
function renderServices(services) {
  const grid = document.getElementById('services-grid');
  grid.innerHTML = '';
  services.forEach((s, i) => {
    const card = document.createElement('article');
    card.className = 'card p-8';
    markAnimated(card, (i % 3) * 120);
    card.innerHTML = `
      <div class="w-12 h-12 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-gold">
        ${ICONS[s.icon] || ICONS.sparkles}
      </div>
      <h3 class="mt-6 font-display text-xl">${s.title}</h3>
      <p class="mt-3 text-sm text-platinum leading-relaxed">${s.text}</p>`;
    grid.appendChild(card);
  });
}

/* ---------------------------------------------------------
   Process timeline
   --------------------------------------------------------- */
function renderProcess(steps) {
  const wrap = document.getElementById('process-steps');
  wrap.innerHTML = '';
  steps.forEach((step, i) => {
    const el = document.createElement('div');
    el.className = 'relative';
    markAnimated(el, i * 120);
    el.innerHTML = `
      <span class="font-display text-4xl text-gradient-gold">${step.step}</span>
      <h3 class="mt-4 font-display text-lg">${step.title}</h3>
      <p class="mt-2 text-sm text-platinum leading-relaxed">${step.text}</p>`;
    wrap.appendChild(el);
  });
}

/* ---------------------------------------------------------
   Before / After gallery + custom slider
   --------------------------------------------------------- */
function renderBeforeAfter(data) {
  document.getElementById('ba-title').textContent = data.title;
  document.getElementById('ba-subtitle').textContent = data.subtitle;

  const gallery = document.getElementById('ba-gallery');
  gallery.innerHTML = '';
  data.items.forEach((item, i) => {
    const wrap = document.createElement('div');
    markAnimated(wrap, i * 100);
    wrap.innerHTML = `
      <h3 class="font-display text-xl mb-5">${item.title}</h3>
      <div class="ba-slider" data-ba-slider>
        <span class="ba-tag tag-before">До</span>
        <span class="ba-tag tag-after">После</span>
        <img src="${item.before}" alt="До: ${item.title}" draggable="false">
        <div class="ba-after-wrap">
          <img src="${item.after}" alt="После: ${item.title}" draggable="false">
        </div>
        <div class="ba-handle"></div>
      </div>`;
    gallery.appendChild(wrap);
  });
}

function setupBeforeAfterSliders() {
  document.querySelectorAll('[data-ba-slider]').forEach((container) => {
    const afterWrap = container.querySelector('.ba-after-wrap');
    const handle = container.querySelector('.ba-handle');
    const afterImg = container.querySelector('.ba-after-wrap img');
    let dragging = false;

    const syncAfterImageWidth = () => {
      afterImg.style.width = container.clientWidth + 'px';
    };
    syncAfterImageWidth();
    window.addEventListener('resize', syncAfterImageWidth);

    const setPosition = (clientX) => {
      const rect = container.getBoundingClientRect();
      let pct = ((clientX - rect.left) / rect.width) * 100;
      pct = Math.max(0, Math.min(100, pct));
      afterWrap.style.width = pct + '%';
      handle.style.left = pct + '%';
    };

    const start = (e) => { dragging = true; move(e); };
    const stop = () => { dragging = false; };
    const move = (e) => {
      if (!dragging && e.type !== 'mousedown' && e.type !== 'touchstart') return;
      const point = e.touches ? e.touches[0] : e;
      setPosition(point.clientX);
    };

    container.addEventListener('mousedown', start);
    container.addEventListener('touchstart', start, { passive: true });
    window.addEventListener('mousemove', move);
    window.addEventListener('touchmove', move, { passive: true });
    window.addEventListener('mouseup', stop);
    window.addEventListener('touchend', stop);

    // Click anywhere (without drag) also moves the divider instantly.
    container.addEventListener('click', (e) => setPosition(e.clientX));
  });
}

/* ---------------------------------------------------------
   Testimonials carousel
   --------------------------------------------------------- */
function renderTestimonials(items) {
  const track = document.getElementById('testimonials-track');
  track.innerHTML = '';
  items.forEach((t, i) => {
    const card = document.createElement('article');
    card.className = 'testi-card card p-8 snap-start';
    markAnimated(card, i * 100);
    const stars = '★'.repeat(t.rating) + '☆'.repeat(5 - t.rating);
    card.innerHTML = `
      <div class="text-gold-light text-sm">${stars}</div>
      <p class="mt-4 text-platinum leading-relaxed">«${t.text}»</p>
      <div class="mt-6">
        <div class="font-display text-base">${t.name}</div>
        <div class="text-xs text-platinum/70 mt-0.5">${t.role}</div>
      </div>`;
    track.appendChild(card);
  });
}

function setupTestimonialCarousel() {
  const track = document.getElementById('testimonials-track');
  const prev = document.getElementById('testi-prev');
  const next = document.getElementById('testi-next');
  const scrollByCard = (dir) => {
    const card = track.querySelector('.testi-card');
    const gap = 24;
    const width = card ? card.getBoundingClientRect().width + gap : 300;
    track.scrollBy({ left: dir * width, behavior: 'smooth' });
  };
  prev.addEventListener('click', () => scrollByCard(-1));
  next.addEventListener('click', () => scrollByCard(1));
}

/* ---------------------------------------------------------
   FAQ accordion
   --------------------------------------------------------- */
function renderFAQ(items) {
  const list = document.getElementById('faq-list');
  list.innerHTML = '';
  items.forEach((item, i) => {
    const el = document.createElement('div');
    el.className = 'faq-item';
    markAnimated(el, i * 80);
    el.innerHTML = `
      <button type="button" class="faq-question">
        <span>${item.q}</span>
        <span class="faq-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
        </span>
      </button>
      <div class="faq-answer"><div class="faq-answer-inner">${item.a}</div></div>`;
    list.appendChild(el);
  });
}

function setupFAQAccordion() {
  document.querySelectorAll('.faq-item').forEach((item) => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');
      document.querySelectorAll('.faq-item.is-open').forEach((openItem) => {
        openItem.classList.remove('is-open');
        openItem.querySelector('.faq-answer').style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add('is-open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
}

/* ---------------------------------------------------------
   Footer contacts
   --------------------------------------------------------- */
function renderFooterContacts(contacts) {
  const list = document.getElementById('footer-contacts');
  list.innerHTML = `
    <li><a href="tel:${contacts.phone.replace(/\s|\(|\)|-/g, '')}" class="nav-link">${contacts.phone}</a></li>
    <li>${contacts.address}</li>
    <li>${contacts.workHours}</li>`;

  const social = document.getElementById('footer-social');
  const links = [
    { href: contacts.telegram, label: 'TG' },
    { href: contacts.whatsapp, label: 'WA' },
    { href: contacts.instagram, label: 'IG' }
  ];
  social.innerHTML = links.map((l) => `
    <a href="${l.href}" target="_blank" rel="noopener" class="w-10 h-10 rounded-full glass-panel flex items-center justify-center text-xs text-platinum hover:text-gold-light hover:shadow-gold transition-all duration-[400ms]">${l.label}</a>
  `).join('');
}

/* ---------------------------------------------------------
   Quiz / Calculator wizard
   --------------------------------------------------------- */
let quizState = { step: 1, totalSteps: 4, answers: {} };

function setupQuiz(calcConfig) {
  document.getElementById('calc-title').textContent = calcConfig.title;
  document.getElementById('calc-subtitle').textContent = calcConfig.subtitle;
  document.getElementById('quiz-step1-title').textContent = calcConfig.step1.title;
  document.getElementById('quiz-step2-title').textContent = calcConfig.step2.title;
  document.getElementById('quiz-step3-title').textContent = calcConfig.step3.title;

  renderQuizOptions('quiz-step1-options', calcConfig.step1.options, 1);
  renderQuizOptions('quiz-step2-options', calcConfig.step2.options, 2);
  renderQuizOptions('quiz-step3-options', calcConfig.step3.options, 3);

  document.getElementById('quiz-next').addEventListener('click', () => handleQuizNext(calcConfig));
  document.getElementById('quiz-prev').addEventListener('click', handleQuizPrev);

  const nameInput = document.getElementById('quiz-name');
  const phoneInput = document.getElementById('quiz-phone');
  const consent = document.getElementById('quiz-consent');
  [nameInput, phoneInput, consent].forEach((input) => {
    input.addEventListener('input', () => validateContactStep());
    input.addEventListener('change', () => validateContactStep());
  });
}

function renderQuizOptions(containerId, options, stepIndex) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  options.forEach((opt) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'option-card';
    btn.dataset.value = opt.value;
    btn.innerHTML = `
      <div class="option-label">${opt.label}</div>
      ${opt.description ? `<div class="option-desc">${opt.description}</div>` : ''}`;
    btn.addEventListener('click', () => selectOption(stepIndex, opt, container, btn));
    container.appendChild(btn);
  });
}

function selectOption(stepIndex, opt, container, btn) {
  container.querySelectorAll('.option-card').forEach((c) => c.classList.remove('is-selected'));
  btn.classList.add('is-selected');
  quizState.answers[`step${stepIndex}`] = opt;
  document.getElementById('quiz-next').disabled = false;
}

function handleQuizNext(calcConfig) {
  const { step } = quizState;

  if (step < 3 && !quizState.answers[`step${step}`]) return;

  if (step === 3) {
    calculatePrice(calcConfig);
    goToStep(4);
    return;
  }

  if (step === 4) {
    submitQuiz(calcConfig);
    return;
  }

  goToStep(step + 1);
}

function handleQuizPrev() {
  if (quizState.step > 1) goToStep(quizState.step - 1);
}

function goToStep(stepNumber) {
  quizState.step = stepNumber;
  document.querySelectorAll('.quiz-step').forEach((el) => el.classList.add('hidden'));
  document.querySelector(`.quiz-step[data-step="${stepNumber}"]`).classList.remove('hidden');

  document.getElementById('quiz-progress').style.width = `${(stepNumber / quizState.totalSteps) * 100}%`;
  document.getElementById('quiz-step-label').textContent = `Шаг ${stepNumber} из ${quizState.totalSteps}`;

  const prevBtn = document.getElementById('quiz-prev');
  const nextBtn = document.getElementById('quiz-next');
  prevBtn.classList.toggle('opacity-0', stepNumber === 1);
  prevBtn.classList.toggle('pointer-events-none', stepNumber === 1);

  if (stepNumber < 4) {
    nextBtn.textContent = 'Далее';
    nextBtn.disabled = !quizState.answers[`step${stepNumber}`];
  } else {
    nextBtn.textContent = 'Отправить заявку';
    validateContactStep();
  }
}

function calculatePrice(calcConfig) {
  const a1 = quizState.answers.step1;
  const a2 = quizState.answers.step2;
  const a3 = quizState.answers.step3;
  const price = Math.round((a2.area * a3.pricePerM2 * a1.modifier) / 10000) * 10000;
  quizState.price = price;
  document.getElementById('quiz-price').textContent = `${formatNumber(price)} ${calcConfig.currency}`;
}

function formatNumber(n) {
  return n.toLocaleString('ru-RU').replace(/,/g, ' ');
}

function validateContactStep() {
  const name = document.getElementById('quiz-name').value.trim();
  const phoneDigits = document.getElementById('quiz-phone').dataset.rawDigits || '';
  const consent = document.getElementById('quiz-consent').checked;
  const isValid = name.length >= 2 && phoneDigits.length === 10 && consent;
  if (quizState.step === 4) document.getElementById('quiz-next').disabled = !isValid;
  return isValid;
}

async function submitQuiz(calcConfig) {
  const errorEl = document.getElementById('quiz-error');
  errorEl.classList.add('hidden');

  if (!validateContactStep()) {
    errorEl.textContent = 'Заполните имя, телефон полностью и подтвердите согласие на обработку данных.';
    errorEl.classList.remove('hidden');
    return;
  }

  const nextBtn = document.getElementById('quiz-next');
  const originalLabel = nextBtn.textContent;
  nextBtn.disabled = true;
  nextBtn.textContent = 'Отправляем...';

  const name = document.getElementById('quiz-name').value.trim();
  const phone = document.getElementById('quiz-phone').value;
  const { step1, step2, step3 } = quizState.answers;
  const almatyTime = new Date().toLocaleString('ru-RU', {
    timeZone: 'Asia/Almaty',
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });

  const message = [
    '💎 ПРЕМЬЕРА: НОВАЯ ЗАЯВКА 💎',
    '━━━━━━━━━━━━━━━━━━━━━━━━',
    `👤 Клиент: ${name}`,
    `📞 Телефон: ${phone}`,
    '',
    '📋 Расчет в калькуляторе:',
    `▫️ Тип: ${step1.label}`,
    `▫️ Площадь: ${step2.label}`,
    `▫️ Класс: ${step3.label}`,
    '',
    `💰 Предварительный бюджет: ${formatNumber(quizState.price)} ${calcConfig.currency}`,
    '━━━━━━━━━━━━━━━━━━━━━━━━',
    `📅 Время заявки (Алматы): ${almatyTime}`
  ].join('\n');

  const payload = {
    access_key: WEB3FORMS_ACCESS_KEY,
    subject: '💎 Новая заявка — AURELIA Interior Studio',
    from_name: 'AURELIA — Квиз-калькулятор',
    name,
    phone,
    object_type: step1.label,
    area: step2.label,
    class: step3.label,
    budget: `${formatNumber(quizState.price)} ${calcConfig.currency}`,
    message,
    botcheck: ''
  };

  try {
    const res = await fetch(WEB3FORMS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();

    if (data.success) {
      document.querySelectorAll('.quiz-step').forEach((el) => el.classList.add('hidden'));
      document.querySelector('.quiz-step[data-step="success"]').classList.remove('hidden');
      document.getElementById('quiz-nav').classList.add('hidden');
      document.getElementById('quiz-progress').style.width = '100%';
      document.getElementById('quiz-step-label').textContent = 'Готово';
    } else {
      throw new Error(data.message || 'Ошибка отправки');
    }
  } catch (err) {
    errorEl.textContent = 'Не удалось отправить заявку. Проверьте соединение и попробуйте снова, либо позвоните нам напрямую.';
    errorEl.classList.remove('hidden');
    nextBtn.disabled = false;
    nextBtn.textContent = originalLabel;
  }
}

/* ---------------------------------------------------------
   Phone mask: +7 (XXX) XXX-XX-XX
   Kazakhstan format — 10 digits after country code, e.g.
   705 123 45 67 → +7 (705) 123-45-67
   --------------------------------------------------------- */
function setupPhoneMask(input) {
  if (!input) return;

  const applyMask = (raw) => {
    // Strip the +7 / 8 country prefix from raw input so typed
    // digits are not merged with the displayed country code
    // (fixes 705 → 777 05 when +7 and 7 were concatenated).
    let cleaned = raw.trim();
    cleaned = cleaned.replace(/^\+7[\s\-()]*/, '');
    cleaned = cleaned.replace(/^8[\s\-()]*/, '');
    const digits = cleaned.replace(/\D/g, '').slice(0, 10);

    let formatted = '+7';
    if (digits.length > 0) {
      formatted += ' (' + digits.slice(0, 3) + ')';
      if (digits.length > 3) formatted += ' ' + digits.slice(3, 6);
      if (digits.length > 6) formatted += '-' + digits.slice(6, 8);
      if (digits.length > 8) formatted += '-' + digits.slice(8, 10);
    } else {
      formatted += ' ';
    }

    input.value = formatted;
    input.dataset.rawDigits = digits;
  };

  input.addEventListener('focus', () => {
    if (!input.dataset.rawDigits && !input.value.trim()) {
      input.value = '+7 ';
    }
  });

  input.addEventListener('input', (e) => {
    applyMask(e.target.value);
    requestAnimationFrame(() => {
      e.target.setSelectionRange(e.target.value.length, e.target.value.length);
    });
  });

  input.addEventListener('blur', () => {
    if (!input.dataset.rawDigits) {
      input.value = '';
    }
  });
}

/* ---------------------------------------------------------
   Fallback content (used only if data/content.json fails
   to load, e.g. when opening index.html directly via
   file:// without a local server).
   --------------------------------------------------------- */
const FALLBACK_CONTENT = {
  brand: { name: 'AURELIA', tagline: 'Interior Studio' },
  hero: {
    badge: 'Премиальный ремонт и дизайн интерьера',
    title: 'Интерьеры,\nдостойные вашего статуса',
    subtitle: 'Проектируем и реализуем ремонт «под ключ» премиум-класса.',
    ctaPrimary: 'Рассчитать стоимость',
    ctaSecondary: 'Смотреть портфолио',
    stats: [
      { value: 150, suffix: '+', label: 'Реализованных проектов' },
      { value: 12, suffix: ' лет', label: 'На рынке' },
      { value: 98, suffix: '%', label: 'Рекомендуют нас' },
      { value: 24, suffix: '/7', label: 'Авторский надзор' }
    ]
  },
  services: [],
  process: [],
  beforeAfter: { title: 'До / После', subtitle: '', items: [] },
  calculator: {
    title: 'Рассчитайте стоимость проекта',
    subtitle: '',
    currency: 'KZT',
    step1: { title: 'Тип объекта', options: [{ label: 'Квартира', value: 'apartment', modifier: 1 }] },
    step2: { title: 'Площадь объекта', options: [{ label: 'до 50 м²', value: '50', area: 40 }] },
    step3: { title: 'Класс ремонта', options: [{ label: 'Комфорт', value: 'comfort', pricePerM2: 150000 }] }
  },
  testimonials: [],
  faq: [],
  contacts: {
    phone: '+7 (700) 123-45-67',
    telegram: '#', whatsapp: '#', instagram: '#',
    address: 'Алматы', workHours: 'Пн–Сб, 10:00–19:00'
  }
};
