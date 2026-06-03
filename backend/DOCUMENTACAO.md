# Booka Backend V2 — Documentação Técnica

## Visão Geral

**Booka** é um sistema de agendamento profissional desenvolvido como projeto de faculdade (5° semestre).
O sistema é dividido em dois repositórios independentes:

| Repositório | Tecnologias | Porta |
|---|---|---|
| **Backend** (`BookaBackendV2`) | Node.js · Express · TypeScript · Prisma · PostgreSQL | 3001 |
| **Frontend** (`booka-frontend`) | Angular 17+ · TailwindCSS · RxJS | 4200 |

---

## Arquitetura do Backend

```
src/
├── config/
│   └── env.ts                  # Validação de variáveis de ambiente (Zod)
├── lib/
│   ├── db.ts                   # Instância singleton do PrismaClient
│   └── errors.ts               # Classe AppError personalizada
├── middleware/
│   ├── auth.ts                 # Middleware JWT (requireAuth + AuthenticatedRequest)
│   └── role.ts                 # Middleware de role (requireRole)
├── modules/
│   ├── auth/                   # Autenticação e gestão de conta
│   ├── onboarding/             # Fluxo de cadastro do profissional
│   ├── loja/                   # Dados do estabelecimento
│   ├── servicos/               # Serviços oferecidos
│   ├── clientes/               # Clientes da loja
│   ├── agendamentos/           # Agendamentos (painel + público)
│   ├── disponibilidade/        # Horários semanais de funcionamento
│   ├── bloqueios/              # Bloqueios e férias
│   ├── profissionais/          # Marketplace público de profissionais
│   ├── dashboard/              # Resumo do painel
│   └── upload/                 # Upload de imagem de perfil (multer)
├── docs/
│   └── openapi.ts              # Documentação Swagger/OpenAPI
└── app.ts                      # Bootstrap da aplicação Express
```

---

## Banco de Dados (PostgreSQL via Docker)

**Porta:** 5434  
**Banco:** `booka_v2`  
**ORM:** Prisma

### Tabelas

| Tabela | Descrição |
|---|---|
| `Usuario` | Usuários do sistema (CLIENTE e PROFISSIONAL) |
| `PerfilProfissional` | Dados públicos do profissional (profissão, categoria, modalidade) |
| `Loja` | Estabelecimento do profissional (nome, endereço, horários) |
| `Servico` | Serviços oferecidos pela loja |
| `Cliente` | Clientes cadastrados na loja |
| `Agendamento` | Agendamentos (origem PAINEL ou PUBLICO) |
| `DisponibilidadeSemanal` | Horários de funcionamento por dia da semana (0=Dom … 6=Sáb) |
| `BloqueioAgenda` | Períodos de indisponibilidade (férias, almoço, etc.) |
| `PasswordResetToken` | Tokens de recuperação de senha |
| `Notificacao` | Notificações do sistema para o usuário |

### Enums

| Enum | Valores |
|---|---|
| `UserRole` | `CLIENTE`, `PROFISSIONAL` |
| `StatusAgendamento` | `PENDENTE`, `CONFIRMADO`, `CANCELADO`, `CONCLUIDO` |
| `OrigemAgendamento` | `PUBLICO`, `PAINEL` |
| `ModalidadeProfissional` | `ONLINE`, `PRESENCIAL`, `HIBRIDO` |
| `TipoVendedor` | `AUTONOMO`, `EMPRESA` |
| `TipoNotificacao` | `AGENDAMENTO`, `SISTEMA`, `LEMBRETE` |

### Migrations

| Migration | Descrição |
|---|---|
| `20260413143906_init` | Schema inicial completo |
| `20260527000000_add_password_reset_and_notificacao` | Tabelas `PasswordResetToken` e `Notificacao` |

---

## Endpoints da API

> Prefixo base: `http://localhost:3001`  
> Endpoints protegidos requerem header: `Authorization: Bearer <token>`

### Auth — `/auth`

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| POST | `/auth/register` | Não | Cadastro de novo usuário |
| POST | `/auth/login` | Não | Login — retorna JWT |
| GET | `/auth/me` | Sim | Dados do usuário logado + loja + imagemUrl |
| PUT | `/auth/me` | Sim | Atualiza nome e/ou e-mail |
| PUT | `/auth/senha` | Sim | Altera senha (exige senha atual) |
| POST | `/auth/recuperar-senha` | Não | Solicita reset de senha |
| POST | `/auth/nova-senha` | Não | Confirma reset com token |

### Upload — `/upload`

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| POST | `/upload/avatar` | Sim | Upload de foto de perfil (multipart/form-data, campo `avatar`) |

> Imagens servidas estaticamente em: `GET /uploads/avatars/<filename>`  
> Formatos aceitos: JPEG, PNG, WEBP — máx. 10 MB  
> Arquivos salvos em: `uploads/avatars/` no servidor

### Loja — `/loja`

