# Sincronizacao dos repositorios Booka

Data da sincronizacao: 11/06/2026  
Branch de trabalho: `chore/atualizacao-completa-monorepo`

## Repositorios analisados

| Area | Repositorio | Branch analisada | Commit considerado |
| --- | --- | --- | --- |
| Frontend | `https://github.com/TrueTrailBlazer/booka-frontend` | `dev` | `8d220a2 feat: integrate gateway notifications` |
| Backend | `https://github.com/RubensGJ/BookaBackendV2` | `master` | `5379579 feat: add gateway and notification service` |
| Mobile | `https://github.com/ThiagoAkatsuka/booka-app` | `main` | `0f623a9 feat: migrate to capacitor, add e2e tests and integrate backend V2` |

Tambem havia remotes alternativos cadastrados (`alt-app-origin`, `alt-frontend-origin`), mas as instrucoes do TXT pediam fidelidade aos tres repositorios acima.

## Commits recentes relevantes

Frontend:

- `8d220a2 feat: integrate gateway notifications`
- `bb7bb1c atualizacao`
- `fb8f848 test: atualiza expects do ToastService no teste de bloqueios`
- `2831c1e feat: refatoracao visual com daisyUI, criacao de toast service e modal de novo agendamento`
- `d8c1210 Ajustes no loguin com implementação do backend - Separação dos dados de cadastro em blocos com api do endereço via CEP`

Backend:

- `5379579 feat: add gateway and notification service`
- `06aff03 atualizacao`
- `c11b476 envio de email`
- `1943349 Ajustes de validação via api do CEP e criação de novos dados`
- `b070ded feat: adicionar funcionalidade de criação de bloqueios de agenda em lote e atualizar esquemas e controladores`

Mobile:

- `0f623a9 feat: migrate to capacitor, add e2e tests and integrate backend V2`
- `618fc90 Acompanhamento de telas`
- `a5c7457 login para teste`
- `d9c7ed0 refatoração do codigo`

## O que foi trazido

Frontend:

- Nova integracao com notificacoes via gateway.
- `NotificacaoService` e testes de notificacao.
- Ajustes em tela de notificacoes, recuperacao/nova senha, bloqueios, cadastro, agendamento, dashboard e perfil.
- Atualizacao de dependencias Angular/Cypress/DaisyUI e documentacao propria do frontend.
- Remocao de scripts/runtime env que nao existem mais no upstream atual.

Backend:

- API Gateway em `backend/services/api-gateway`.
- Notification service em `backend/services/notification-service`.
- Event bus RabbitMQ em `backend/src/lib/events`.
- Nova migration `20260609000000_add_evento_id_to_notificacao`.
- Testes Jest unitarios e de integracao.
- Dockerfile, Docker Compose ampliado, CI e documentacao de arquitetura.
- Ajustes em CORS, Helmet, rate limit, env vars, Prisma e fluxo de agendamentos/notificacoes.

Mobile:

- A pasta `mobile/` foi conferida contra `ThiagoAkatsuka/booka-app@main`.
- O commit remoto permanece `0f623a9`, sem commits novos apos a consolidacao anterior.
- Foi mantido o codigo real do app Angular/Ionic/Capacitor, incluindo Android, iOS, Cypress e telas existentes.

## Funcionalidades confirmadas

- Cadastro, login, JWT e recuperacao de senha.
- Onboarding, dados pessoais/profissionais e dados de loja.
- ViaCEP no fluxo de endereco.
- CRUD de clientes, servicos, profissionais, disponibilidade e bloqueios.
- Fluxos de agendamento, agenda e marketplace publico.
- Upload de avatar/capa.
- Dashboard.
- Notificacoes integradas com gateway, servico dedicado e RabbitMQ.
- Mobile Capacitor com Android/iOS e testes E2E.

## Conflitos e decisoes

- O frontend e o mobile de origem nao mantem mais `public/env.js` nem `scripts/write-env.cjs`; esses arquivos foram removidos das subpastas para preservar o estado real dos repositorios.
- Como o TXT exige exemplos de ambiente, foram recriados `frontend/.env.example` e `mobile/.env.example` apenas como documentacao, sem alterar o mecanismo real de configuracao dos apps.
- O monorepo recebeu `package.json` raiz somente com scripts delegados. Nao foram criados workspaces para nao modificar o funcionamento independente dos projetos.
- `render.yaml` foi atualizado para as variaveis atuais do backend (`CLIENT_ORIGIN`, `GATEWAY_ORIGIN`, `RABBITMQ_URL`, gateway e notification service), substituindo variaveis antigas do monorepo.
- O backend de origem removeu a migration monorepo `20260527120000_password_reset_notifications`; foi mantida a arvore fiel ao upstream atual, que ja possui migrations de password reset/notificacao anteriores e a nova migration de `eventoId`.

## Arquivos e modulos alterados

- `frontend/`: codigo Angular, docs internas, package files, CI e ambientes.
- `backend/`: API, Prisma, tests, services, Docker, CI, docs e package files.
- `mobile/`: conferido e mantido fiel ao upstream; exemplos de ambiente documentais adicionados.
- Raiz: `.env.example`, `package.json`, `README.md`, `render.yaml`.
- `docs/SINCRONIZACAO_REPOSITORIOS.md`: este relatorio.

## Validacao

Comandos executados nesta sincronizacao:

- `git fetch --all --prune`
- `git log` dos remotes de origem
- `git archive` dos commits remotos analisados
- Comparacao por diretoria e sincronizacao das pastas `frontend/`, `backend/`, `mobile/`
- `npm --prefix backend ci`
- `npm --prefix backend run prisma:generate`
- `npm --prefix backend run build`: aprovado
- `npm --prefix backend test`: aprovado, 3 suites e 4 testes
- `npm --prefix backend run test:integration`: aprovado, 1 suite e 1 teste
- `node frontend/node_modules/@angular/cli/bin/ng.js build`: aprovado; warning de budget e logs de prerender sem backend local em `localhost:3000`
- `npm --prefix mobile run build`: aprovado; warning de budget

Observacoes:

- O Node local disponivel era `v22.11.0`; `http-proxy-middleware@4.1.0` emitiu aviso de engine pedindo Node `^22.15.0 || ^24.0.0 || >=26.0.0`. Por isso, `render.yaml` fixa `NODE_VERSION=22.16.0`.
- `prisma generate` precisou baixar binaries do Prisma.
- O build Angular precisou rodar fora do sandbox porque o esbuild cria processo filho e falhava com `spawn EPERM` no sandbox.
- Os installs de frontend/mobile excederam o timeout, mas deixaram dependencias suficientes para os builds locais.

## Pontos de atencao futura

- Provisionar RabbitMQ em producao para o fluxo completo de notificacoes.
- Definir se o gateway e o notification service serao deployados como servicos separados no Render ou por outro orquestrador.
- Rever URLs finais do frontend em producao, pois o upstream frontend aponta para `http://localhost:3000/api` em `environment.ts`.
- Validar migrations Prisma em uma base descartavel antes de aplicar em producao.
- Evitar commitar arquivos de upload reais em ciclos futuros, mesmo que tenham vindo rastreados no backend de origem.
