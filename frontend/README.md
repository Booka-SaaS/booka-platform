# Booka Frontend

Aplicacao web do Booka para marketplace de agendamento de servicos. O frontend fica separado do backend e do app mobile dentro do monorepo.

## Stack

- Angular 19
- TypeScript
- Tailwind CSS
- DaisyUI
- Cypress

## Instalacao

```bash
cd frontend
npm install
```

## Execucao local

```bash
npm start
```

URL local padrao: `http://localhost:4200`.

## Variaveis de ambiente

Use `frontend/.env.example` como referencia:

```env
BOOKA_API_URL=http://localhost:3001
BOOKA_GOOGLE_CLIENT_ID=fake-google-client-id.apps.googleusercontent.com
```

Durante o build, o script `scripts/write-env.cjs` gera `public/env.js` para expor somente configuracoes publicas ao navegador. Nao coloque `DATABASE_URL`, `JWT_SECRET`, chaves privadas ou credenciais reais no frontend.

## Scripts

```bash
npm run build
npm test
npm run cypress:run
npm run cypress:open
```

## Integracao com backend

O frontend consome a API REST do backend pelo valor `environment.apiUrl`, que pode ser definido por `BOOKA_API_URL` no build/deploy. Em desenvolvimento, o fallback e `http://localhost:3001`.

Rotas e fluxos principais:

- marketplace e busca em `/` e `/explorar`
- agendamento publico em `/agendar/:id`
- login, cadastro e recuperacao de senha
- dashboard do profissional
- clientes, servicos, agenda, disponibilidade, bloqueios e onboarding

## Deploy na Vercel

- Root directory: `frontend`
- Build command: `npm run build`
- Output: `dist/booka-frontend/browser`
- Variavel recomendada: `BOOKA_API_URL`
