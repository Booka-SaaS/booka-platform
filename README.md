# Booka

## Resumo do projeto

Booka e uma plataforma SaaS para gestao de agendamentos, servicos, clientes, disponibilidade e presenca digital de profissionais/pequenas empresas. O sistema resolve a dificuldade de organizar agenda, atendimento e oferta de servicos em um unico fluxo, com marketplace publico para clientes e painel operacional para profissionais.

O publico-alvo sao profissionais autonomos, pequenos negocios de atendimento e equipes que precisam controlar horarios, servicos, clientes e comunicacao de forma simples.

## Objetivo do sistema

O objetivo principal do Booka e centralizar o processo de agendamento: o cliente encontra um profissional, visualiza servicos e disponibilidade, realiza uma reserva, e o profissional acompanha clientes, agenda, bloqueios, servicos, loja/perfil e indicadores em dashboard.

## Projeto de adequacao do trabalho remoto

No contexto de trabalho remoto ou hibrido, o Booka funciona como ferramenta de organizacao operacional. A plataforma reduz dependencia de controles manuais, melhora o acompanhamento de entregas e facilita a distribuicao de tarefas relacionadas a atendimento, disponibilidade, cadastro de servicos, revisao de agenda e relacionamento com clientes.

Para a equipe do projeto, o monorepo favorece comunicacao e produtividade porque frontend, backend, banco e documentacao ficam no mesmo fluxo de versionamento. O planejamento em Scrum e Kanban permite acompanhar progresso, prioridades, bloqueios, revisoes de codigo e validacao de entregas.

## Duracao do projeto: 6 meses

O planejamento proposto considera 6 meses de execucao, com evolucao incremental: descoberta e arquitetura no inicio, implementacao das funcionalidades principais nos meses centrais, testes/deploy no quinto mes e lockdown controlado no sexto mes.

## Metodologia utilizada: Scrum

O projeto usa Scrum como metodologia central.

- Sprints: ciclos curtos de entrega, sugeridos em periodos de 2 semanas.
- Backlog: lista priorizada de requisitos, melhorias, bugs, riscos e tarefas tecnicas.
- Daily meetings: alinhamentos rapidos para progresso, impedimentos e proximas acoes.
- Sprint planning: definicao do escopo da sprint, criterios de aceite e responsaveis.
- Sprint review: demonstracao do incremento entregue.
- Sprint retrospective: avaliacao do processo, dificuldades e melhorias para o proximo ciclo.
- Papeis principais: Product Owner, Scrum Master, Desenvolvedor Frontend, Desenvolvedor Backend, Responsavel por Banco de Dados, Testes, Documentacao e Deploy/DevOps.
- Incrementos entregaveis: funcionalidades integradas, documentacao atualizada, migrations, builds validados e cards movidos no Kanban.

## Estrategia de gestao da equipe para os proximos 6 meses

A equipe deve trabalhar com sprints quinzenais, reunioes semanais de acompanhamento e revisoes de codigo antes de cada merge. As prioridades devem considerar impacto no usuario, risco tecnico, dependencia de credenciais/infraestrutura e valor academico da entrega.

A comunicacao deve ocorrer por GitHub Issues/Projects, Pull Requests e reunioes curtas. Riscos devem ser registrados no Kanban como bloqueados quando dependerem de Supabase, Render, Vercel, GitHub Projects ou variaveis sensiveis. Entregas devem ser aceitas apenas com build validado, documentacao atualizada e ausencia de segredos reais no codigo.

## Definicao das atividades que serao realizadas

- Levantamento e refinamento de requisitos.
- Modelagem e evolucao do banco de dados.
- Configuracao dos ambientes local, homologacao e producao.
- Desenvolvimento e manutencao do backend.
- Desenvolvimento e manutencao do frontend.
- Integracao frontend/backend.
- Autenticacao, autorizacao e recuperacao de senha.
- Testes unitarios, E2E e de integracao.
- Deploy em Vercel, Render e Supabase.
- Documentacao tecnica, Scrum, Kanban e operacao.
- Validacao final e apresentacao.

## Definicao dos responsaveis por cada atividade

| Atividade | Responsavel proposto |
| --- | --- |
| Priorizacao e requisitos | Product Owner |
| Cerimonias Scrum e remocao de impedimentos | Scrum Master |
| Interfaces Angular e experiencia do usuario | Desenvolvedor Frontend |
| API Express, regras de negocio e seguranca | Desenvolvedor Backend |
| Prisma, migrations e Supabase/PostgreSQL | Responsavel pelo Banco de Dados |
| Testes unitarios, E2E e validacao final | Responsavel por Testes |
| README e relatorios | Responsavel pela Documentacao |
| Render, Vercel, variaveis e pipeline | Responsavel por Deploy/DevOps |

