export default {
  "*.{js,jsx,ts,tsx}": ['echo "eslint --fix"', 'echo "prettier --write"'],
  "!(package)*.json": ['echo "prettier --write--parser json"'],
  "package.json": ['echo "prettier --write"'],
  "*.vue": ['echo "eslint --fix', 'echo "prettier --write"'],
  "*.{vue,css,scss,postcss,less}": ['echo "prettier --write"'],
  "*.md": ['echo "prettier --write"'],
};