| Método | Rota | Auth | Role | Descrição |
|---|---|---|---|---|
| GET | `/loja` | Sim | PROFISSIONAL | Retorna dados da loja do usuário logado |
| PUT | `/loja` | Sim | PROFISSIONAL | Atualiza dados da loja e perfil profissional |

### Disponibilidade — `/disponibilidade`

| Método | Rota | Auth | Role | Descrição |
|---|---|---|---|---|
| GET | `/disponibilidade` | Sim | PROFISSIONAL | Lista horários semanais |
| PUT | `/disponibilidade` | Sim | PROFISSIONAL | Atualiza horários semanais (upsert de todos os dias) |

### Bloqueios — `/bloqueios`

| Método | Rota | Auth | Role | Descrição |
|---|---|---|---|---|
| GET | `/bloqueios` | Sim | PROFISSIONAL | Lista todos os bloqueios |
| GET | `/bloqueios/:id` | Sim | PROFISSIONAL | Detalhe de um bloqueio |
| POST | `/bloqueios` | Sim | PROFISSIONAL | Cria novo bloqueio |
| PUT | `/bloqueios/:id` | Sim | PROFISSIONAL | Atualiza bloqueio |
| DELETE | `/bloqueios/:id` | Sim | PROFISSIONAL | Remove bloqueio |

### Serviços — `/servicos`

| Método | Rota | Auth | Role | Descrição |
|---|---|---|---|---|
| GET | `/servicos` | Sim | PROFISSIONAL | Lista serviços da loja |
| POST | `/servicos` | Sim | PROFISSIONAL | Cria serviço |
| PUT | `/servicos/:id` | Sim | PROFISSIONAL | Atualiza serviço |
| DELETE | `/servicos/:id` | Sim | PROFISSIONAL | Remove serviço |

### Clientes — `/clientes`

| Método | Rota | Auth | Role | Descrição |
|---|---|---|---|---|
| GET | `/clientes` | Sim | PROFISSIONAL | Lista clientes da loja |
| GET | `/clientes/:id` | Sim | PROFISSIONAL | Detalhe do cliente |
| POST | `/clientes` | Sim | PROFISSIONAL | Cadastra cliente |
| PUT | `/clientes/:id` | Sim | PROFISSIONAL | Atualiza cliente |
| DELETE | `/clientes/:id` | Sim | PROFISSIONAL | Remove cliente |

### Agendamentos — `/agendamentos`

| Método | Rota | Auth | Role | Descrição |
|---|---|---|---|---|
| GET | `/agendamentos` | Sim | PROFISSIONAL | Lista agendamentos (filtros: data, status, clienteId, servicoId) |
| POST | `/agendamentos` | Sim | PROFISSIONAL | Cria agendamento via painel |
| PUT | `/agendamentos/:id` | Sim | Ambos | Atualiza / cancela agendamento |
| DELETE | `/agendamentos/:id` | Sim | PROFISSIONAL | Remove agendamento |
| GET | `/agendamentos/meus` | Sim | Ambos | Agendamentos do usuário logado |
| POST | `/agendamentos/publicos` | Não | — | Agendamento público (marketplace) |

### Profissionais — `/profissionais` (público)

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| GET | `/profissionais` | Não | Lista profissionais publicados (filtros: q, cidade, categoria, modalidade) |
| GET | `/profissionais/:id` | Não | Detalhes + serviços do profissional |
| GET | `/profissionais/:id/disponibilidade` | Não | Slots disponíveis em uma data (`?data=YYYY-MM-DD`) |

### Dashboard — `/dashboard`

| Método | Rota | Auth | Role | Descrição |
|---|---|---|---|---|
| GET | `/dashboard/resumo` | Sim | PROFISSIONAL | Métricas do dia (clientes, serviços, agendamentos) + próximo agendamento |

### Onboarding — `/onboarding`

| Método | Rota | Auth | Role | Descrição |
|---|---|---|---|---|
| POST | `/onboarding/finalizar` | Sim | PROFISSIONAL | Finaliza cadastro: salva dados da loja e cria disponibilidade padrão |

---

## Telas do Frontend

### Painel do Profissional

| Rota | Componente | Status | Backend usado |
|---|---|---|---|
| `/dashboard` | DashboardComponent | Funcional | `GET /dashboard/resumo` |
| `/agenda` | AgendaComponent | Funcional | `GET /agendamentos` |
| `/servicos` | ServicosComponent | Funcional | CRUD `/servicos` |
| `/clientes` | ClientesComponent | Funcional | CRUD `/clientes` |
| `/configuracoes` | ConfiguracoesComponent | Funcional | — (menu de navegação) |
| `/configuracoes/perfil` | PerfilComponent | Funcional | `GET/PUT /auth/me`, `PUT /auth/senha`, `POST /upload/avatar` |
| `/configuracoes/dados-loja` | DadosLojaComponent | Funcional | `GET/PUT /loja`, `GET/PUT /disponibilidade` |
| `/configuracoes/notificacoes` | NotificacoesComponent | UI completa | — (sem backend de notificações) |
| `/configuracoes/bloqueios` | BloqueiosComponent | Funcional | CRUD `/bloqueios` |

