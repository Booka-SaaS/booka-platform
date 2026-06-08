# 🔄 ALINHAMENTO FRONTEND + BACKEND - ANÁLISE TÉCNICA

**Data:** 18 de Maio de 2026
**Frontend:** Angular 19 (seu projeto)
**Backend:** Express + Prisma + PostgreSQL (repo: BookaBackendV2)

---

## 📊 STATUS DA INTEGRAÇÃO

### Backend Status
✅ **Express Server** rodando na porta 3001
✅ **Banco PostgreSQL** via Prisma
✅ **JWT Authentication** implementado
✅ **Swagger/OpenAPI** documentado
✅ **9 Módulos completos:**
- auth (register, login, me)
- onboarding
- loja (store data)
- servicos (CRUD)
- clientes (CRUD)
- agendamentos (CRUD + público)
- profissionais (public listing)
- dashboard (básico)
- bloqueios (schedule blocks)

### Frontend Status
⚠️ **Componentes visuais** 100% prontos
⚠️ **Serviços Angular** existem mas incompletos
❌ **Integração real** com backend - NÃO FEITA
❌ **Testes** - NÃO FEITO
❌ **Segurança** - PARCIAL

**Prioridade:** Integração é CRÍTICA antes de testes/segurança!

---

## 🔌 MAPEAMENTO DE ENDPOINTS

### Backend Base URL
```
http://localhost:3001
```

### Documentação
```
Swagger: http://localhost:3001/docs
Health Check: http://localhost:3001/health
```

### Endpoints Disponíveis

#### 🔐 Authentication (`/auth`)

| Método | Endpoint | Headers | Body | Response |
|--------|----------|---------|------|----------|
| POST | `/auth/register` | - | `{ email, password, nome, role }` | `{ user, token }` |
| POST | `/auth/login` | - | `{ email, password }` | `{ user, token }` |
| GET | `/auth/me` | `Authorization: Bearer {token}` | - | `{ user }` |

**Notas Importantes:**
- Backend espera `camelCase` (não snake_case)
- `role` pode ser: `CLIENTE` ou `PROFISSIONAL`
- `password` (não `senha`)
- Token vem no response como `token`

#### 📋 Onboarding (`/onboarding`)

| Método | Endpoint | Auth | Body |
|--------|----------|------|------|
| POST | `/onboarding/complete` | ✅ | Dados da loja e perfil |

#### 🏪 Loja (`/loja`)

| Método | Endpoint | Auth | Notes |
|--------|----------|------|-------|
| GET | `/loja` | ✅ | Retorna loja do usuário autenticado |
| PUT | `/loja` | ✅ | Atualiza dados da loja |
| POST | `/loja` | ✅ | Cria loja (se não existir) |

#### 👨‍💼 Profissionais (`/profissionais`)

| Método | Endpoint | Auth | Notes |
|--------|----------|------|-------|
| GET | `/profissionais` | ❌ | Listing público com paginação |
| GET | `/profissionais/:slug` | ❌ | Detalhe público (by slug) |
| GET | `/profissionais/:slug/disponibilidade` | ❌ | Disponibilidade por data |

#### 🛠️ Serviços (`/servicos`)

| Método | Endpoint | Auth | Notes |
|--------|----------|------|-------|
| GET | `/servicos` | ✅ | Lista serviços do profissional |
| POST | `/servicos` | ✅ | Criar serviço |
| PUT | `/servicos/:id` | ✅ | Atualizar |
| DELETE | `/servicos/:id` | ✅ | Deletar |

#### 👥 Clientes (`/clientes`)

| Método | Endpoint | Auth | Notes |
|--------|----------|------|-------|
| GET | `/clientes` | ✅ | Lista clientes |
| POST | `/clientes` | ✅ | Criar cliente |
| PUT | `/clientes/:id` | ✅ | Atualizar |
| DELETE | `/clientes/:id` | ✅ | Deletar |

#### 📅 Agendamentos (`/agendamentos`)

