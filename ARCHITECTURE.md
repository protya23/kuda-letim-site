# Архитектура: Telegram ↔ Website (автоматизированная связка)

Сайт и Telegram-канал питаются из **одного источника** — нет ручного дублирования.

```
                 ┌──────────────────────────────────────────────┐
                 │  generate_daily.py  (travel_bot)             │
                 │  + photo_registry (verified_single)          │
                 └───────────────┬──────────────────────────────┘
                                 │ пишет
                 travel_posts/<date>/H*/ (metadata + cover + post.txt)
                 travel_bot/photo_registry.json (проверенное фото на отель)
                                 │
              ┌──────────────────┴───────────────────┐
              │                                       │
      ┌───────▼────────┐                     ┌────────▼─────────────┐
      │  bot.py        │                     │ gen-offers.mjs       │
      │  → Telegram    │                     │ (sync_site.sh)       │
      │  автопостинг   │                     │ → src/data/offers.json│
      │  слоты 10/15/20│                     │ + public/offers/*.jpg │
      └────────────────┘                     └────────┬─────────────┘
                                                      │ vite build
                                              ┌───────▼────────┐
                                              │  Website (dist) │
                                              │  каталог/карточки│
                                              └────────────────┘
```

## Задача 1 — Telegram → Website (как оффер попадает на сайт)
1. `generate_daily.py` создаёт оффер в `travel_posts/<date>/` (тот же, что идёт в Telegram).
2. `scripts/gen-offers.mjs` читает **последний батч** + `photo_registry.json`, копирует **проверенное фото** (registry primary) в `public/offers/`, формирует `src/data/offers.json`.
3. Каждая карточка содержит: **название отеля · страна · фото · обычная цена · цена для клиентов · экономия · описание · ссылка на Telegram** (deep-link с подставленным названием отеля) + WhatsApp (опц.) + Booking (только просмотр).
4. Источник один → новый оффер появляется и в канале, и на сайте автоматически.

## Задача 4 — авто-добавление без ручного участия
`deploy/sync_site.sh`:
- `node scripts/gen-offers.mjs` — пересобирает данные из travel_posts+registry;
- `npm run build` — статическая пересборка `dist/`.

Запуск автоматический — после ежедневной генерации (cron/launchd):
```
15 7 * * *  bash /Users/work/kuda_letim_site/deploy/sync_site.sh >> deploy/sync.log 2>&1
```
или цепочкой в `travel_bot/run_generate.sh` (один поток: generate → sync). В dev-режиме (`npm run dev`) изменения подхватываются мгновенно — `npm run offers` обновляет JSON.

## Задача 2 — структура сайта
- **Главная**: Hero (УТП) → Преимущества → Каталог → Как получаем цены / Почему заранее / Как работает / Доверие / Кому подходит → Отзывы → FAQ → Форма заявки → Финальный CTA → Footer.
- **Каталог** (`Catalog.tsx`): фильтры по **стране** и **бюджету** (до 100к / 100–200к / 200–300к / 300к+), грид карточек.
- **Карточка отеля** (`OfferModal.tsx`): фото + сюжет, цены (обычная/клиентская/экономия), описание, кнопки связи (Telegram + WhatsApp), Booking (просмотр).

## Задача 3 — аналитика (`src/lib/analytics.ts`)
События: `card_view` (IntersectionObserver), `card_open`, `telegram_click`, `whatsapp_click`, `lead_submit`, `filter_change`.
Отправка: GA4 (`gtag`) и Plausible (`plausible`) — если подключены; всегда — локальный счётчик в `localStorage` (`kl_analytics`) + debug в dev. Подключить провайдера: добавить его сниппет в `index.html` — события поедут автоматически.

## Точки выхода
Канал `t.me/zxockerwobk` · менеджер `@traveI_j` · WhatsApp — через `WHATSAPP_PHONE` env (если задан) в `gen-offers.mjs`.
