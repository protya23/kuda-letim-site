# 🚀 Деплой «Куда летим?» на Vercel — пошагово

Сайт готов к деплою (проверка: `npm run site:check` → всё ✅).
Конфиг уже настроен в `vercel.json`: **Build = `npm run build`**, **Output = `dist`**, framework Vite, SPA-rewrites, статические страницы офферов.

---

## Способ A — через сайт Vercel (проще всего, без терминала)

1. **Залить код в GitHub.** Создайте репозиторий и запушьте папку `kuda_letim_site/`.
   *(в репозиторий уже попадут `src/data/offers.json` и `public/offers/*.jpg` — это данные офферов; на Vercel сторонних папок нет, поэтому они едут в репо.)*
2. **Зайти на https://vercel.com** → войти (можно через GitHub).
3. Нажать **Add New… → Project**.
4. В списке репозиториев выбрать ваш → **Import**.
5. Vercel сам определит **Vite**. Поля менять **не нужно** (берутся из `vercel.json`):
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. **(Опционально)** раскрыть **Environment Variables** и вставить нужные (см. ниже).
7. Нажать **Deploy**. Подождать ~1–2 мин.
8. **Live URL** появится на экране: `https://<имя-проекта>.vercel.app` — нажмите **Visit**.

---

## Способ B — через терминал (одна команда)

```bash
cd /Users/work/kuda_letim_site
npx vercel login        # 1 раз — войти вашим аккаунтом (откроется браузер)
npx vercel --prod       # деплой; LIVE URL печатается в конце вывода
```
Готово. URL вида `https://<имя>.vercel.app` будет в последней строке.

---

## Какие env вставлять (все ОПЦИОНАЛЬНЫ — сайт работает и без них)

| Переменная | Что даёт | Нужна? |
|---|---|---|
| `VITE_SITE_URL` | абсолютные ссылки для красивых превью в соцсетях (`https://ваш-url`) | желательно (задать после 1-го деплоя и передеплоить) |
| `LEAD_TG_TOKEN` + `LEAD_TG_CHAT` | заявки с сайта **приходят вам в Telegram** (надёжный канал лидов) | рекомендуется для прод |
| `VITE_GA_ID` **или** `VITE_PLAUSIBLE_DOMAIN` | аналитика (GA4 или Plausible) | по желанию |
| `WHATSAPP_PHONE` | кнопки WhatsApp + трекинг | по желанию |

Полные пояснения — в `.env.example`. В Vercel: **Settings → Environment Variables → Add** (для каждой), затем **Redeploy**.

> `LEAD_TG_*` — отдельные от контент-бота переменные; бота они не трогают. Можно указать тот же токен и ваш chat_id.

---

## 🔄 Обновление сайта после нового батча

После того как бот сгенерировал новый батч (`generate_daily.py`):
```bash
cd /Users/work/kuda_letim_site
npm run offers        # подтянуть свежие офферы из travel_posts + photo_registry
npm run build         # пересобрать
npx vercel --prod     # выкатить
```
**Или одной командой** (всё сразу + деплой):
```bash
bash deploy/sync_site.sh --deploy
```
Для полной автоматизации — добавьте эту строку в `travel_bot/run_generate.sh` или в cron:
```
15 7 * * *  bash /Users/work/kuda_letim_site/deploy/sync_site.sh --deploy >> deploy/sync.log 2>&1
```

---

## Проверка перед деплоем
```bash
npm run site:check
```
Должно быть «✅ ВСЁ ОК — сайт готов к деплою».