| Método | Endpoint | Auth | Notes |
|--------|----------|------|-------|
| GET | `/agendamentos` | ✅ (PROFISSIONAL) | Lista agendamentos |
| POST | `/agendamentos` | ✅ (PROFISSIONAL) | Criar agendamento |
| PUT | `/agendamentos/:id` | ✅ (PROFISSIONAL) | Atualizar |
| DELETE | `/agendamentos/:id` | ✅ (PROFISSIONAL) | Deletar |
| POST | `/agendamentos/publicos` | ❌ | Cliente cria agendamento |

#### 📊 Dashboard (`/dashboard`)

| Método | Endpoint | Auth | Notes |
|--------|----------|------|-------|
| GET | `/dashboard` | ✅ (PROFISSIONAL) | Resumo básico |

#### 🚫 Bloqueios (`/bloqueios`)

| Método | Endpoint | Auth | Notes |
|--------|----------|------|-------|
| GET | `/bloqueios` | ✅ (PROFISSIONAL) | Lista bloqueios |
| POST | `/bloqueios` | ✅ (PROFISSIONAL) | Criar bloqueio |
| DELETE | `/bloqueios/:id` | ✅ (PROFISSIONAL) | Deletar bloqueio |

---

## 📝 MODELOS DE DADOS (Prisma)

### Usuario
```prisma
{
  id              UUID
  nome            String
  email           String (unique)
  passwordHash    String
  role            UserRole (CLIENTE | PROFISSIONAL)
  ativo           Boolean
  createdAt       DateTime
  updatedAt       DateTime
  perfilProfissional PerfilProfissional?
  loja            Loja?
}
```

### Agendamento
```prisma
{
  id              UUID
  dataAgendamento DateTime
  horaInicio      DateTime
  horaFim         DateTime
  status          StatusAgendamento (PENDENTE | CONFIRMADO | CANCELADO | CONCLUIDO)
  origem          OrigemAgendamento (PUBLICO | PAINEL)
  nomeCliente     String
  emailCliente    String
  telefoneCliente String?
  notasCliente    String?
  servicoId       UUID
  clienteId       UUID?
  lojaId          UUID
  createdAt       DateTime
  updatedAt       DateTime
}
```

### Servico
```prisma
{
  id              UUID
  nome            String
  descricao       String?
  preco           Decimal
  duracao         Int (minutos)
  categoria       String
  lojaId          UUID
  createdAt       DateTime
  updatedAt       DateTime
}
```

---

## ⚙️ COMO RODAR BACKEND LOCALMENTE

```bash
# 1. Clone o repo
git clone https://github.com/RubensGJ/BookaBackendV2.git
cd BookaBackendV2

# 2. Configure ambiente
copy .env.example .env

# 3. Suba o PostgreSQL
docker compose up -d

# 4. Instale dependências
npm install
npm run prisma:generate

# 5. Rode migrations
npm run prisma:migrate

# 6. Seed dados de teste
npm run seed

# 7. Inicie servidor
npm run dev

# Backend estará em: http://localhost:3001
# Swagger: http://localhost:3001/docs
```

---

## ✅ TAREFAS DO FRONTEND (LÁ PARA VOCÊ)

### FASE 1: INTEGRAÇÃO BÁSICA (1-2 Semanas)

#### 1.1 Atualizar Environment Variables

**Arquivo:** `src/environments/environment.ts`

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3001',  // ← MUDE PARA 3001
  apiVersion: 'v1',

  // URLs de endpoints específicos (opcional)
  endpoints: {
    auth: '/auth',
    profissionais: '/profissionais',
    servicos: '/servicos',
    agendamentos: '/agendamentos',
    clientes: '/clientes',
    loja: '/loja',
    bloqueios: '/bloqueios',
    dashboard: '/dashboard',
  },

  jwt: {
    accessTokenExpiry: 15 * 60 * 1000,      // 15 minutos
    refreshTokenExpiry: 7 * 24 * 60 * 60 * 1000, // 7 dias
  },

  security: {
    enableCSP: true,
    enableHTTPS: false,
    secureCookies: false
  }
};
```

**Arquivo:** `src/environments/environment.production.ts`

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.booka.com',  // ← Produção
  // ... rest igual
};
```

