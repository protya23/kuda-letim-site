# 🚀 GitHub + Vercel — готовый набор команд

Папка `kuda_letim_site/` **уже** инициализирована как git-репозиторий и закоммичена
(83 файла, ветка `main`, без `node_modules`/`dist`). Вам осталось: создать репозиторий
на GitHub, запушить, импортировать в Vercel.

---

## 1–3. Git, .gitignore, первый commit — УЖЕ СДЕЛАНО ✅
Если будете повторять с нуля, вот те же шаги:
```bash
cd /Users/work/kuda_letim_site
git init
git add -A
git commit -m "Куда летим? — сайт"
```
`.gitignore` уже настроен: исключены `node_modules`, `.npmcache`, `dist`, `.env`, `leads.*`;
**включены** `src/data/offers.json` и `public/offers/*.jpg` (данные офферов — деплоятся).

## 4. Создать репозиторий на GitHub
1. Зайти на **https://github.com/new**.
2. **Repository name:** `kuda-letim-site` (любое).
3. **Private** или **Public** — на ваш выбор.
4. ⚠️ **НЕ** ставить галочки «Add README», «Add .gitignore», «license» (репозиторий должен быть ПУСТЫМ).
5. Нажать **Create repository**.
6. Скопировать URL вида `https://github.com/ВАШ_ЛОГИН/kuda-letim-site.git`.

## 5. Запушить
**Одной командой** (подставьте свой URL):
```bash
bash deploy/first-push.sh https://github.com/ВАШ_ЛОГИН/kuda-letim-site.git
```
*(при запросе логина/пароля используйте GitHub username + Personal Access Token вместо пароля: github.com → Settings → Developer settings → Tokens.)*

Или вручную:
```bash
cd /Users/work/kuda_letim_site
git remote add origin https://github.com/ВАШ_ЛОГИН/kuda-letim-site.git
git branch -M main
git push -u origin main
```

## 6. Импорт в Vercel
1. **https://vercel.com** → войти **Continue with GitHub**.
2. **Add New… → Project**.
3. Найти репозиторий `kuda-letim-site` → **Import**.
4. Framework определится как **Vite**. Ничего не менять (Build `npm run build`, Output `dist` — из `vercel.json`).
5. (Рекомендуется) раскрыть **Environment Variables** → добавить (п. 7).
6. **Deploy** → подождать ~1–2 мин.

## 7. Какие env вставить (в Vercel → Environment Variables)
| Переменная | Значение | Нужна? |
|---|---|---|
| `VITE_SITE_URL` | `https://<имя-проекта>.vercel.app` | желательно (можно после 1-го деплоя → Redeploy) |
| `LEAD_TG_TOKEN` | токен бота для заявок | рекомендуется |
| `LEAD_TG_CHAT` | ваш chat_id (@userinfobot) | рекомендуется |
| `VITE_GA_ID` / `VITE_PLAUSIBLE_DOMAIN` | аналитика | опц. |
| `WHATSAPP_PHONE` | `79991234567` | опц. |
Все необязательны для запуска; пояснения — в `.env.example`.

## 8. Live URL и проверка
- После Deploy на экране — кнопка **Visit** → `https://<имя>.vercel.app`.
- Проверить:
  - `/` — каталог, фильтры, карточки;
  - `/offer/H1` — страница оффера, кнопка «Проверить цену в Telegram»;
  - `/sitemap.xml` (26 URL), `/robots.txt`;
  - форма заявки → приходит в Telegram (если задали `LEAD_TG_*`).
- Задать `VITE_SITE_URL` → **Settings → Deployments → ⋯ → Redeploy** (sitemap/OG станут абсолютными).

## 9. Если Vercel показал ошибку build
1. Открыть **Deployments → (упавший) → View Logs**.
2. Частые причины и решения:
   - **`offers.json` пустой / нет офферов** — норма для Vercel (нет `../travel_posts`); сайт берёт закоммиченный `src/data/offers.json`. Убедитесь, что он в репозитории: `git ls-files | grep offers.json`. Если нет — `npm run offers && git add -A && git commit -m data && git push`.
   - **`tsc` ошибка типов** — локально прогоните `npm run build`, исправьте, закоммитьте.
   - **Node version** — Vercel → Settings → General → Node.js Version: **20.x**.
   - Локальная самопроверка перед пушем: `npm run site:check` (должно быть «✅ ВСЁ ОК»).

## 10. Обновление сайта после нового батча
После генерации нового батча ботом:
```bash
cd /Users/work/kuda_letim_site
npm run offers                 # подтянуть свежие офферы (travel_posts + photo_registry)
git add -A && git commit -m "offers update" && git push
```
Vercel автоматически пересоберёт и выкатит (git push → auto-deploy).
**Или одной командой** (данные + сборка + деплой через Vercel CLI):
```bash
bash deploy/sync_site.sh --deploy
```

---
**Не тронуто:** Telegram-бот, autopost, `photo_registry`. Сайт только читает данные.
