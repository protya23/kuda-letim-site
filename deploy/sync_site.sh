#!/bin/bash
# ============================================================================
# Авто-обновление сайта после нового батча (Task 1 + 4).
# Тянет данные из ТОГО ЖЕ источника, что публикует бот
# (../travel_posts/<latest> + ../travel_bot/photo_registry.json), копирует
# проверенные фото и пересобирает сайт. Read-only на источник — безопасно
# гонять по расписанию после каждого generate_daily.
#
# Поток (полностью автоматический):
#   generate_daily.py → travel_posts/ + photo_registry.json
#        └─ sync_site.sh: npm run offers → src/data/offers.json + public/offers/*
#              └─ npm run build → dist/ (+ статические /offer/<id>)
#                   └─ (опц.) vercel --prod   ← с флагом --deploy
#
# Использование:
#   bash deploy/sync_site.sh             # обновить данные + собрать dist/
#   bash deploy/sync_site.sh --deploy    # + задеплоить на Vercel (нужен vercel login)
#   bash deploy/sync_site.sh --no-build  # только данные (для dev — vite подхватит)
# ============================================================================
set -euo pipefail
SITE="$(cd "$(dirname "$0")/.." && pwd)"
cd "$SITE"
MODE="${1:-}"

echo "[sync] $(date '+%Y-%m-%d %H:%M:%S') — offers из travel_posts + photo_registry"
npm run offers

if [ "$MODE" = "--no-build" ]; then
  echo "[sync] данные обновлены (offers.json + public/offers). Сборку пропускаю (--no-build)."
  exit 0
fi

echo "[sync] сборка → dist/ + health-check"
npm run build >/dev/null
node scripts/site-check.mjs

if [ "$MODE" = "--deploy" ]; then
  echo "[sync] деплой на Vercel (npx vercel --prod)…"
  npx vercel --prod
  echo "[sync] готово — live URL выведен выше."
else
  echo "[sync] dist/ обновлён. Для прод: 'git push' (Vercel пересоберёт) или 'npx vercel --prod'."
fi

# ── Cron-пример (запуск через 15 мин после ежедневной генерации) ────────────
#   15 7 * * *  /bin/bash /Users/work/kuda_letim_site/deploy/sync_site.sh --deploy >> /Users/work/kuda_letim_site/deploy/sync.log 2>&1
# Или добавить эту строку в конец travel_bot/run_generate.sh — один поток generate→sync→deploy.
