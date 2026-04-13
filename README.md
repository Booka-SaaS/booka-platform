# Booka Backend V2

Backend novo do Booka, modelado em cima do frontend atual.

## Stack

- Node.js
- TypeScript
- Express
- Prisma
- PostgreSQL
- Zod

## Como rodar

1. Copie `.env.example` para `.env`
2. Suba o banco
3. Instale dependencias
4. Gere o client do Prisma
5. Rode as migrations
6. Rode o seed
7. Suba a API

```bash
docker compose up -d
npm install
npm run prisma:generate
npm run prisma:migrate -- --name init
npm run seed
npm run dev
```

## Porta padrao

- API: `http://localhost:3001`
- Swagger: `http://localhost:3001/docs`
- Postgres: `localhost:5434`

## Escopo atual do scaffold

- auth
- onboarding
- loja
- servicos
- clientes
- agendamentos
- profissionais publicos
- disponibilidade publica
- resumo basico de dashboard
