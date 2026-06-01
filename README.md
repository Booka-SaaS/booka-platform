# Booka

## Descricao do projeto

O Booka e um Sistema SaaS de Agendamento Multifuncional Inteligente desenvolvido como projeto academico do Centro Universitario Insted, no curso de Analise e Desenvolvimento de Sistemas.

A plataforma foi planejada para profissionais, prestadores de servicos e pequenas empresas que precisam organizar clientes, servicos, horarios, disponibilidade, bloqueios de agenda e agendamentos em um unico ambiente. O objetivo e reduzir conflitos de horarios, perda de informacoes, uso de planilhas, agendas fisicas e conversas soltas em aplicativos de mensagem.

## Projeto de adequacao do trabalho remoto

O Booka tambem funciona como proposta de adequacao ao trabalho remoto ou hibrido. A plataforma centraliza processos operacionais, organiza demandas, permite acompanhamento da equipe e diminui a dependencia de controles manuais.

No contexto da equipe do projeto, o GitHub centraliza versionamento, Pull Requests, Issues e GitHub Projects. Isso permite acompanhar impedimentos, validar entregas incrementais, distribuir responsabilidades e manter a comunicacao tecnica registrada durante os 6 meses de execucao.

## Duracao do projeto: 6 meses

O projeto possui duracao planejada de 6 meses, com entregas incrementais. Cada etapa deve produzir um incremento verificavel, como requisitos refinados, modelo de dados, rotas de API, telas de frontend, integracoes, testes, deploy, documentacao LaTeX e apresentacao final.

## Metodologia utilizada: Scrum

O Booka utiliza Scrum como metodologia principal.

- Sprints: ciclos curtos de desenvolvimento, preferencialmente quinzenais.
- Backlog: lista priorizada de requisitos, melhorias, bugs, riscos e tarefas tecnicas.
- Sprint Planning: reuniao para selecionar tarefas, estimar esforco e definir criterios de aceite.
- Daily Scrum: alinhamento rapido sobre progresso, impedimentos e proximas acoes.
- Sprint Review: apresentacao do incremento entregue ao final da sprint.
- Sprint Retrospective: avaliacao do processo para melhorar a proxima sprint.
- Entregas incrementais: cada sprint deve gerar uma evolucao funcional, tecnica ou documental.

## Estrategia de gestao da equipe para os proximos 6 meses

A equipe sera gerenciada com Scrum, GitHub Projects, Issues, Pull Requests, revisoes de codigo, reunioes semanais, documentacao continua e criterios de aceite. Os impedimentos devem ser registrados no Kanban e discutidos nas reunioes de acompanhamento.

As prioridades devem considerar valor para o usuario, risco tecnico, dependencias externas, disponibilidade de credenciais, impacto no deploy e relevancia academica. Mudancas importantes devem passar por Pull Request e revisao antes de serem incorporadas.

## Definicao das atividades que serao realizadas

- Levantamento e refinamento de requisitos.
- Planejamento da arquitetura.
- Modelagem do banco de dados.
- Desenvolvimento do backend.
- Desenvolvimento do frontend.
- Integracao frontend/backend.
- Autenticacao e autorizacao.
- Sistema de agendamento.
- Dashboard.
- Testes.
- Deploy.
- Documentacao LaTeX.
- Apresentacao final.

## Definicao dos responsaveis por cada atividade

| Atividade | Responsavel |
| --- | --- |
| Product Owner / Scrum Master | Matheus Victor Moreira Yamanari |
| Backlog, planejamento e validacao | Matheus Victor Moreira Yamanari |
| Frontend Angular/Ionic | Luis Fernando Franco |
| Frontend, telas e UI/UX | Thiago Almeida Akatsuka |
| Backend/API REST | Giulliano Ribeiro da Silva |
| Banco de dados, autenticacao e seguranca | Rubens Galina Junior |
| Testes e validacao | Toda a equipe |
| Documentacao e apresentacao | Toda a equipe, com organizacao do PO/SM |

## Estrategia de lockdown

No sexto mes, o projeto entra em lockdown. Novas funcionalidades ficam congeladas e somente alteracoes necessarias para estabilidade e entrega final devem ser aceitas.

Durante o lockdown sao permitidos:

- Correcoes criticas.
- Ajustes de seguranca.
- Testes finais.
- Backup.
- Validacao de deploy.
- Revisao documental.
- Ajustes pequenos aprovados por Pull Request.

## Elaboracao de cronograma

| Mes | Foco | Entregas esperadas |
| --- | --- | --- |
| 1 | Planejamento, requisitos e arquitetura | Escopo validado, backlog inicial e organizacao do projeto |
| 2 | Banco de dados, autenticacao e backend | Modelagem, migrations, login, cadastro e rotas principais |
| 3 | Frontend e integracao inicial | Telas principais, integracao parcial e ajustes de UI/UX |
| 4 | Funcionalidades centrais | Agendamento, disponibilidade, dashboard e regras de negocio |
| 5 | Testes, APIs e deploy | Integracoes externas, WhatsApp, testes, refatoracao e deploy |
| 6 | Lockdown e entrega final | Correcoes criticas, documentacao, apresentacao e validacao final |