#### 1.2 Atualizar AuthService para camelCase

**Arquivo:** `src/app/services/auth.service.ts`

O backend espera `password` (não `senha`). Atualize o serviço:

```typescript
export class AuthService {
  login(email: string, password: string) {  // ← era 'senha'
    return this.http.post<{ token: string, user?: any }>(
      `${this.apiUrl}/auth/login`,
      { email, password }  // ← agora 'password'
    ).pipe(
      tap(response => {
        if (response.token) {
          localStorage.setItem('token', response.token);
          const role = response.user?.role || 'CLIENTE';
          localStorage.setItem('role', role);
        }
      })
    );
  }

  register(nome: string, email: string, password: string, role: string) {  // ← senha → password
    return this.http.post<{ token: string, user?: any }>(
      `${this.apiUrl}/auth/register`,
      { nome, email, password, role }  // ← password aqui também
    ).pipe(
      tap(response => {
        if (response.token) {
          localStorage.setItem('token', response.token);
          const userRole = response.user?.role || role || 'CLIENTE';
          localStorage.setItem('role', userRole);
        }
      })
    );
  }
}
```

#### 1.3 Criar Serviços para cada Módulo

**Arquivo:** `src/app/services/profissional.service.ts`

```typescript
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProfissionalService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/profissionais`;

  // Listing público
  listarProfissionais(params?: any) {
    return this.http.get<any>(`${this.apiUrl}`, { params });
  }

  // Detalhe por slug
  obterPorSlug(slug: string) {
    return this.http.get<any>(`${this.apiUrl}/${slug}`);
  }

  // Disponibilidade
  obterDisponibilidade(slug: string, data: string) {
    return this.http.get<any>(`${this.apiUrl}/${slug}/disponibilidade`, {
      params: { data }
    });
  }
}
```

**Arquivo:** `src/app/services/agendamento.service.ts`

```typescript
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AgendamentoService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/agendamentos`;

  // Cliente criar agendamento (público)
  criarPublico(dados: any) {
    return this.http.post<any>(`${this.apiUrl}/publicos`, dados);
  }

  // Profissional: listar seus agendamentos
  listar(params?: any) {
    return this.http.get<any>(`${this.apiUrl}`, { params });
  }

  // Profissional: criar agendamento
  criar(dados: any) {
    return this.http.post<any>(`${this.apiUrl}`, dados);
  }

  // Profissional: atualizar agendamento
  atualizar(id: string, dados: any) {
    return this.http.put<any>(`${this.apiUrl}/${id}`, dados);
  }

  // Profissional: deletar agendamento
  deletar(id: string) {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
```

**Arquivo:** `src/app/services/servico.service.ts`

```typescript
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ServicoService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/servicos`;

  listar(params?: any) {
    return this.http.get<any>(`${this.apiUrl}`, { params });
  }

  criar(dados: any) {
    return this.http.post<any>(`${this.apiUrl}`, dados);
  }

  atualizar(id: string, dados: any) {
    return this.http.put<any>(`${this.apiUrl}/${id}`, dados);
  }

  deletar(id: string) {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
```

**Arquivo:** `src/app/services/cliente.service.ts`

```typescript
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ClienteService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/clientes`;

  listar(params?: any) {
    return this.http.get<any>(`${this.apiUrl}`, { params });
  }

  criar(dados: any) {
    return this.http.post<any>(`${this.apiUrl}`, dados);
  }

  atualizar(id: string, dados: any) {
    return this.http.put<any>(`${this.apiUrl}/${id}`, dados);
  }

  deletar(id: string) {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
```

**Arquivo:** `src/app/services/loja.service.ts`

```typescript
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class LojaService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/loja`;

  obter() {
    return this.http.get<any>(`${this.apiUrl}`);
  }

  criar(dados: any) {
    return this.http.post<any>(`${this.apiUrl}`, dados);
  }

  atualizar(dados: any) {
    return this.http.put<any>(`${this.apiUrl}`, dados);
  }
}
```

#### 1.4 Adicionar Services nos App Config

**Arquivo:** `src/app/app.config.ts`

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors, HTTP_INTERCEPTORS } from '@angular/common/http';
import { authInterceptor } from './interceptors/auth.interceptor';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),
    // Adicione os serviços aqui se usar providedIn: 'root' em cada um
  ]
};
```

