# Booka Database

Esta pasta documenta o schema SQL para criar o banco PostgreSQL no Supabase.

Arquivos:

- `schema.sql`: cria enums, tabelas, chaves estrangeiras e indices usados pelo backend Prisma.
- `seed.sql`: dados ficticios opcionais para homologacao.
- `queries.sql`: consultas rapidas para validar tabelas e dados.

Uso no Supabase:

1. Crie o projeto no Supabase.
2. Abra `SQL Editor`.
3. Rode `schema.sql`.
4. Opcionalmente rode `seed.sql`.
5. Copie a connection string PostgreSQL para `DATABASE_URL` no Render.

Seguranca:

- Nao coloque `DATABASE_URL`, service role key ou JWT secret em arquivos versionados.
- `SUPABASE_SERVICE_ROLE_KEY` deve ficar somente no backend, caso seja realmente necessaria.
- O frontend deve usar apenas URL publica da API e, se um dia usar Supabase direto, apenas anon key.
- O schema atual nao possui CPF, vagas, candidaturas, convites ou avaliacoes como tabelas separadas; esses fluxos ainda nao existem no backend atual.
