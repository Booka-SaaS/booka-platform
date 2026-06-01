# Deploy

Consulte tambem [DEPLOY.md](../DEPLOY.md).

## Ordem recomendada

1. Criar banco no Supabase.
2. Configurar `DATABASE_URL` e `DIRECT_URL`.
3. Rodar migrations Prisma pelo backend.
4. Publicar backend no Render.
5. Publicar frontend na Vercel.
6. Validar CORS, health check, login e fluxo publico de agendamento.

## Cuidados

- Nao versionar `.env` reais.
- Nao colocar `JWT_SECRET`, `DATABASE_URL` ou service role key no frontend.
- Usar `BOOKA_API_URL` na Vercel apontando para a URL publica do Render.
- Fazer backup do banco antes do lockdown final.