#### 1.5 Conectar Componentes aos Serviços

**Exemplo - Login Component:**

`src/app/pages/login/login.component.ts`

```typescript
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm: FormGroup;
  loading = false;
  errorMessage = '';

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]  // ← password (não senha)
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.loading = true;
    this.errorMessage = '';

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: (response) => {
        this.loading = false;
        // Redirecionar baseado no role
        const role = localStorage.getItem('role');
        if (role === 'PROFISSIONAL') {
          this.router.navigate(['/agenda']);
        } else {
          this.router.navigate(['/explorar']);
        }
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.error?.message || 'Erro ao fazer login';
        console.error('Login error:', error);
      }
    });
  }
}
```

---

### FASE 2: INTEGRAÇÃO COMPLETA (1-2 Semanas Após Fase 1)

#### 2.1 Conectar Página de Exploração

**Arquivo:** `src/app/pages/explorar/explorar.component.ts`

```typescript
import { Component, OnInit, inject } from '@angular/core';
import { ProfissionalService } from '../../services/profissional.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-explorar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './explorar.component.html'
})
export class ExplorarComponent implements OnInit {
  private profissionalService = inject(ProfissionalService);

  profissionais: any[] = [];
  loading = false;
  error = '';

  ngOnInit() {
    this.carregarProfissionais();
  }

  carregarProfissionais(params?: any) {
    this.loading = true;
    this.profissionalService.listarProfissionais(params).subscribe({
      next: (data) => {
        this.profissionais = data.data || data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erro ao carregar profissionais';
        this.loading = false;
        console.error(err);
      }
    });
  }
}
```

#### 2.2 Conectar Página de Agendamento

**Arquivo:** `src/app/pages/agendar/agendar.component.ts`

```typescript
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProfissionalService } from '../../services/profissional.service';
import { AgendamentoService } from '../../services/agendamento.service';

@Component({
  selector: 'app-agendar',
  standalone: true,
  templateUrl: './agendar.component.html'
})
export class AgendarComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private profissionalService = inject(ProfissionalService);
  private agendamentoService = inject(AgendamentoService);

  profissionalSlug: string = '';
  profissional: any = null;
  agendamento = {
    nomeCliente: '',
    emailCliente: '',
    telefoneCliente: '',
    notasCliente: '',
    servicoId: '',
    dataAgendamento: '',
    horaInicio: ''
  };

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.profissionalSlug = params['id'];
      this.carregarProfissional();
    });
  }

  carregarProfissional() {
    this.profissionalService.obterPorSlug(this.profissionalSlug).subscribe({
      next: (data) => {
        this.profissional = data;
      },
      error: (err) => console.error('Erro ao carregar profissional', err)
    });
  }

  enviarAgendamento() {
    this.agendamentoService.criarPublico(this.agendamento).subscribe({
      next: (response) => {
        alert('Agendamento criado com sucesso!');
      },
      error: (err) => {
        alert('Erro ao criar agendamento: ' + err.error?.message);
      }
    });
  }
}
```

#### 2.3 Conectar Dashboard do Profissional

**Arquivo:** `src/app/pages/agenda/agenda.component.ts`

