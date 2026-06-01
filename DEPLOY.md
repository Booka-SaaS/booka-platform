# Deploy do Booka

Este guia publica o Booka na ordem correta: Supabase, Render e Vercel.

## 1. Supabase

1. Crie um projeto no Supabase.
2. Guarde a senha do banco com seguranca.
3. Configure as connection strings:
   - `DATABASE_URL`: connection string do pooler/Supavisor para a aplicacao.
   - `DIRECT_URL`: connection string direta para migrations do Prisma.
4. Rode as migrations pelo backend com `npm run prisma:deploy`.
5. Use `database/seed.sql` ou `npm run seed` apenas em ambiente de teste/homologacao.

Nao coloque `SUPABASE_SERVICE_ROLE_KEY`, `DATABASE_URL`, `DIRECT_URL` ou `JWT_SECRET` no frontend.

## 2. Render

Crie um Web Service apontando para `Booka-SaaS/booka-platform`.

Configuracao:

- Root directory: `backend`
- Build command: `npm ci && npm run prisma:generate && npm run prisma:deploy && npm run build`
- Start command: `npm start`
- Health check path: `/health`

Variaveis:

```env
NODE_ENV=production
PORT=10000
DATABASE_URL=postgresql://postgres.PROJECT_REF:SUA_SENHA@REGION.pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres:SUA_SENHA@db.PROJECT_REF.supabase.co:5432/postgres
JWT_SECRET=SEGREDO_ALEATORIO_DE_PELO_MENOS_16_CARACTERES
JWT_TTL_SECONDS=604800
FRONTEND_URL=https://SEU-FRONTEND.vercel.app
CLIENT_ORIGINS=https://SEU-FRONTEND.vercel.app
SUPABASE_URL=https://PROJECT_REF.supabase.co
SUPABASE_ANON_KEY=CHAVE_PUBLICA_FICTICIA
SUPABASE_SERVICE_ROLE_KEY=CHAVE_PRIVADA_FICTICIA_SOMENTE_BACKEND
```

Depois do deploy, teste:

```text
GET https://SEU-BACKEND.onrender.com/health
GET https://SEU-BACKEND.onrender.com/test/db-status
```

Respostas esperadas:

```json
{ "status": "ok", "service": "booka-api" }
```

```json
{ "database": "connected", "status": "ok" }
```

Se CORS falhar, confirme `FRONTEND_URL` e `CLIENT_ORIGINS`. Para multiplas origens, use URLs separadas por virgula. Se a senha do Supabase tiver caracteres especiais, use URL encoding na connection string.

## 3. Vercel

Importe `Booka-SaaS/booka-platform`.

Configuracao:

- Root directory: `frontend`
- Build command: `npm run build`
- Output directory: `dist/booka-frontend/browser`

Variavel:

```env
BOOKA_API_URL=https://SEU-BACKEND.onrender.com
```

O build gera `public/env.js` automaticamente a partir de `BOOKA_API_URL`.

## Validacao final

- Supabase recebeu as migrations.
- Render responde `/health`.
- Render responde `/test/db-status`.
- Vercel carrega a aplicacao.
- `BOOKA_API_URL` aponta para Render.
- `FRONTEND_URL` e `CLIENT_ORIGINS` permitem a origem da Vercel.
- Uploads de avatar/capa foram validados em ambiente persistente.
- `.env` reais nao foram commitados.
- `DATABASE_URL`, `DIRECT_URL`, `JWT_SECRET` e service role key existem somente no backend.

## Observacoes

- Nao faca deploy real com tokens pessoais hardcoded.
- Nao rode seeds de teste em producao.
- Para reset de senha em producao, ainda falta integrar envio real de email.
