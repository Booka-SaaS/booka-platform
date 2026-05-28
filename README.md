# Booka

Booka e uma plataforma SaaS para conectar negocios de alimentacao, com foco inicial em restaurantes de sushi, a profissionais/freelancers e servicos com agenda. O estado atual do monorepo entrega cadastro/login, marketplace publico de profissionais, perfil de loja/profissional, servicos, clientes, agendamentos, bloqueios de agenda, dashboard, onboarding e recuperacao de senha por token.

## Contexto do monorepo

O repositorio oficial e `Booka-SaaS/booka-platform`. Ele foi criado a partir da uniao de projetos separados de frontend e backend, preservando `frontend/` e `backend/` como areas independentes.

Repositorios historicos detectados nos remotes do monorepo:

- Frontend principal: `https://github.com/TrueTrailBlazer/booka-frontend`
- Backend principal: `https://github.com/RubensGJ/BookaBackendV2`
- Frontend alternativo: `https://github.com/Giullianoads/booka-frontend`
- App alternativo: `https://github.com/Giullianoads/booka-app`

Os repositorios `https://github.com/Booka-SaaS/booka-frontend` e `https://github.com/Booka-SaaS/booka-backend` devem ser verificados quando estiverem acessiveis; nesta base, as origens efetivas estao registradas como remotes auxiliares.

## Arquitetura

```text
Frontend Angular na Vercel
  -> Backend Express no Render
    -> PostgreSQL no Supabase
```

## Estrutura

```text
booka-platform/
|-- frontend/        Angular 19, Angular SSR/static build, Tailwind, RxJS
|-- backend/         Node.js, Express, TypeScript, Prisma, PostgreSQL
|-- database/        SQL para Supabase e consultas de validacao
|-- docs/            analises e documentacao historica
|-- render.yaml      blueprint do backend no Render
|-- DEPLOY.md        passo a passo de deploy
|-- .env.example     referencia de variaveis
`-- README.md
```

## Tecnologias

Frontend:

- Angular 19
- Angular SSR/build application
- Tailwind CSS
- RxJS
- Cypress e Karma/Jasmine configurados

Backend:

- Node.js
- TypeScript
- Express
- Prisma
- PostgreSQL/Supabase
- Zod
- JWT
- bcryptjs
- Swagger UI

## Funcionalidades atuais

- Cadastro, login e `GET /auth/me`
- Recuperacao de senha por token interno
- Onboarding profissional
- Perfil/loja do profissional
- Marketplace publico de profissionais
- Detalhe publico e disponibilidade por data
- Servicos
- Clientes
- Agendamentos publicos e privados
- Bloqueios de agenda
- Dashboard/resumo
- Notificacoes no schema

Ainda nao ha tabelas/rotas reais para vagas, candidaturas, convites, administradores dedicados, CPF ou avaliacoes como entidade separada. Avaliacao existe hoje como campos agregados no perfil profissional.

## Rodando localmente

Backend:

```bash
cd backend
npm install
copy .env.example .env
docker compose up -d
npm run prisma:generate
npm run prisma:migrate
npm run seed
npm run dev
```

Frontend:

```bash
cd frontend
npm install
npm start
```

URLs locais:

- Frontend: `http://localhost:4200`
- Backend: `http://localhost:3001`
- Swagger: `http://localhost:3001/docs`
- Health: `http://localhost:3001/health`
- Banco: `GET http://localhost:3001/test/db-status`

## Variaveis

Backend:

```env
NODE_ENV=production
PORT=10000
DIRECT_URL=
DATABASE_URL=
JWT_SECRET=
JWT_TTL_SECONDS=604800
FRONTEND_URL=
CLIENT_ORIGINS=
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Frontend:

```env
BOOKA_API_URL=
```

`BOOKA_API_URL` deve apontar para a URL publica do backend no Render. O build tambem aceita `VITE_API_URL`, `NG_APP_API_URL` ou `NEXT_PUBLIC_API_URL` como alias, mas `BOOKA_API_URL` e o padrao documentado para este Angular.

Nunca exponha no frontend:

- `DATABASE_URL`
- `JWT_SECRET`
- `SUPABASE_SERVICE_ROLE_KEY`
- tokens privados
- segredos relacionados a CPF, caso essa funcionalidade exista no futuro

## Scripts

Backend:

- `npm run dev`
- `npm run build`
- `npm start`
- `npm run prisma:generate`
- `npm run prisma:migrate`
- `npm run prisma:deploy`
- `npm run prisma:studio`
- `npm run seed`

Frontend:

- `npm start`
- `npm run build`
- `npm test`
- `npm run cypress:open`
- `npm run cypress:run`

## Rotas principais

Publicas:

- `GET /health`
- `GET /test/db-status`
- `GET /docs`
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/recuperar-senha`
- `POST /auth/nova-senha`
- `GET /profissionais`
- `GET /profissionais/:id`
- `GET /profissionais/:id/disponibilidade?data=YYYY-MM-DD`
- `POST /agendamentos/publicos`

Protegidas:

- `GET /auth/me`
- `GET /loja`
- `PUT /loja`
- `POST /onboarding/finalizar`
- `GET /servicos`
- `POST /servicos`
- `PUT /servicos/:id`
- `DELETE /servicos/:id`
- `GET /clientes`
- `GET /clientes/:id`
- `POST /clientes`
- `PUT /clientes/:id`
- `DELETE /clientes/:id`
- `GET /agendamentos`
- `POST /agendamentos`
- `PUT /agendamentos/:id`
- `DELETE /agendamentos/:id`
- `GET /bloqueios`
- `GET /bloqueios/:id`
- `POST /bloqueios`
- `PUT /bloqueios/:id`
- `DELETE /bloqueios/:id`
- `GET /dashboard/resumo`

## Deploy

Leia [DEPLOY.md](./DEPLOY.md).

Ordem correta:

1. Supabase: criar projeto, rodar `database/schema.sql`, copiar connection string.
2. Render: publicar `backend/`, configurar variaveis e testar `/health` e `/test/db-status`.
3. Vercel: publicar `frontend/`, configurar `BOOKA_API_URL` e validar chamadas para a API.

## Seguranca

- `.env` reais nao devem ser versionados.
- Senhas sao armazenadas como hash bcrypt.
- `DATABASE_URL` e `JWT_SECRET` ficam apenas no backend.
- Reset de senha nao retorna token em `NODE_ENV=production`.
- CORS usa `FRONTEND_URL`/`CLIENT_ORIGINS`; nao use `*` em producao.
- Erros de banco sao retornados de forma controlada.

## Status e proximos passos

O projeto esta preparado para Supabase/Render/Vercel no nivel de configuracao e documentacao. Pendencias funcionais futuras incluem envio real de email para reset de senha, avaliacoes como entidade propria, vagas/candidaturas/convites, painel administrativo dedicado, observabilidade e testes automatizados de fluxo completo.