## Estrategia de lockdown

No ultimo mes, o projeto deve entrar em lockdown: congelamento de novas funcionalidades, correcao apenas de bugs criticos, revisao de seguranca, testes finais, validacao de deploy, backup do banco, revisao da documentacao e checklist final antes da entrega. Mudancas nesse periodo devem ser pequenas, rastreaveis e aprovadas em Pull Request.

## Elaboracao de cronograma

| Mes | Foco | Entregas esperadas |
| --- | --- | --- |
| 1 | Planejamento, requisitos, arquitetura e backlog | Escopo validado, backlog inicial, estrutura do monorepo revisada |
| 2 | Modelagem, autenticacao e base do backend | Schema Prisma, migrations, auth, rotas base e ambiente local |
| 3 | Frontend inicial, telas principais e integracao parcial | Login, cadastro, marketplace, servicos e chamadas API |
| 4 | Funcionalidades principais e regras de negocio | Agenda, disponibilidade, clientes, bloqueios, dashboard e upload |
| 5 | Testes, melhorias, deploy e documentacao | Builds validados, deploy configurado, documentacao e testes ampliados |
| 6 | Lockdown, validacao final, apresentacao e entrega | Correcoes criticas, checklist final, backup e PR de entrega |

## Definir cidade da empresa

Definicao proposta: a empresa do estudo de caso esta localizada em Campo Grande/MS. O contexto e uma pequena empresa de servicos que atende clientes locais e tambem opera processos administrativos em modelo hibrido.

## Quantidade de funcionarios

Definicao proposta: 25 funcionarios.

| Area | Quantidade |
| --- | ---: |
| Administracao | 4 |
| Atendimento | 5 |
| Operacoes | 7 |
| Tecnologia | 4 |
| Comercial | 3 |
| Gestao | 2 |

## Porte da empresa

Com 25 funcionarios, a empresa e classificada como empresa de pequeno porte para o estudo de caso. A justificativa e o numero reduzido de colaboradores, a estrutura enxuta de gestao e a necessidade de ferramentas digitais para organizar processos sem grande complexidade corporativa.

## Tecnologias utilizadas

- Angular 19
- Tailwind CSS
- Node.js
- Express
- TypeScript
- Prisma
- PostgreSQL
- Supabase
- Render
- Vercel
- Cypress
- Karma/Jasmine
- Swagger UI

## Arquitetura do projeto

```text
booka-platform/
|-- frontend/   Aplicacao Angular 19 com Tailwind, SSR/static build e testes
|-- backend/    API Node.js/Express/TypeScript com Prisma e Swagger
|-- database/   Scripts SQL de schema, seed e consultas de apoio
|-- render.yaml Blueprint do backend no Render
`-- README.md   Documentacao principal
```

Fluxo esperado:

```text
Frontend Angular na Vercel -> Backend Express no Render -> PostgreSQL/Supabase
```

## Funcionalidades atuais

- Cadastro, login e `GET /auth/me`.
- Recuperacao de senha por token interno.
- Onboarding profissional.
- Perfil/loja do profissional.
- Upload de avatar e capa da loja.
- Marketplace publico de profissionais.
- Detalhe publico e disponibilidade por data.
- Servicos, clientes, agendamentos e bloqueios de agenda.
- Dashboard/resumo.
- Schema com notificacoes.

## Como executar localmente

Backend:

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

Frontend:

```bash
cd frontend
npm install
npm start
```

URLs locais:

- Frontend: `http://localhost:4200`
- Backend: `http://localhost:3001`
- Swagger: `http://localhost:3001/docs`
- Health: `http://localhost:3001/health`
- Banco: `GET http://localhost:3001/test/db-status`

## Variaveis de ambiente

Backend (`backend/.env`):

```env
NODE_ENV=development
PORT=3001
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/postgres?schema=public
DIRECT_URL=postgresql://USER:PASSWORD@HOST:5432/postgres?schema=public
JWT_SECRET=change-me-use-a-long-random-secret
JWT_TTL_SECONDS=604800
FRONTEND_URL=http://localhost:4200
CLIENT_ORIGINS=http://localhost:4200,http://localhost:5173,http://localhost:3000
SUPABASE_URL=https://PROJECT_REF.supabase.co
SUPABASE_ANON_KEY=fake-anon-key
SUPABASE_SERVICE_ROLE_KEY=fake-service-role-key
SEED_PASSWORD=senha-de-teste
SEED_PASSWORD_HASH=
```

Frontend (`frontend/.env`):

```env
BOOKA_API_URL=http://localhost:3001
```

Nunca exponha no frontend `DATABASE_URL`, `DIRECT_URL`, `JWT_SECRET`, `SUPABASE_SERVICE_ROLE_KEY`, tokens privados, senhas ou chaves reais.

## Deploy

