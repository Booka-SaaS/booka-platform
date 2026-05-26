# Roadmap: App mobile BOOKA

Origem da ideia:

- https://github.com/Giullianoads/booka-app

O repositorio alternativo contem um app Ionic/Capacitor com Angular, telas de home, login, cadastro, esqueci senha e integracao direta com Supabase.

## Objetivo

Planejar uma futura pasta `mobile/` sem duplicar regras de negocio nem criar uma segunda fonte de autenticacao/dados.

## Stack observada no app alternativo

- Angular 20
- Ionic 8
- Capacitor 8
- Supabase JS

## Funcionalidades aproveitaveis como referencia

- Estrutura mobile Ionic/Capacitor.
- Fluxo de cadastro em duas etapas.
- Separacao inicial entre cliente e prestador.
- Telas mobile de login, cadastro e recuperacao de senha.
- Uso de assets de marca, como logo.

## Pontos que impedem copia direta

- O app usa Supabase diretamente no frontend.
- O monorepo atual usa backend Express/Prisma/JWT como API oficial.
- O repositorio alternativo possui `.env` versionado.
- O schema Supabase nao e igual ao `backend/prisma/schema.prisma`.

## Arquitetura recomendada

Preferir:

```text
Mobile Ionic -> API HTTP BOOKA -> Backend Express -> Prisma -> PostgreSQL
```

Isso mantem uma unica camada oficial para autenticacao, permissao, regras de negocio e validacao.

## Estrutura futura sugerida

```text
booka-platform/
|-- frontend/
|-- backend/
|-- mobile/
`-- docs/
```

## Checklist para migracao futura

- Criar `mobile/` como projeto separado.
- Criar `mobile/.env.example`.
- Nao copiar `.env` real.
- Remover acesso direto ao Supabase, se a API Express continuar oficial.
- Implementar services HTTP para as rotas atuais do backend.
- Adaptar login para `POST /auth/login`.
- Adaptar cadastro para `POST /auth/register`.
- Adaptar marketplace para `GET /profissionais`.
- Adaptar agendamento publico para `POST /agendamentos/publicos`.
- Atualizar `capacitor.config.ts` com `appId` real do BOOKA.
- Adicionar testes unitarios e E2E mobile quando a base estiver estavel.

## Decisao atual

Nao criar `mobile/` agora. Registrar o app alternativo como referencia de produto e arquitetura para uma futura fase mobile.
