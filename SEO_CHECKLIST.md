# SEO checklist — «Куда летим?»

Статус на момент сборки (проверяется `npm run site:check`).

| Элемент | Главная `/` | Страница оффера `/offer/:id` | Где |
|---|---|---|---|
| **title** | ✅ «Куда летим? — путешествия дешевле…» | ✅ «{Отель}, {Страна} — {цена} (−{%}) \| Куда летим?» | `index.html` / `useSeo` + `gen-offer-pages.mjs` |
| **description** | ✅ статичный | ✅ «{отель} ({страна}): обычная X, для клиентов Y, экономия Z…» | то же |
| **OG (og:title/description/type)** | ✅ | ✅ per-offer | `index.html` / `gen-offer-pages.mjs` |
| **og:image** | — (можно добавить общий баннер) | ✅ фото отеля (абсолютный при `VITE_SITE_URL`) | `gen-offer-pages.mjs` / `useSeo` |
| **twitter:card** | — | ✅ summary_large_image | то же |
| **canonical** | ✅ `<base>/` | ✅ `<base>/offer/:id` | `index.html` (скрипт) / `useSeo` + `gen-offer-pages.mjs` |
| **robots** | ✅ `Allow: /` | ✅ | `dist/robots.txt` |
| **sitemap** | ✅ в sitemap (priority 1.0) | ✅ все 25 (priority 0.8) | `dist/sitemap.xml` (26 URL) |
| **lang** | ✅ `<html lang="ru">` | ✅ | `index.html` |
| **favicon** | ✅ inline svg | ✅ | `index.html` |

## Что включается только после `VITE_SITE_URL`
Без `VITE_SITE_URL` базовый URL в sitemap/robots/canonical = плейсхолдер `https://kuda-letim.vercel.app`, og:image — относительный.
**После деплоя:** задайте `VITE_SITE_URL=https://<ваш-домен>` в Vercel env → **Redeploy**. Тогда:
- sitemap/robots/canonical/og:image станут абсолютными с вашим доменом;
- `npm run site:check` подтвердит зелёным.

## Пост-деплой (вне кода, делаете вы)
- [ ] Google Search Console → добавить ресурс → отправить `https://<домен>/sitemap.xml`.
- [ ] (опц.) Yandex Webmaster → то же.
- [ ] Проверить превью ссылки в Telegram/соцсетях (OG) — отправить `https://<домен>/offer/H1` себе.
- [ ] Подключить аналитику: задать `VITE_GA_ID` или `VITE_PLAUSIBLE_DOMAIN`.
