# BOOKA Platform

BOOKA Platform e o monorepo oficial do projeto BOOKA dentro da organizacao Booka-SaaS.

BOOKA e uma plataforma SaaS de agendamentos para conectar clientes a profissionais e pequenos negocios de servicos. O produto centraliza descoberta de profissionais, agenda, servicos, clientes, bloqueios de horario e fluxo de reserva publica.

## O que o BOOKA resolve

- Clientes encontram profissionais e servicos disponiveis.
- Clientes criam agendamentos publicos sem precisar acessar o painel profissional.
- Profissionais gerenciam agenda, servicos, clientes, loja/perfil e periodos indisponiveis.
- A plataforma mantem uma API unica para autenticar usuarios e persistir dados em PostgreSQL.

## Perfis de usuario

- `CLIENTE`: pessoa que busca profissionais, visualiza servicos e cria reservas.
- `PROFISSIONAL`: prestador ou negocio que publica perfil, configura loja, cadastra servicos e administra agendamentos.

## Modulos principais

- Marketplace publico de profissionais.
- Pagina publica de agendamento.
- Login e cadastro.
- Onboarding do profissional.
- Dashboard profissional.
- Agenda.
- Servicos.
- Clientes.
- Dados da loja.
- Bloqueios de agenda.
- Perfil e configuracoes.
- API com Swagger.

## Estrutura do monorepo

```text
booka-platform/
|-- frontend/
|-- backend/
|-- docs/
|-- README.md
|-- .env.example
`-- .gitignore
```

- `frontend/`: aplicacao web principal em Angular.
- `backend/`: API principal em Node.js, Express, TypeScript, Prisma e PostgreSQL.
- `docs/`: documentacao tecnica, integracao, importacao e analises.

## Stack

Frontend:

- Angular 19
- Angular SSR
- Tailwind CSS
- RxJS
- Karma/Jasmine
- Cypress configurado para E2E

Backend:

- Node.js
- TypeScript
- Express
- Prisma
- PostgreSQL
- Zod
- JWT
- Swagger UI

Banco local:

- PostgreSQL via Docker Compose.

## Repositorios de origem

- Frontend principal: https://github.com/TrueTrailBlazer/booka-frontend
- Backend principal: https://github.com/RubensGJ/BookaBackendV2

Esses repositorios foram importados para este monorepo sem alterar, apagar, reescrever historico ou fazer push nos repositorios originais.

## Repositorios secundarios analisados

- Frontend alternativo: https://github.com/Giullianoads/booka-frontend
- App alternativo/legado: https://github.com/Giullianoads/booka-app

O que foi aproveitado:

- A ideia de Login com Google virou roadmap tecnico em `docs/roadmap-login-google.md`.
- A base Ionic/Capacitor virou roadmap mobile em `docs/roadmap-mobile.md`.
- A comparacao e as razoes para nao copiar codigo diretamente estao em `docs/analise-repos-alternativos.md`.

O que nao foi copiado:

- Codigo de Login com Google que depende de `POST /auth/google`, ainda inexistente no backend.
- Proxy `/api` apontando para `localhost:3000`, incompativel com a API atual em `localhost:3001`.
- App Ionic completo, porque ele usa Supabase diretamente e criaria uma segunda arquitetura de auth/dados.
- Arquivo `.env` do app alternativo.

## Integracao local

Frontend:

```text
http://localhost:4200
```

Backend:

```text
http://localhost:3001
```

Swagger:

```text
http://localhost:3001/docs
```

Healthcheck:

```text
http://localhost:3001/health
```

O frontend usa:

```ts
apiUrl: 'http://localhost:3001'
```

Arquivos:

- `frontend/src/environments/environment.ts`
- `frontend/src/environments/environment.development.ts`

O backend controla CORS com:

```env
CLIENT_ORIGINS=http://localhost:4200,http://localhost:5173,http://localhost:3000
```

## Variaveis de ambiente

Na raiz existe `.env.example` apenas como guia geral.

No backend, copie:

```bash
cd backend
copy .env.example .env
```

Principais variaveis do backend:

- `PORT`
- `CLIENT_ORIGINS`
- `DATABASE_URL`
- `DIRECT_URL`
- `JWT_SECRET`
- `JWT_TTL_SECONDS`

Arquivos `.env` reais nao devem ser versionados.

## Como rodar o backend

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

Comandos uteis:

```bash
npm run build
npm run prisma:studio
```

## Como rodar o frontend

```bash
cd frontend
npm install
npm start
```

Build:

```bash
npm run build
```

Testes unitarios:

```bash
npm test -- --watch=false --browsers=ChromeHeadless
```

E2E:

```bash
npm run cypress:run
```

O E2E usa Cypress e depende do binario local do Cypress/Chrome estar disponivel na maquina.

## Fluxo de comunicacao

```text
Cliente/Profissional -> Frontend Angular -> API HTTP -> Backend Express -> Prisma -> PostgreSQL
```

Rotas principais do backend:

- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`
- `GET /profissionais`
- `GET /profissionais/:id`
- `GET /profissionais/:id/disponibilidade`
- `POST /agendamentos/publicos`
- `GET /agendamentos`
- `POST /agendamentos`
- `PUT /agendamentos/:id`
- `DELETE /agendamentos/:id`
- `GET /servicos`
- `POST /servicos`
- `PUT /servicos/:id`
- `DELETE /servicos/:id`
- `GET /clientes`
- `POST /clientes`
- `PUT /clientes/:id`
- `DELETE /clientes/:id`
- `GET /loja`
- `PUT /loja`
- `GET /bloqueios`
- `POST /bloqueios`
- `PUT /bloqueios/:id`
- `DELETE /bloqueios/:id`

## Documentacao

- `docs/importacao-repos.md`: como os repositorios principais foram importados.
- `docs/integracao-frontend-backend.md`: portas, variaveis, CORS e teste local.
- `docs/comparacao-versoes.md`: comparacao resumida das versoes.
- `docs/analise-repos-alternativos.md`: analise dos repositorios secundarios.
- `docs/roadmap-login-google.md`: aproveitamento futuro do frontend alternativo.
- `docs/roadmap-mobile.md`: aproveitamento futuro do app Ionic/Capacitor.

## Publicacao

Repositorio oficial:

```text
https://github.com/Booka-SaaS/booka-platform
```

Publicar alteracoes:

```bash
git push origin main
```

Os remotos dos repositorios de origem e referencia devem permanecer apenas para leitura.

## Cuidados

- Nao versionar `.env` reais.
- Nao fazer push para os repositorios originais.
- Nao misturar frontend e backend na mesma pasta.
- Nao copiar codigo de repositorios secundarios sem revisar contratos e arquitetura.
- Manter uma API oficial para evitar regras de negocio duplicadas.
