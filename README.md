# Booka

Monorepo oficial do Booka, consolidado a partir dos repositorios de frontend, backend e mobile usados pela equipe. O projeto e um SaaS de agendamento para profissionais e pequenos negocios, com cadastro/login, onboarding, loja publica, clientes, servicos, disponibilidade, bloqueios de agenda, agendamentos, uploads de avatar/capa e notificacoes.

## Estrutura do monorepo

| Pasta | Origem | Conteudo |
| --- | --- | --- |
| `frontend/` | `TrueTrailBlazer/booka-frontend` branch `dev` | Aplicacao Angular web, marketplace, painel, notificacoes e testes Cypress/Karma. |
| `backend/` | `RubensGJ/BookaBackendV2` branch `master` | API Express/Prisma, API gateway, servico de notificacoes, RabbitMQ, testes Jest, Docker e migrations. |
| `mobile/` | `ThiagoAkatsuka/booka-app` branch `main` | App Angular/Ionic/Capacitor com Android/iOS, telas mobile e testes Cypress. |
| `docs/` | Monorepo | Documentacao de sincronizacao e materiais do projeto. |
| `database/` | Monorepo | Scripts SQL legados de apoio. |

## Tecnologias

- Angular 19, Angular SSR, Tailwind CSS, DaisyUI, Cypress e Karma/Jasmine.
- Node.js, Express, TypeScript, Prisma, PostgreSQL/Supabase, Swagger/OpenAPI.
- API Gateway Express com proxy para core API e notification service.
- Notification service com NestJS, RabbitMQ, Prisma e endpoints REST/SOAP.
- Ionic/Capacitor para mobile Android/iOS.
- Docker Compose para PostgreSQL, RabbitMQ e servicos backend.

## Scripts raiz

O monorepo nao usa workspaces para evitar descaracterizar os repositorios de origem. Os scripts raiz delegam para cada projeto:

```bash
npm run frontend:install
npm run frontend:dev
npm run frontend:build
npm run frontend:test

npm run backend:install
npm run backend:dev
npm run backend:gateway
npm run backend:notifications
npm run backend:build
npm run backend:test
npm run backend:prisma:generate
npm run backend:prisma:deploy

npm run mobile:install
npm run mobile:dev
npm run mobile:build
npm run mobile:e2e
```

## Como rodar o backend

```bash
cd backend
npm ci
cp .env.example .env
docker compose up -d postgres rabbitmq
npm run prisma:generate
npm run prisma:migrate
npm run seed
npm run dev
```

Servicos adicionais do backend:

```bash
npm run dev:gateway
npm run dev:notifications
```

Portas padrao:

- Core API: `http://localhost:3001`
- API Gateway: `http://localhost:3000`
- Notification service: `http://localhost:3002`
- Swagger: `http://localhost:3001/docs`
- RabbitMQ Management: `http://localhost:15672`

## Banco e Prisma

O backend usa PostgreSQL via Prisma. Para desenvolvimento local, o `backend/docker-compose.yml` publica o banco em `127.0.0.1:5434`.

Variaveis essenciais:

- `DATABASE_URL`: conexao runtime da API e servico de notificacoes.
- `DIRECT_URL`: conexao administrativa usada por migrations Prisma.
- `JWT_SECRET`: segredo JWT com pelo menos 16 caracteres.
- `RABBITMQ_URL`: broker usado no fluxo de eventos/notificacoes.

Para Supabase, use a URL pooler em `DATABASE_URL` e a conexao direta em `DIRECT_URL`, sem commitar secrets reais.

## Como rodar o frontend

```bash
cd frontend
npm ci
npm start
```

O frontend de origem usa `src/environments/environment.development.ts` e `src/environments/environment.ts`. Em desenvolvimento aponta para a core API local; em producao aponta para o gateway em `/api`.

Build:

```bash
npm run build
```

## Como rodar o mobile

```bash
cd mobile
npm ci
npm start
```

Build web:

```bash
npm run build
```

Capacitor:

```bash
npx cap sync
npx cap open android
npx cap open ios
```

## Variaveis de ambiente

Arquivos de exemplo mantidos no monorepo:

- `.env.example`: visao consolidada para desenvolvimento local.
- `backend/.env.example`: variaveis reais consumidas pelo backend de origem.
- `frontend/.env.example`: referencia documental; o frontend atual usa arquivos `environment`.
- `mobile/.env.example`: referencia documental; o mobile atual usa arquivos `environment`.

Nao insira secrets reais nos exemplos.

## Deploy

- `vercel.json` na raiz aponta para `frontend/` e usa `frontend/dist/booka-frontend/browser`.
- `render.yaml` aponta para `backend/` e esta alinhado ao core backend atualizado.
- O backend atualizado tambem possui `backend/Dockerfile` e `backend/docker-compose.yml` para subir core API, gateway, notification service, PostgreSQL e RabbitMQ.
- Para producao completa com notificacoes, provisione PostgreSQL, RabbitMQ e URLs entre core API, gateway e notification service.

## Funcionalidades implementadas confirmadas

- Autenticacao JWT, cadastro, login, recuperacao e redefinicao de senha.
- Onboarding e dados de loja/profissional.
- Integracao ViaCEP no cadastro/endereco.
- Clientes, servicos, profissionais e dashboard.
- Agendamentos publicos e privados, disponibilidade semanal e bloqueios de agenda.
- Upload de avatar e capa da loja.
- Marketplace/public booking flow.
- Notificacoes via nova camada de gateway, notification service, RabbitMQ e endpoints REST/SOAP.
- App mobile Angular/Ionic/Capacitor com Android/iOS e fluxos de painel/agendamento.

## Repositorios usados na consolidacao

- `https://github.com/ThiagoAkatsuka/booka-app`
- `https://github.com/TrueTrailBlazer/booka-frontend`
- `https://github.com/RubensGJ/BookaBackendV2`

Detalhes de branches, commits e decisoes estao em `docs/SINCRONIZACAO_REPOSITORIOS.md`.

## Checklist academico

O checklist solicitado pelo professor esta consolidado em `docs/CHECKLIST_PROFESSOR.md`, com status e evidencias dos 10 itens: Web API com dois frameworks, SOAP/REST, microsservicos, API Gateway, autenticacao/autorizacao, testes, automacao, seguranca e arquitetura.

## Status atual

Estado sincronizado e validado em 11/06/2026 na branch `chore/atualizacao-completa-monorepo`. O frontend e o backend receberam commits novos dos repositorios de origem; o mobile foi conferido e permanece no mesmo commit ja consolidado anteriormente.
