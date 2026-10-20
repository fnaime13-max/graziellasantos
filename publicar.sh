#!/usr/bin/env bash
# Publica o site no GitHub Pages: https://fnaime13-max.github.io/graziellasantos/
set -e
cd "$(dirname "$0")"
TOKEN=$(printf 'protocol=https\nhost=github.com\n\n' | git credential fill | sed -n 's/^password=//p')
API=https://api.github.com
H=(-H "Authorization: token $TOKEN" -H "Accept: application/vnd.github+json")
curl -s "${H[@]}" $API/user/repos -d '{"name":"graziellasantos","description":"Site Graziella Santos - Nutricionista"}' > /dev/null
git remote add origin https://github.com/fnaime13-max/graziellasantos.git 2>/dev/null || true
git push -u origin main
curl -s "${H[@]}" $API/repos/fnaime13-max/graziellasantos/pages -d '{"source":{"branch":"main","path":"/"}}' > /dev/null
echo "Publicado: https://fnaime13-max.github.io/graziellasantos/ (leva 1-2 min para aparecer)"
