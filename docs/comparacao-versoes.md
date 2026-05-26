# Comparacao de versoes do BOOKA

Este monorepo utiliza como base:

- Frontend principal: https://github.com/TrueTrailBlazer/booka-frontend
- Backend principal: https://github.com/RubensGJ/BookaBackendV2

Versoes alternativas analisadas:

- Frontend alternativo: https://github.com/Giullianoads/booka-frontend
- App alternativo/legado: https://github.com/Giullianoads/booka-app

Essas versoes alternativas nao foram copiadas diretamente para evitar conflitos, duplicidade de estrutura e poluicao no monorepo.

## Resultado da analise

A analise detalhada esta registrada em:

- `docs/analise-repos-alternativos.md`
- `docs/roadmap-login-google.md`
- `docs/roadmap-mobile.md`

Resumo:

- O frontend alternativo e menor que o frontend principal usado no monorepo.
- O frontend alternativo contem um prototipo de Login com Google, mas o backend atual nao possui `POST /auth/google`.
- O frontend alternativo contem `proxy.conf.json`, mas ele aponta para `localhost:3000` e usa `/api`; o backend atual roda em `localhost:3001` e nao usa prefixo `/api`.
- O app alternativo e um projeto Ionic/Capacitor separado, com potencial para virar um futuro `mobile/`.
- O app alternativo usa Supabase diretamente e nao esta integrado ao backend Express/Prisma atual.
- O app alternativo possui `.env` no repositorio de origem; esse arquivo nao deve ser copiado para o monorepo.

## Recomendacao

Nao migrar codigo automaticamente agora.

Itens que podem virar trabalho futuro:

- Login com Google, depois de implementar suporte no backend, conforme `docs/roadmap-login-google.md`.
- App mobile Ionic/Capacitor em uma pasta separada `mobile/`, conforme `docs/roadmap-mobile.md`.
- Comparacao manual de telas mobile e fluxo de cadastro em duas etapas.
