# Booka Backend V2

Backend novo do Booka, reconstruido a partir do frontend atual. Este projeto cobre o painel do profissional e as rotas publicas do marketplace, com contrato em `camelCase`, autentificacao JWT e PostgreSQL via Prisma.

## Objetivo

O backend antigo nao batia com o frontend atual. O `BookaBackendV2` nasceu para resolver isso sem remendar o schema anterior.

Escopo coberto hoje:

- autenticacao com `register`, `login` e `me`
- onboarding e perfil basico da loja
- CRUD de servicos
- CRUD de clientes
- CRUD de agendamentos do painel
- criacao publica de agendamento
- CRUD de bloqueios de agenda
- listagem publica de profissionais
- detalhe publico do profissional
- disponibilidade publica por data
- resumo basico do dashboard

## Stack

- Node.js
- TypeScript
- Express
- Prisma
- PostgreSQL
- Zod
- Swagger UI

## Requisitos

- Node.js 20+
- npm 10+
- Docker Desktop

## Portas e servicos

- API: `http://localhost:3001`
- Swagger: `http://localhost:3001/docs`
- Healthcheck: `http://localhost:3001/health`
- PostgreSQL: `127.0.0.1:5434`
- Container do banco: `booka-v2-postgres`

## Variaveis de ambiente

Copie `.env.example` para `.env`.

```bash
copy .env.example .env
```

Valores padrao:

```env
PORT=3001
CLIENT_ORIGINS=http://localhost:4200,http://localhost:5173,http://localhost:3000
DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5434/booka_v2?schema=public
DIRECT_URL=postgresql://postgres:postgres@127.0.0.1:5434/booka_v2?schema=public
JWT_SECRET=change-me-use-a-long-random-secret
JWT_TTL_SECONDS=604800
```

Observacoes:

- `JWT_SECRET` precisa ter pelo menos 16 caracteres.
- `CLIENT_ORIGINS` precisa listar as origens locais permitidas, separadas por virgula.
- `DATABASE_URL` e usada pela API em runtime.
- `DIRECT_URL` e usada pelo Prisma para migrations e comandos administrativos.
- `JWT_TTL_SECONDS=604800` equivale a 7 dias.

## Como rodar pela primeira vez

1. Entre na pasta do projeto.
2. Copie o `.env`.
3. Suba o PostgreSQL no Docker.
4. Instale as dependencias.
5. Gere o Prisma Client.
6. Aplique as migrations.
7. Rode o seed.
8. Suba a API.

```bash
cd C:\Users\estagiocotin1\Downloads\Workspace\BookaBackendV2
copy .env.example .env
docker compose up -d
npm install
npm run prisma:generate
npm run prisma:migrate
npm run seed
npm run dev
```

Quando tudo subir corretamente:

- `GET /health` deve responder `ok`
- `GET /docs` deve abrir o Swagger

## Fluxo do dia a dia

Subir banco:

```bash
docker compose up -d
```

Rodar API em desenvolvimento:

```bash
npm run dev
```

Compilar o projeto:

```bash
npm run build
```

Abrir painel visual do banco:

```bash
npm run prisma:studio
```

Repopular dados iniciais:

```bash
npm run seed
```

## Scripts

- `npm run dev`: sobe a API com recarga automatica usando `tsx watch`
- `npm run build`: compila TypeScript para `dist/`
- `npm run start`: executa a versao compilada
- `npm run prisma:generate`: gera o Prisma Client a partir do `schema.prisma`
- `npm run prisma:migrate`: cria/aplica migrations em desenvolvimento
- `npm run prisma:deploy`: aplica migrations ja existentes
- `npm run prisma:studio`: abre a interface visual do Prisma
- `npm run seed`: popula o banco com dados iniciais

## Credenciais seed

Usuario profissional inicial:

- email: `profissional@booka.local`
- senha: `12345678`

Dados gerados pelo seed:

- loja publica `Studio Booka`
- perfil profissional publicado
- 2 servicos
- 1 cliente inicial
- 1 agendamento futuro
- disponibilidade semanal de segunda a sexta, das `09:00` as `18:00`

## Autenticacao

As rotas privadas usam JWT no header:

```http
Authorization: Bearer <token>
```

O token vem de:

- `POST /auth/login`
- `POST /auth/register`

Rotas privadas principais:

- `/auth/me`
- `/loja`
- `/onboarding/finalizar`
- `/servicos`
- `/clientes`
- `/agendamentos`
- `/bloqueios`
- `/dashboard/resumo`

## Modulos e rotas

### App

- `GET /health`
- `GET /docs`

### Auth

- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`

### Loja e onboarding

- `GET /loja`
- `PUT /loja`
- `POST /onboarding/finalizar`

### Servicos

- `GET /servicos`
- `POST /servicos`
- `PUT /servicos/:id`
- `DELETE /servicos/:id`

### Clientes

- `GET /clientes`
- `GET /clientes/:id`
- `POST /clientes`
- `PUT /clientes/:id`
- `DELETE /clientes/:id`

### Agendamentos

- `GET /agendamentos`
- `POST /agendamentos`
- `PUT /agendamentos/:id`
- `DELETE /agendamentos/:id`
- `POST /agendamentos/publicos`

### Bloqueios

- `GET /bloqueios`
- `GET /bloqueios/:id`
- `POST /bloqueios`
- `PUT /bloqueios/:id`
- `DELETE /bloqueios/:id`

### Marketplace publico

- `GET /profissionais`
- `GET /profissionais/:id`
- `GET /profissionais/:id/disponibilidade?data=YYYY-MM-DD`

### Dashboard

- `GET /dashboard/resumo`

## Estrutura do projeto

```text
BookaBackendV2/
|-- prisma/
|   |-- migrations/
|   |-- schema.prisma
|   `-- seed.ts
|-- src/
|   |-- config/
|   |-- docs/
|   |-- lib/
|   |-- middleware/
|   |-- modules/
|   |-- app.ts
|   `-- server.ts
|-- docker-compose.yml
|-- package.json
`-- tsconfig.json
```

Leitura rapida:

- `prisma/schema.prisma`: modelo do banco
- `prisma/seed.ts`: dados iniciais
- `src/app.ts`: configuracao do Express e montagem das rotas
- `src/server.ts`: bootstrap da aplicacao
- `src/docs/openapi.ts`: documento OpenAPI consumido pelo Swagger
- `src/middleware/auth.ts`: validacao do Bearer token
- `src/modules/*`: controllers, schemas e services por dominio

## Disponibilidade e agendamento

Regra atual:

- a disponibilidade publica e calculada a partir de `DisponibilidadeSemanal`
- horarios ocupados por agendamentos `PENDENTE` e `CONFIRMADO` bloqueiam o slot
- bloqueios de agenda tambem removem slots disponiveis
- o `fim` do agendamento e calculado no backend com base na duracao do servico

## Banco e migrations

Alterou o `prisma/schema.prisma`:

```bash
npm run prisma:migrate -- --name nome-da-mudanca
```

Depois, se precisar, rode:

```bash
npm run prisma:generate
```

Se quiser abrir o banco visualmente:

```bash
npm run prisma:studio
```

## Usando Supabase como banco

O Supabase usa PostgreSQL, entao o schema Prisma atual continua valido. Como os dados locais sao descartaveis, a troca pode ser feita aplicando as migrations existentes em um projeto Supabase vazio.

1. Crie um projeto no Supabase.
2. No painel do Supabase, abra `Connect` e copie as connection strings do banco.
3. Atualize o `.env`:

```env
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@[REGION].pooler.supabase.com:5432/postgres"
```

Se sua rede tiver IPv6 ou o projeto tiver IPv4 Add-on, `DIRECT_URL` tambem pode ser a conexao direta:

```env
DIRECT_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
```

Depois aplique o banco remoto:

```bash
npm run prisma:generate
npm run prisma:deploy
npm run seed
npm run dev
```

Para confirmar:

```bash
npm run prisma:studio
```

Em desenvolvimento local com Docker, mantenha `DATABASE_URL` e `DIRECT_URL` apontando para `127.0.0.1:5434`.

## Build e execucao compilada

Compilar:

```bash
npm run build
```

Rodar compilado:

```bash
npm run start
```

## Troubleshooting

### Porta 5434 ocupada

Altere a porta publicada no `docker-compose.yml` e ajuste o `DATABASE_URL`.

### Swagger abre, mas as rotas privadas retornam 401

Voce nao enviou header `Authorization: Bearer <token>`.

### `JWT_SECRET` invalido

O valor do `.env` esta curto demais. O projeto exige no minimo 16 caracteres.

### Erro de conexao com banco

Confirme:

- se o container `booka-v2-postgres` esta rodando
- se a porta `5434` esta livre
- se o `DATABASE_URL` do `.env` aponta para `127.0.0.1:5434`

### Mudou o schema e nada refletiu

Voce provavelmente:

- esqueceu de rodar migration
- esqueceu de regenerar o Prisma Client
- ou esta olhando `dist/` em vez de `src/`

## Estado atual

O projeto ja sobe, autentica, responde no Swagger e entrega os fluxos principais do frontend. Ainda assim, isto nao significa que o produto esta finalizado.

Pontos que continuam como proxima camada de trabalho:

- testes automatizados
- upload real de imagem
- recuperacao de senha
- tela de bloqueios integrada no frontend
- avaliacao real de profissionais
- paginacao e filtros mais avancados
- observabilidade e logs estruturados

## Referencias uteis

- Swagger UI: `http://localhost:3001/docs`
- Healthcheck: `http://localhost:3001/health`
- Schema Prisma: [prisma/schema.prisma](./prisma/schema.prisma)
- OpenAPI: [src/docs/openapi.ts](./src/docs/openapi.ts)