## Empresa ficticia / estudo de caso

A empresa ficticia usada como estudo de caso esta localizada em Campo Grande/MS. Ela representa uma pequena empresa prestadora de servicos que precisa organizar agendamentos, disponibilidade, equipe e atendimento em um modelo de trabalho presencial, remoto ou hibrido.

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
| Total | 25 |

## Porte da empresa

Com 25 funcionarios, a empresa e classificada como empresa de pequeno porte no estudo de caso. A justificativa e a estrutura enxuta, a equipe reduzida e a necessidade de digitalizar processos sem complexidade corporativa excessiva.

## Kanban no GitHub Projects

O Kanban oficial do Booka deve ser mantido no GitHub Projects, nao em arquivos Markdown dentro de `docs/`. O README apresenta apenas um resumo para documentacao academica e tecnica.

Project oficial: [Booka — Planejamento e Entrega Final](https://github.com/orgs/Booka-SaaS/projects/3)

Colunas obrigatorias:

- Backlog
- A Fazer
- Em Desenvolvimento
- Em Revisao
- Testes
- Concluido
- Bloqueado

O controle operacional dos cards, responsaveis, revisoes e impedimentos deve ocorrer no GitHub Projects.

## Como abrir a apresentacao local

A apresentacao local fica em `docs/apresentacao-booka/` e nao faz parte do frontend publicado.

Para abrir:

1. Abra a pasta `docs/apresentacao-booka/` no VS Code.
2. Use a extensao Live Server ou abra `index.html` diretamente no navegador.
3. Navegue com os botoes `Anterior` e `Proximo` ou com as setas do teclado.

Arquivos:

```text
docs/apresentacao-booka/
|-- index.html
|-- style.css
|-- script.js
`-- README.md
```

## Como acessar ou compilar a documentacao LaTeX

A documentacao formal em LaTeX fica em `docs/documentacao-latex/`.

Estrutura:

```text
docs/documentacao-latex/
|-- main.tex
|-- referencias.bib
`-- imagens/
```

Para compilar localmente, use uma distribuicao LaTeX como TeX Live ou MiKTeX:

```bash
cd docs/documentacao-latex
pdflatex main.tex
bibtex main
pdflatex main.tex
pdflatex main.tex
```

## Tecnologias e conceitos utilizados

- Angular/Ionic no frontend.
- Node.js e API REST no backend.
- TypeScript.
- Prisma.
- PostgreSQL/Supabase.
- JWT para autenticacao.
- Row Level Security quando aplicavel.
- Google Auth.
- GitHub para versionamento.
- GitHub Projects para Kanban.
- Scrum como metodologia.
- Documentacao LaTeX.
- Render e Vercel para deploy.

## Arquitetura do projeto

```text
booka-platform/
|-- frontend/   Aplicacao frontend Angular/Ionic
|-- backend/    API Node.js/Express/TypeScript com Prisma
|-- database/   Scripts SQL de schema, seed e consultas de apoio
|-- docs/
|   |-- documentacao-latex/
|   `-- apresentacao-booka/
|-- render.yaml
`-- README.md
```

Fluxo esperado:

```text
Frontend -> Backend API REST -> PostgreSQL/Supabase
```

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
GOOGLE_CLIENT_ID=fake-google-client-id.apps.googleusercontent.com
SEED_PASSWORD=senha-de-teste
SEED_PASSWORD_HASH=
```

Frontend (`frontend/.env`):

```env
BOOKA_API_URL=http://localhost:3001
BOOKA_GOOGLE_CLIENT_ID=fake-google-client-id.apps.googleusercontent.com
```

Nunca exponha no frontend `DATABASE_URL`, `DIRECT_URL`, `JWT_SECRET`, `SUPABASE_SERVICE_ROLE_KEY`, tokens privados, senhas ou chaves reais.

## Deploy

- Frontend: Vercel, com root directory `frontend` e `BOOKA_API_URL` apontando para o backend.
- Backend: Render, com root directory `backend`, build `npm ci && npm run prisma:generate && npm run prisma:deploy && npm run build` e start `npm start`.
- Banco: Supabase/PostgreSQL, com migrations Prisma e variaveis `DATABASE_URL` e `DIRECT_URL`.

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

Caso o ambiente local nao tenha `node` e `npm` no PATH, os builds devem ser executados em uma maquina com Node.js instalado ou no pipeline de CI/CD.

## Status atual do projeto

O monorepo esta organizado com frontend, backend, database, documentacao LaTeX e apresentacao local. O GitHub Projects deve concentrar o Kanban operacional. A apresentacao em `docs/apresentacao-booka/` nao e integrada ao frontend, nao possui rota Angular/Ionic e nao deve ir para a publicacao online.

## Licenca

Licenca nao identificada no monorepo. Definicao proposta: adicionar uma licenca antes de distribuicao publica ou uso comercial.
