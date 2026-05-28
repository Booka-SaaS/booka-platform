# Deploy do Booka

Este guia publica o Booka na ordem correta: Supabase, Render e Vercel.

## 1. Supabase

1. Crie um projeto no Supabase.
2. Anote a senha do banco com seguranca.
3. Abra `SQL Editor`.
4. Rode `database/schema.sql`.
5. Opcionalmente rode `database/seed.sql` apenas em ambiente de teste/homologacao.
6. Em `Connect`, copie a connection string do `Session pooler`/Supavisor.
7. Use essa connection string como `DATABASE_URL` no backend. Ela deve apontar para `pooler.supabase.com:5432`, nao para `db.[PROJECT-REF].supabase.co:5432`.

Variaveis Supabase:

- `DATABASE_URL`: connection string do Supavisor Session pooler para o backend.
- `DIRECT_URL`: connection string direta para o banco de dados (necessária para `prisma migrate deploy`).
- `SUPABASE_URL`: Project URL em `Project Settings > API`.
- `SUPABASE_ANON_KEY`: anon public key, se necessario.
- `SUPABASE_SERVICE_ROLE_KEY`: service role key, somente no backend e somente se houver uso real.

Nao coloque `SUPABASE_SERVICE_ROLE_KEY`, `DATABASE_URL` ou `JWT_SECRET` no frontend.

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
DIRECT_URL=postgresql://postgres.PROJECT_REF:SUA_SENHA@REGION.db.supabase.com:5432/postgres
JWT_SECRET=SEGREDO_ALEATORIO_DE_PELO_MENOS_16_CARACTERES
JWT_TTL_SECONDS=604800
FRONTEND_URL=
CLIENT_ORIGINS=
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
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

Se CORS falhar, confirme que `FRONTEND_URL` aponta para a URL final da Vercel. Para multiplas origens, use `CLIENT_ORIGINS` com URLs separadas por virgula.

### Observações sobre as variáveis do Render:

- **`DATABASE_URL`**: Use a connection string do Supabase **Session Pooler (Supavisor)**, preferencialmente com a porta `6543` e `?pgbouncer=true` para melhor desempenho e compatibilidade com o Render. O usuário geralmente é `postgres.PROJECT_REF`.
- **`DIRECT_URL`**: Use a connection string **direta** do Supabase, sem o pooler, para que o Prisma possa executar operações de migração. O usuário geralmente é `postgres`.
- **`JWT_SECRET`**: Deve ser um segredo longo e aleatório (mínimo 16 caracteres).
- **`FRONTEND_URL`**: A URL pública do seu frontend na Vercel.
- **`CLIENT_ORIGINS`**: Lista de URLs permitidas para CORS, separadas por vírgula. Inclua a URL do seu frontend na Vercel.
- **Codificação de Senhas**: Se sua senha do Supabase contiver caracteres especiais como `@`, `#`, `%`, `&`, `/`, `?`, ou `:`, eles devem ser **URL encoded** na connection string. Por exemplo, `@` vira `%40`.
- **Não comite segredos reais**: As variáveis acima devem ser configuradas diretamente no painel do Render, não no `render.yaml`.

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

O build gera `public/env.js` automaticamente a partir de `BOOKA_API_URL`. Esse arquivo e carregado antes da aplicacao Angular.

Depois do deploy:

1. Acesse a URL da Vercel.
2. Abra o marketplace.
3. Tente login/cadastro.
4. Teste chamada publica para profissionais.
5. Valide no backend se `FRONTEND_URL` permite a origem da Vercel.

## Validacao final

Checklist:

- `database/schema.sql` rodou sem erro.
- Render responde `/health`.
- Render responde `/test/db-status`.
- Vercel carrega a aplicacao.
- `BOOKA_API_URL` aponta para Render.
- `FRONTEND_URL` aponta para Vercel.
- `.env` reais nao foram commitados.
- `DATABASE_URL`, `JWT_SECRET` e service role key existem somente no backend.

## Observacoes

- Nao faca deploy real com tokens pessoais hardcoded.
- Nao rode `seed.sql` em producao com dados de teste.
- Para reset de senha em producao, ainda falta integrar envio real de email; a API nao retorna o token quando `NODE_ENV=production`.
