# Estudos para Concursos (PWA)
App estático (HTML/CSS/JS puro). Dados no IndexedDB do navegador; backup JSON em Configurações. Sem variáveis de ambiente nem banco externo.

- Testes: `npm test` (Node 18+)
- Build: `npm run build` → publique a pasta `dist/`
- Local: `cd dist && python3 -m http.server` e abra `localhost:8000`
- Deploy: qualquer hospedagem estática com HTTPS (Netlify/Cloudflare Pages/GitHub Pages; build `npm run build`, diretório `dist`). No celular: "Adicionar à tela inicial".
