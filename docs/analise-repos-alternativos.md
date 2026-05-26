# Analise dos repositorios alternativos

Data da analise: 2026-05-26

Este documento registra a avaliacao dos dois repositorios alternativos citados para o projeto BOOKA. Eles foram buscados apenas como remotos locais de leitura/comparacao. Nenhum push foi feito para esses repositorios.

## Remotos analisados

| Repositorio | Branch | Commit | Uso na analise |
| --- | --- | --- | --- |
| https://github.com/Giullianoads/booka-frontend | `main` | `3db338f6402fd12772a79d541704224ceaf9e86a` | Frontend alternativo/fork |
| https://github.com/Giullianoads/booka-frontend | `dev` | `a12e887e19606a037a1a7661e4aeeeb4d1e990d5` | Variacao em desenvolvimento do frontend alternativo |
| https://github.com/Giullianoads/booka-app | `main` | `5f51d1a2805b34e58747c29eeb87d40d151ae9e3` | App Ionic/Capacitor legado |

Remotos locais configurados:

- `alt-frontend-origin`: fetch habilitado, push desabilitado.
- `alt-app-origin`: fetch habilitado, push desabilitado.

## 1. Frontend alternativo

Repositorio:

- https://github.com/Giullianoads/booka-frontend

### O que existe de diferente

O HEAD da branch `main` tem como foco principal a tentativa de implementar Login com Google.

Arquivos relevantes:

- `src/app/pages/login/login.component.ts`
- `src/app/services/auth.service.ts`
- `src/environments/environment.ts`
- `src/environments/environment.development.ts`
- `src/index.html`
- `proxy.conf.json`

Principais diferencas encontradas:

- Adiciona script do Google Identity Services em `src/index.html`.
- Adiciona `googleClientId` nos arquivos de environment.
- Adiciona metodo `loginWithGoogle(credential)` no `AuthService`.
- Chama `POST /auth/google`.
- Usa `apiUrl: '/api'`.
- Adiciona `proxy.conf.json` apontando `/api` para `http://localhost:3000`.

### Por que nao migrar automaticamente

O backend atual do monorepo nao possui rota `POST /auth/google`. As rotas atuais de autenticacao sao:

- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`

Tambem ha divergencia de configuracao:

- O backend atual roda em `http://localhost:3001`.
- O frontend principal do monorepo usa `apiUrl: 'http://localhost:3001'`.
- O proxy do frontend alternativo aponta para `http://localhost:3000`.
- O proxy do frontend alternativo usa prefixo `/api`, mas o backend atual registra rotas sem prefixo `/api`.

Alem disso, o frontend alternativo e menor que o frontend principal usado no monorepo:

- Frontend principal analisado: 143 arquivos.
- Frontend alternativo `main`: 122 arquivos.

O diff mostra que o frontend alternativo nao possui varios arquivos que ja existem no frontend principal, incluindo CI, Cypress, documentacao tecnica, guards, interceptors, services e utilities.

### O que pode ser aproveitado futuramente

Pode valer migrar Login com Google depois que o backend tiver suporte real para isso.

Checklist minimo para essa migracao futura:

- Criar variaveis de ambiente para Google OAuth, sem hardcode de client id.
- Implementar `POST /auth/google` no backend.
- Validar o token do Google no backend.
- Mapear/criar usuario no banco atual via Prisma.
- Gerar JWT interno do BOOKA.
- Ajustar UI do frontend principal mantendo o fluxo atual de login/senha.
- Adicionar testes para login comum e login Google.

Recomendacao atual:

- Nao copiar o codigo agora.
- Registrar como backlog tecnico: "Implementar Login com Google".

## 2. App alternativo/legado

Repositorio:

- https://github.com/Giullianoads/booka-app

### O que existe de diferente

O projeto e um app Ionic/Capacitor com Angular.

Stack identificada:

- Angular 20
- Ionic 8
- Capacitor 8
- Supabase JS

Arquivos relevantes:

- `booka-app/package.json`
- `booka-app/ionic.config.json`
- `booka-app/capacitor.config.ts`
- `booka-app/src/app/pages/login/`
- `booka-app/src/app/pages/cadastro/`
- `booka-app/src/app/pages/esqueci-senha/`
- `booka-app/src/app/services/supabase.service.ts`
- `booka-app/supabase_schema.sql`
- `booka-app/src/assets/logo.jpeg`

Rotas identificadas:

- `/home`
- `/login`
- `/cadastro`
- `/esqueci-senha`

O cadastro tem fluxo em duas etapas e separa tipo de usuario entre cliente e prestador.

### Supabase

O app alternativo usa Supabase diretamente via `@supabase/supabase-js`.

Chaves de ambiente encontradas no `.env` do repositorio de origem:

- `SUPABASE_URL`
- `SUPABASE_KEY`

Os valores nao foram copiados nem documentados neste monorepo.

O arquivo `supabase_schema.sql` contem tabelas para:

- `perfis`
- `clientes`
- `prestadores`
- `servicos`
- `agendamentos`

Tambem contem politicas de Row Level Security e trigger para criar perfil a partir de `auth.users`.

### Por que nao migrar automaticamente

O monorepo atual usa backend Express com Prisma e PostgreSQL. O app alternativo usa Supabase diretamente no frontend mobile.

Copiar esse app agora criaria duas arquiteturas de autenticacao e dados:

- Backend atual: Express + Prisma + JWT.
- App alternativo: Supabase Auth + Supabase client direto.

Isso poderia duplicar regras de negocio e causar divergencia de schema.

Tambem ha um `.env` versionado no repositorio alternativo. Esse arquivo nao deve ser importado. Se os valores forem reais, recomenda-se revisar/rotacionar as credenciais no provedor.

### O que pode ser aproveitado futuramente

O app pode ser uma boa base para uma pasta futura:

```text
mobile/
```

Mas antes disso e preciso decidir a arquitetura:

- Opcao A: mobile consome o backend atual Express/Prisma.
- Opcao B: migrar parte da plataforma para Supabase.
- Opcao C: usar Supabase apenas como PostgreSQL hospedado, mantendo Prisma/backend como camada oficial.

Recomendacao tecnica:

- Preferir Opcao A ou C para manter uma unica API oficial.
- Evitar mobile falando direto com banco/auth sem passar pelo backend, enquanto o monorepo ainda esta consolidando contratos.

Checklist minimo para migrar o app futuramente:

- Criar `mobile/` como app separado.
- Remover `.env` real e criar somente `.env.example`.
- Trocar `SupabaseService` por services HTTP que chamem o backend atual, ou documentar formalmente a decisao de usar Supabase.
- Atualizar `capacitor.config.ts` com `appId` real do BOOKA.
- Adaptar login/cadastro para os contratos atuais do backend.
- Validar se o schema Supabase tem correspondencia com `backend/prisma/schema.prisma`.

## Decisao atual

Nao foi acrescentado codigo dos repositorios alternativos ao monorepo nesta etapa.

Foram acrescentadas apenas esta analise, a atualizacao da comparacao de versoes e dois roadmaps tecnicos:

- `docs/roadmap-login-google.md`
- `docs/roadmap-mobile.md`

Isso preserva a estabilidade do monorepo e evita trazer implementacoes incompletas, conflitos de porta, endpoints inexistentes ou arquivos de ambiente sensiveis.