- Frontend: Vercel, com root directory `frontend` e `BOOKA_API_URL` apontando para o backend.
- Backend: Render, com root directory `backend`, build `npm ci && npm run prisma:generate && npm run prisma:deploy && npm run build` e start `npm start`.
- Banco: Supabase/PostgreSQL, com migrations Prisma e variaveis `DATABASE_URL` e `DIRECT_URL`.

Ordem recomendada de publicacao:

1. Criar o banco no Supabase.
2. Configurar `DATABASE_URL` e `DIRECT_URL` no Render.
3. Rodar migrations Prisma no deploy do backend.
4. Validar `/health` e `/test/db-status`.
5. Configurar `BOOKA_API_URL` na Vercel apontando para o backend.
6. Validar CORS, login, marketplace e agendamento publico.

## Testes

Scripts disponiveis:

```bash
cd frontend
npm test
npm run cypress:run
```

```bash
cd backend
npm run build
```

Ainda nao ha suite automatizada completa no backend. Proposta futura: testes unitarios para services, testes de integracao para rotas Express, E2E de autenticacao/agendamento e validacao automatizada de deploy.

## Kanban do projeto

O quadro Kanban recomendado para o Booka deve usar as colunas `Backlog`, `A Fazer`, `Em Desenvolvimento`, `Em Revisao`, `Testes`, `Concluido` e `Bloqueado`.

| Coluna | Cards |
| --- | --- |
| Backlog | Levantamento final de requisitos; Revisao da arquitetura; Definicao de regras de negocio; Planejamento das sprints |
| A Fazer | Revisar integracao frontend/backend; Revisar autenticacao; Revisar conexao com Supabase; Revisar deploy no Render; Revisar deploy na Vercel; Atualizar documentacao |
| Em Desenvolvimento | Melhorias no frontend; Melhorias no backend; Ajustes no Prisma; Ajustes de variaveis de ambiente |
| Em Revisao | Revisao de codigo; Revisao do README; Revisao do fluxo de agendamentos; Revisao das rotas da API |
| Testes | Testes de autenticacao; Testes de agendamento; Testes de disponibilidade; Testes de integracao; Testes de deploy |
| Concluido | Estrutura inicial do monorepo; Configuracao inicial do frontend; Configuracao inicial do backend; Configuracao inicial do banco |
| Bloqueado | Itens dependentes de credenciais; Itens dependentes de variaveis de ambiente; Itens dependentes de acesso ao GitHub Projects, Render, Vercel ou Supabase |

## Issues sugeridas

| Issue | Labels sugeridas |
| --- | --- |
| Revisar fluxo completo de autenticacao | backend, frontend, testing |
| Validar integracao frontend/backend em ambiente de homologacao | frontend, backend, testing |
| Revisar conexao Supabase e migrations Prisma | database, backend |
| Configurar e validar deploy no Render | deploy, backend |
| Configurar e validar deploy na Vercel | deploy, frontend |
| Ampliar testes E2E de agendamento | testing, frontend, backend |
| Revisar fluxo de disponibilidade e bloqueios | backend, frontend, bug |
| Documentar decisoes de arquitetura no README | documentation, enhancement |
| Configurar quadro Kanban no GitHub Projects | kanban, scrum, documentation |
| Planejar sprints do ciclo de 6 meses | scrum, documentation |

Labels recomendadas: `frontend`, `backend`, `database`, `documentation`, `deploy`, `testing`, `scrum`, `kanban`, `bug`, `enhancement`.

## Status atual do projeto

O monorepo esta organizado com `frontend/`, `backend/`, `database/`, `render.yaml` e `README.md`. Os remotes historicos foram verificados e os commits mais recentes de frontend/backend foram comparados. O commit mais recente do backend teve alteracoes seguras incorporadas seletivamente para avatar/capa e schema Prisma. As alteracoes de frontend ja estavam parcialmente presentes; foi adicionada a chamada de upload de capa no service.

Pendencias funcionais futuras incluem envio real de email para reset de senha, ampliacao de testes automatizados, revisao completa de fluxo de imagens em producao, observabilidade, painel administrativo dedicado e validacao com credenciais reais de Supabase/Render/Vercel.

## Proximos passos

- Validar migrations em banco Supabase de homologacao.
- Executar testes E2E de login, marketplace e agendamento.
- Revisar fluxo visual de upload de avatar e capa.
- Configurar GitHub Projects usando o quadro Kanban descrito neste README.
- Criar issues oficiais a partir da tabela de issues sugeridas neste README.
- Revisar secrets nos paineis Render/Vercel, sem versiona-los.
- Preparar Pull Request com checklist de build e deploy.

## Licenca

Licenca nao identificada no monorepo. Definicao proposta: adicionar uma licenca antes de distribuicao publica ou uso comercial.
