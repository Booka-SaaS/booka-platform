# BOOKA Platform

BOOKA Platform é o monorepo oficial do projeto BOOKA dentro da organização BookaSaaS.

## Estrutura

- `frontend/`: aplicação frontend principal.
- `backend/`: API/backend principal.
- `docs/`: documentação técnica e instruções de integração.

## Repositórios de origem

- Frontend principal: https://github.com/TrueTrailBlazer/booka-frontend
- Backend principal: https://github.com/RubensGJ/BookaBackendV2

## Repositórios de referência

- https://github.com/Giullianoads/booka-frontend
- https://github.com/Giullianoads/booka-app

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

O backend roda por padrão em `http://localhost:3001`.

## Como rodar o frontend

```bash
cd frontend
npm install
npm start
```

O frontend Angular roda por padrão em `http://localhost:4200`.

## Integração local

O frontend usa a configuração Angular em:

- `frontend/src/environments/environment.ts`
- `frontend/src/environments/environment.development.ts`

Valor atual:

```ts
apiUrl: 'http://localhost:3001'
```

No backend, as origens permitidas para CORS ficam em `CLIENT_ORIGINS`:

```env
CLIENT_ORIGINS=http://localhost:4200,http://localhost:5173,http://localhost:3000
```

Mais detalhes estão em `docs/integracao-frontend-backend.md`.

## Observações

- Os repositórios originais não foram alterados.
- Este repositório centraliza frontend e backend.
- Versões alternativas devem ser analisadas antes de qualquer migração.
- Arquivos `.env` reais não devem ser versionados; use apenas `.env.example`.
