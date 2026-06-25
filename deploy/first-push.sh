#!/bin/bash
# Первый пуш сайта в GitHub. Репозиторий уже инициализирован и закоммичен.
# Использование:
#   1) Создайте ПУСТОЙ репозиторий на github.com (без README/gitignore).
#   2) Скопируйте его URL и запустите:
#        bash deploy/first-push.sh https://github.com/USER/REPO.git
set -euo pipefail
URL="${1:-}"
if [ -z "$URL" ]; then
  echo "Укажите URL репозитория: bash deploy/first-push.sh https://github.com/USER/REPO.git"
  exit 1
fi
cd "$(dirname "$0")/.."
git remote remove origin 2>/dev/null || true
git remote add origin "$URL"
git branch -M main
echo "Пушу в $URL …"
git push -u origin main
echo "✅ Готово. Теперь импортируйте репозиторий в Vercel (см. GIT_DEPLOY.md)."
