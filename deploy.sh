set -e

npm run build

cd docs/.vitepress/dist

git init
git add -A
git commit -m 'deploy'


