# Куда летим? — тестовый сайт

Продающий лендинг travel-сервиса закрытых предложений. Собран как проверка `DESIGN_SYSTEM` на реальном проекте.

> Отдельный тестовый проект. **Не трогает** Telegram-бот, автопостинг и архив. Данные из `../travel_posts` читаются только на чтение (обложки копируются в `public/offers/`).

## Дизайн v3 — premium redesign ($50k-look)
Полностью новый интерфейс в стиле **Stripe · Linear · Raycast · Airbnb · Luxury Escapes**. Контент и логика сохранены, переписан весь визуальный слой.
- **Framer Motion** — анимации входа (stagger/reveal на scroll), parallax hero (`useScroll`/`useTransform`), spring-hover карточек, анимированная аврора, AnimatePresence для модалки и мобильного меню.
- **Dark-first cinematic** (по умолчанию) + рафинированная light-тема (Stripe-стиль). Переключатель в шапке, выбор в localStorage, без мерцания.
- **Glassmorphism** — `.glass` (blur + saturate + inner highlight), hairline-градиентные рамки `.ring-grad`.
- **Stripe-градиенты** — `.text-gradient`, `.btn-grad`, аврора-блобы (violet/teal/coral).
- **Огромная типографика** — fluid `clamp()` до 12rem в hero (Sora).
- **Карточки Airbnb-уровня** — фото с зумом, оверлей-градиент, glass-бейджи, плавающий рейтинг/скидка.
- **Мобайл как отдельный продукт** — full-screen меню с крупной типографикой и поэтапной анимацией пунктов; bottom-sheet модалка.
- Зерно `.grain`, scroll-cue, sticky glass-навбар.

Ключевые новые файлы: `src/lib/motion.tsx` (Reveal/Stagger), `components/Aurora.tsx`, `components/Hero.tsx`, `components/Header.tsx`; переписаны `OfferCard`, `OfferModal`, `Offers`, `Faq`, `App`, `index.css`.
Скриншоты: `redesign_hero.jpeg` (dark) · `redesign_offers.jpeg` · `redesign_offer_detail.jpeg` · `redesign_mobile_hero.jpeg` · `redesign_mobile_menu.jpeg`.

## Возможности (v2)
- **Мобильное меню** — бургер: Предложения / Как работает / Почему дешевле / FAQ + «Написать менеджеру».
- **Dark/Light переключатель** — по умолчанию light, выбор сохраняется в localStorage, без мерцания. Тёмная тема — luxury (глубокий navy-чёрный + тёплые акценты), не инверсия.
- **Детали предложения (модалка)** — большое фото, отель, страна, даты, ночи, цены, экономия, главный CTA «Забронировать через Telegram».
- **Telegram-ссылка с отелем** — `?text=Хочу проверить цену на [отель]` + копируемый текст рядом (на случай, если клиент Telegram не подставит текст в direct-link).
- **Booking — только просмотр** — «Посмотреть отель и фото на Booking» + пометка «бронь и финальная цена через Telegram». Бронь только через `@traveI_j`.

## Стек
Vite + React + TypeScript + Tailwind CSS v4 (без рантайм-зависимостей кроме React).

## Запуск
```bash
cd /Users/work/kuda_letim_site
npm install --cache ./.npmcache   # системный npm-кэш повреждён root-файлами, используем локальный
npm run dev                       # http://127.0.0.1:5173  (сначала генерит offers.json)
npm run build                     # прод-сборка в dist/
```

## Структура
```
index.html                 точка входа + favicon + шрифты (Sora/Inter)
vite.config.ts             Vite + react + @tailwindcss/vite
src/
  index.css                токены палитры "travel" из KIRILL_DESIGN_SYSTEM (@theme)
  links.ts                 ★ все точки выхода (TG-канал + менеджер @traveI_j с большой I)
  App.tsx                  все секции: Hero, Offers, HowPrices, WhyEarly,
                           HowItWorks, Trust, ForWhom, FAQ, FinalCTA, Footer
  components/
    TelegramButton.tsx     кнопка-CTA в Telegram (primary/secondary/light)
    OfferCard.tsx          ★ дорогая карточка предложения
    Offers.tsx             грид предложений + индикатор источника
    Faq.tsx                аккордеон (8 вопросов)
    icons.tsx              inline-SVG иконки
  data/offers.json         СГЕНЕРИРОВАНО build-скриптом (не редактировать руками)
scripts/gen-offers.mjs     ★ интеграция с travel_posts (read-only) + fallback mock
public/offers/*.jpg        обложки, скопированные из travel_posts
```

## Интеграция с travel_posts (как это работает сейчас)
`scripts/gen-offers.mjs` при каждом `npm run dev|build`:
1. Находит последнюю папку-дату в `../travel_posts/` (сейчас `2026-06-24`).
2. Читает `H*/metadata.json`, отбрасывает не прошедшие quality_gate.
3. Копирует `cover.jpg` → `public/offers/<id>.jpg`.
4. Сортирует по скидке/рейтингу, берёт топ-6 → `src/data/offers.json`.
5. Если папки нет — подставляет встроенные mock-данные (6 шт.).

Сейчас на сайте — **реальные 6 предложений** из `travel_posts/2026-06-24` (Santorini, Belek, Bali, Montenegro, Dubai...).

## Как подключить «живые» предложения в будущем
- **Самое простое (сейчас):** обновлять контент в `travel_posts` как обычно → пересобрать сайт (`npm run build`). Скрипт сам подтянет свежую дату.
- **Авто-обновление:** повесить `npm run offers` в cron/после генерации постов бота — `offers.json` будет обновляться без пересборки (в dev Vite подхватит сразу).
- **Полноценный API:** заменить чтение файлов в `gen-offers.mjs` на endpoint бота (`GET /offers`) → фронт грузит JSON в рантайме (добавить fetch в `Offers.tsx`). Схема полей уже совпадает с `metadata.json`.
- **Бронирование:** сейчас кнопки ведут в Telegram к менеджеру. Можно добавить параметр в ссылку (`?start=H4`), чтобы менеджер сразу видел, какой отель смотрел клиент.
