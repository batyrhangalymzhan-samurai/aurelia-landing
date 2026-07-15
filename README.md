# AURELIA — Ultra‑Luxury Interior Studio Landing (JAMstack)

Сверхбыстрый одностраничный сайт премиум-класса без собственного backend-сервера.
Чистый **HTML5 + Tailwind CSS + Vanilla JS (ES6+)**, облачная CMS для клиента и
безопасная отправка заявок из квиз-калькулятора прямо в Telegram.

## Структура проекта

```
├── index.html            # Вся разметка страницы
├── css/style.css         # Glassmorphism, gold-glow, анимации, слайдер, маска телефона
├── js/app.js             # Вся логика: рендер контента, слайдер До/После, квиз, Web3Forms
├── data/content.json     # Единый файл контента — редактируется через CMS
├── admin/
│   ├── index.html        # Точка входа Decap CMS
│   └── config.yml        # Конфигурация коллекций/полей CMS
├── favicon.svg
├── netlify.toml           # Настройки для хостинга на Netlify
└── README.md
```

Никакой сборки (webpack/vite) не требуется — все файлы статические и готовы к деплою как есть.

## 1. Локальный просмотр

`js/app.js` подгружает `data/content.json` через `fetch()`, поэтому открыть
`index.html` напрямую через `file://` браузер не даст (CORS блокирует
локальные fetch-запросы к файлам). Поднимите любой простой статический сервер
в корне проекта:

```bash
# Node.js (без установки пакетов)
npx serve .

# или Python
python -m http.server 5500
```

Затем откройте `http://localhost:5500` (или тот адрес, что покажет консоль).
Если `content.json` всё же не загрузится, сайт покажет упрощённую заглушку
(`FALLBACK_CONTENT` в `app.js`), чтобы страница не выглядела пустой.

## 2. Деплой на Vercel или Netlify

Просто подключите Git-репозиторий с этим проектом к Vercel или Netlify —
никаких build-команд указывать не нужно (Framework Preset: **Other / Static**).

- **Vercel:** Import Project → Framework Preset: `Other` → Deploy.
- **Netlify:** Add new site → Import from Git → Build command: пусто,
  Publish directory: `.` → Deploy site.

## 3. Отправка заявок в Telegram через Web3Forms (без своего сервера)

Так как токен Telegram-бота никогда не должен попадать во фронтенд-код,
вся пересылка происходит через сервис-посредник **Web3Forms**:

1. Зайдите на [web3forms.com](https://web3forms.com) и создайте бесплатный
   Access Key (указывается ваш e-mail для верификации).
2. Откройте `js/app.js` и вставьте ключ в константу в самом начале файла:

   ```js
   const WEB3FORMS_ACCESS_KEY = 'ваш-ключ-сюда';
   ```

3. В личном кабинете Web3Forms откройте вкладку **Integrations → Telegram**
   (доступно на платных тарифах Starter/Pro/Agency):
   - Напишите `/start` боту **@web3forms_bot** в Telegram — он пришлёт ваш `Chat ID`.
   - Вставьте `Chat ID` в настройках интеграции и сохраните.
4. Готово — при отправке квиза заявка мгновенно долетает в ваш Telegram в
   формате:

   ```
   💎 ПРЕМЬЕРА: НОВАЯ ЗАЯВКА 💎
   ━━━━━━━━━━━━━━━━━━━━━━━━
   👤 Клиент: Иван Иванов
   📞 Телефон: +7 (701) 234-56-78

   📋 Расчет в калькуляторе:
   ▫️ Тип: Квартира
   ▫️ Площадь: 100–200 м²
   ▫️ Класс: Премиум

   💰 Предварительный бюджет: 42 000 000 KZT
   ━━━━━━━━━━━━━━━━━━━━━━━━
   📅 Время заявки (Алматы): 15.07.2026 13:20
   ```

   Формат сообщения собирается в функции `submitQuiz()` в `js/app.js` — можно
   свободно менять текст, эмодзи и порядок строк.

**Альтернатива:** сервис [Formspree](https://formspree.io) работает по такому
же принципу — достаточно заменить `WEB3FORMS_ENDPOINT` в `app.js` на
`https://formspree.io/f/ваш-id` и убрать поле `access_key` из `payload`.

## 4. CMS-админка без собственного backend (Decap CMS)

Клиент редактирует тексты, цены калькулятора и фото галереи «До/После» на
странице `/admin/` — все изменения коммитятся прямо в Git-репозиторий, и сайт
обновляется через автодеплой Vercel/Netlify (~1 минута).

### Вариант A — Netlify (проще всего, без настройки OAuth)

1. Задеплойте проект на Netlify (см. пункт 2).
2. В панели Netlify включите **Identity**: `Site settings → Identity → Enable Identity`.
3. Там же включите **Git Gateway**: `Identity → Services → Git Gateway → Enable`.
4. Пригласите клиента: `Identity → Invite users` → его e-mail.
5. Клиент переходит на `https://ваш-сайт.netlify.app/admin/`, принимает
   инвайт-письмо, задаёт пароль и попадает в панель управления.

Конфигурация `admin/config.yml` уже настроена на `backend: git-gateway` — ничего
дополнительно менять не нужно.

### Вариант B — Vercel / GitHub Pages (через GitHub OAuth)

Git Gateway — фича именно Netlify. Если хостинг на Vercel, авторизацию делаем
через сам GitHub:

1. Разверните бесплатный OAuth-провайдер для Decap CMS, например
   [`netlify-cms-oauth-provider-node`](https://github.com/vencax/netlify-cms-github-oauth-provider)
   (деплоится на Vercel/Render в 1 клик) — получите `client_id`.
2. В `admin/config.yml` замените блок `backend` на:

   ```yaml
   backend:
     name: github
     repo: ваш-github-логин/ваш-репозиторий
     branch: main
     base_url: https://адрес-вашего-oauth-провайдера
   ```

3. Дайте клиенту доступ (Collaborator) к GitHub-репозиторию — он логинится
   на `/admin/` через свой аккаунт GitHub.

### Что может редактировать клиент

- Тексты Hero, услуг, отзывов, FAQ, контактов.
- Все 3 шага калькулятора: варианты, цену за м² и множители.
- Фото в галерее «До/После» — загружаются в `/uploads/` через встроенный
  медиа-менеджер CMS.

Все поля описаны в `admin/config.yml` и ведут в единый файл `data/content.json`,
который на лету читает `js/app.js`.

## 5. Дизайн-система

| Токен | Значение | Где используется |
|---|---|---|
| `obsidian` | `#0B0B0F` | Фон страницы |
| `graphite` | `#121218` | Градиентные секции |
| `pearl` | `#F9F9FB` | Заголовки |
| `platinum` | `#94A3B8` | Основной текст |
| `gold-light → gold → gold-dark` | `#E2C99D → #D4AF37 → #B8975E` | Кнопки, рамки, свечение |

Шрифты: **Clash Display** (Fontshare CDN, с фолбэком на **Syne**) для заголовков,
**Inter** для основного текста. Все токены заданы в `tailwind.config` внутри
`index.html` — их легко перекрасить под другой бренд.

## 6. Замена фото

По умолчанию все изображения — временные плейсхолдеры с `picsum.photos`.
Замените их либо через CMS (галерея «До/После»), либо вручную в
`data/content.json` / `index.html`, указав пути к своим файлам (например,
`images/hero.jpg`).

## 7. Технические детали реализации

- **Scroll-reveal**: `IntersectionObserver` в `setupScrollReveal()` добавляет
  класс `.is-visible` элементам с атрибутом `data-animate` (плавное
  `translateY(20px) scale(0.98) → translateY(0) scale(1)`, `1000ms cubic-bezier(0.16, 1, 0.3, 1)`).
- **Слайдер До/После**: чистый JS в `setupBeforeAfterSliders()`, управление
  мышью/тачем без задержек, золотое свечение у разделителя (`.ba-handle`).
- **Квиз-калькулятор**: `quizState` хранит ответы 3 шагов, цена считается как
  `площадь × цена_за_м² × модификатор_типа`, форматируется в KZT.
- **Маска телефона**: `setupPhoneMask()` — формат `+7 (7XX) XXX-XX-XX`, первая
  цифра после `+7` зафиксирована как `7` (все операторские коды в Казахстане
  начинаются на 7); кнопка отправки заблокирована, пока не введены все 10 цифр.