### Marketplace (público)

| Rota | Componente | Status | Backend usado |
|---|---|---|---|
| `/` | HomeMarketplaceComponent | Funcional | `GET /profissionais` |
| `/explorar` | ExplorarComponent | Funcional | `GET /profissionais` com filtros |
| `/agendar/:id` | AgendarComponent | Funcional | `GET /profissionais/:id`, `POST /agendamentos/publicos` |
| `/meus-agendamentos` | MeusAgendamentosComponent | Funcional | `GET /agendamentos/meus` |

### Auth

| Rota | Componente | Status |
|---|---|---|
| `/login` | LoginComponent | Funcional |
| `/cadastro` | CadastroComponent | Funcional |
| `/recuperar-senha` | RecuperarSenhaComponent | Funcional |
| `/nova-senha` | NovaSenhaComponent | Funcional |
| `/onboarding` | OnboardingComponent | Funcional |

---

## Upload de Imagem de Perfil

**Como funciona:**

1. Usuário clica no avatar (ou no botão "Trocar foto") na tela Perfil
2. Abre seletor de arquivos nativo do sistema operacional
3. Arquivo é validado localmente (tipo e tamanho)
4. Preview é exibido imediatamente (FileReader API)
5. Arquivo é enviado via `POST /upload/avatar` (multipart/form-data)
6. Backend salva em `uploads/avatars/<timestamp>-<random>.<ext>`
7. Avatar anterior é deletado automaticamente do disco
8. URL é persistida na tabela `Loja.imagemUrl` e `PerfilProfissional.imagemUrl`
9. Imagem é servida estaticamente pelo Express em `/uploads/avatars/<filename>`

---

## Como Executar

### Pré-requisitos

- Node.js 18+
- Docker Desktop
- Angular CLI (`npm install -g @angular/cli`)

### Backend

```bash
# 1. Entrar na pasta do backend
cd BookaBackendV2

# 2. Instalar dependências
npm install

# 3. Subir o banco de dados
docker compose up -d

# 4. Aplicar migrations e gerar client Prisma
npx prisma migrate deploy
npx prisma generate

# 5. Popular o banco com dados de exemplo
npm run seed

# 6. Iniciar o servidor de desenvolvimento
npm run dev
```

Servidor disponível em: `http://localhost:3001`  
Documentação Swagger: `http://localhost:3001/docs`  
Prisma Studio (visualizar banco): `npx prisma studio` → `http://localhost:5555`

### Frontend

```bash
# 1. Entrar na pasta do frontend
cd booka-frontend

# 2. Instalar dependências
npm install

# 3. Iniciar o servidor de desenvolvimento
ng serve
```

Aplicação disponível em: `http://localhost:4200`

---

## Credenciais de Teste (após seed)

| Tipo | E-mail | Senha |
|---|---|---|
| Profissional | `profissional@booka.local` | `12345678` |
| Cliente | `cliente@booka.local` | `12345678` |

---

## Variáveis de Ambiente (`.env`)

```env
PORT=3001
CLIENT_ORIGIN=http://localhost:4200
DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5434/booka_v2?schema=public
DIRECT_URL=postgresql://postgres:postgres@127.0.0.1:5434/booka_v2?schema=public
JWT_SECRET=booka-v2-local-secret-change-me
JWT_TTL_SECONDS=604800
```

---

## Dependências Principais

### Backend

| Pacote | Uso |
|---|---|
| `express` | Framework HTTP |
| `@prisma/client` + `prisma` | ORM e migrations |
| `jsonwebtoken` | Geração e verificação de JWT |
| `bcryptjs` | Hash de senhas |
| `zod` | Validação de schemas |
| `multer` | Upload de arquivos (multipart/form-data) |
| `cors` | Política de CORS |
| `swagger-ui-express` | Documentação interativa da API |

### Frontend

| Pacote | Uso |
|---|---|
| `@angular/core` 17+ | Framework SPA |
| `@angular/common/http` | Cliente HTTP + interceptor JWT |
| `rxjs` | Programação reativa (forkJoin, Observable) |
| `tailwindcss` | Estilização utilitária |

---

## Observações Técnicas

- **Preços** são armazenados em centavos (`precoCentavos: Int`) e convertidos para reais no frontend (`preco / 100`)
- **Horários** de disponibilidade usam formato `HH:mm` (string), não DateTime
- **Dias da semana** seguem padrão JavaScript: `0 = Domingo`, `1 = Segunda`, …, `6 = Sábado`
- **Slug** da loja é gerado automaticamente no cadastro: `nome-normalizado-<8 chars do uuid>`
- **Agendamentos públicos** criam o cliente automaticamente via upsert (por telefone) se ele não existir
- **Disponibilidade padrão** é criada automaticamente no onboarding: Seg–Sex 09:00–18:00, Sáb 09:00–14:00, 30min
- **Upload de avatares** substitui o arquivo anterior automaticamente para não acumular arquivos órfãos no disco