```typescript
import { Component, OnInit, inject } from '@angular/core';
import { AgendamentoService } from '../../services/agendamento.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-agenda',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './agenda.component.html'
})
export class AgendaComponent implements OnInit {
  private agendamentoService = inject(AgendamentoService);

  agendamentos: any[] = [];
  loading = false;

  ngOnInit() {
    this.carregarAgendamentos();
  }

  carregarAgendamentos() {
    this.loading = true;
    this.agendamentoService.listar().subscribe({
      next: (data) => {
        this.agendamentos = data.data || data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar agendamentos', err);
        this.loading = false;
      }
    });
  }

  atualizarStatus(id: string, novoStatus: string) {
    this.agendamentoService.atualizar(id, { status: novoStatus }).subscribe({
      next: () => {
        this.carregarAgendamentos();
      },
      error: (err) => console.error('Erro ao atualizar', err)
    });
  }

  deletarAgendamento(id: string) {
    if (confirm('Tem certeza que deseja deletar este agendamento?')) {
      this.agendamentoService.deletar(id).subscribe({
        next: () => {
          this.carregarAgendamentos();
        },
        error: (err) => console.error('Erro ao deletar', err)
      });
    }
  }
}
```

---

### FASE 3: TESTES & SEGURANÇA (1-2 Semanas Após Fase 2)

#### 3.1 Testes dos Serviços

*(Ver arquivo SNIPPETS_IMPLEMENTACAO.md para testes completos)*

#### 3.2 Validação de Input

Adicionar validadores conforme documentado em SNIPPETS_IMPLEMENTACAO.md

---

## 🚨 PONTOS CRÍTICOS

### ⚠️ Nome de Propriedades

| Frontend Esperado | Backend Envia |
|------------------|---------------|
| `senha` | `password` (errado) |
| `usuarios` | `users` |
| `agendamentos` | `agendamentos` ✅ |
| `servicos` | `servicos` ✅ |

**Ação:** Revisar cada serviço e adaptar para `camelCase` do backend.

### ⚠️ Autenticação

- Token vem no response como `token` (não `accessToken`)
- Header deve ser `Authorization: Bearer {token}`
- Backend valida via middleware `requireAuth`
- Logout é apenas local (localStorage)

### ⚠️ Paginação

Backend usa query params. Exemplo:
```
GET /profissionais?page=1&limit=10&categoria=cabelo
```

### ⚠️ Roles

- `CLIENTE` - Acessa marketplace (explorar, agendar, etc)
- `PROFISSIONAL` - Acessa painel (agenda, serviços, clientes, etc)

---

## ✅ CHECKLIST DE IMPLEMENTAÇÃO

### Semana 1 (Integração Básica):
- [ ] Atualizar environment.ts para apontar http://localhost:3001
- [ ] Corrigir AuthService (password em vez de senha)
- [ ] Criar ProfissionalService
- [ ] Criar AgendamentoService (público + painel)
- [ ] Criar ServicoService
- [ ] Criar ClienteService
- [ ] Criar LojaService
- [ ] Conectar Login Component
- [ ] Testar fluxo: Login → Redirect correto

### Semana 2 (Frontend Marketplace):
- [ ] Conectar Explorar Component (listar profissionais)
- [ ] Conectar Agendar Component (agendar público)
- [ ] Testar criar agendamento público
- [ ] Testar busca/filtro

### Semana 3 (Frontend Painel):
- [ ] Conectar Agenda Component (listar agendamentos)
- [ ] Conectar Servicos Component (CRUD)
- [ ] Conectar Clientes Component (CRUD)
- [ ] Conectar Loja Component (editar dados)

### Semana 4 (Qualidade):
- [ ] Testes unitários (serviços)
- [ ] Testes de integração (E2E)
- [ ] Segurança (CSP, sanitização)

---

## 🔗 RECURSOS

**Backend Swagger:** http://localhost:3001/docs
**Backend Health:** http://localhost:3001/health
**Backend Repo:** https://github.com/RubensGJ/BookaBackendV2.git

---

## 💡 PRÓXIMOS PASSOS

1. ✅ Clone e rode backend localmente
2. ✅ Teste endpoints no Swagger
3. ✅ Comece com AuthService (fase 1)
4. ✅ Teste login de verdade
5. ✅ Incremente com outros serviços

**Tempo estimado:** 3-4 semanas para integração completa
**Dependência:** Backend deve estar rodando localmente

---

**Versão:** 1.0
**Data:** 18/05/2026
**Status:** Pronto para implementação
