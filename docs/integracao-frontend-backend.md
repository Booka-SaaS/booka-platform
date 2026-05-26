# Integração Frontend + Backend

## Objetivo

Conectar o frontend principal importado de `TrueTrailBlazer/booka-frontend` ao backend principal importado de `RubensGJ/BookaBackendV2` dentro do monorepo `booka-platform`, mantendo cada aplicação em sua própria pasta.

## Portas locais

| Aplicação | Pasta | Comando | Porta |
| --- | --- | --- | --- |
| Frontend Angular | `frontend/` | `npm start` | `http://localhost:4200` |
| Backend Express | `backend/` | `npm run dev` | `http://localhost:3001` |
| Swagger backend | `backend/` | backend em execução | `http://localhost:3001/docs` |
| Healthcheck backend | `backend/` | backend em execução | `http://localhost:3001/health` |
| PostgreSQL local | `backend/` | `docker compose up -d` | `127.0.0.1:5434` |

## Variáveis de ambiente

Na raiz, `.env.example` documenta a integração geral:

```env
FRONTEND_PORT=4200
BACKEND_PORT=3001
DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5434/booka_v2?schema=public
API_BASE_URL=http://localhost:3001
CLIENT_ORIGINS=http://localhost:4200,http://localhost:5173,http://localhost:3000
```

No frontend Angular, a URL da API fica em:

- `frontend/src/environments/environment.ts`
- `frontend/src/environments/environment.development.ts`

Valor local atual:

```ts
apiUrl: 'http://localhost:3001'
```

No backend, copie `backend/.env.example` para `backend/.env` localmente. As variáveis relevantes são:

```env
PORT=3001
CLIENT_ORIGINS=http://localhost:4200,http://localhost:5173,http://localhost:3000
DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5434/booka_v2?schema=public
DIRECT_URL=postgresql://postgres:postgres@127.0.0.1:5434/booka_v2?schema=public
JWT_SECRET=change-me-use-a-long-random-secret
JWT_TTL_SECONDS=604800
```

Não versionar arquivos `.env` reais.

## Fluxo de comunicação

```text
Frontend Angular -> API HTTP -> Backend Express -> Prisma -> PostgreSQL
```

Os services do frontend usam `environment.apiUrl` e chamam rotas como:

- `POST /auth/login`
- `POST /auth/register`
- `GET /auth/me`
- `GET /profissionais`
- `GET /servicos`
- `GET /clientes`
- `GET /agendamentos`
- `GET /loja`
- `GET /bloqueios`

O backend registra essas rotas diretamente na raiz da API, sem prefixo `/api`.

## CORS

O backend usa `cors` em `backend/src/app.ts` e lê a lista de origens permitidas em `CLIENT_ORIGINS`.

Origens locais permitidas por padrão:

- `http://localhost:4200`
- `http://localhost:5173`
- `http://localhost:3000`

Em produção, configure `CLIENT_ORIGINS` apenas com os domínios reais do frontend. Não use wildcard aberto.

## Como testar a integração

Em um terminal, rode o backend:

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

Em outro terminal, rode o frontend:

```bash
cd frontend
npm install
npm start
```

Depois acesse:

- Frontend: `http://localhost:4200`
- Healthcheck: `http://localhost:3001/health`
- Swagger: `http://localhost:3001/docs`

Se houver erro de CORS, confira se a origem exibida pelo navegador está listada em `CLIENT_ORIGINS`.
