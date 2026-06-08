# 📊 COMPARATIVO BACKEND vs FRONTEND

## Status de Cada Módulo

### 🔐 AUTH
| Feature | Backend | Frontend | Ação |
|---------|---------|----------|------|
| Register | ✅ POST /auth/register | ❌ Chamando endpoint errado | Corrigir endpoint |
| Login | ✅ POST /auth/login | ⚠️ Existe mas com `senha` | Mudar para `password` |
| Me | ✅ GET /auth/me | ❌ Não implementado | Implementar |
| Logout | ✅ Limpeza token | ✅ localStorage.removeItem | OK |
| Refresh Token | ❌ Não existe no backend | ❌ Não no frontend | ❌ Futuro |
| **Status** | **80%** | **30%** | **Conectar em 2h** |

### 🏢 ONBOARDING
| Feature | Backend | Frontend | Ação |
|---------|---------|----------|------|
| Complete | ✅ POST /onboarding/complete | ✅ Tela existe | Conectar |
| **Status** | **100%** | **50%** | **Conectar em 1h** |

### 🏪 LOJA
| Feature | Backend | Frontend | Ação |
|---------|---------|----------|------|
| Get | ✅ GET /loja | ❌ Não tem serviço | Criar service |
| Update | ✅ PUT /loja | ❌ Não tem serviço | Criar service |
| Create | ✅ POST /loja | ❌ Não tem serviço | Criar service |
| **Status** | **100%** | **10%** | **Conectar em 2h** |

### 👨‍💼 PROFISSIONAIS (Público)
| Feature | Backend | Frontend | Ação |
|---------|---------|----------|------|
| List | ✅ GET /profissionais | ❌ Mockado | Conectar |
| Detail (slug) | ✅ GET /profissionais/:slug | ❌ Mockado | Conectar |
| Disponibilidade | ✅ GET /profissionais/:slug/disponibilidade | ❌ Mockado | Conectar |
| **Status** | **100%** | **0%** | **Conectar em 3h** |

### 🛠️ SERVIÇOS
| Feature | Backend | Frontend | Ação |
|---------|---------|----------|------|
| List (profissional) | ✅ GET /servicos | ⚠️ Service básico existe | Atualizar |
| Create | ✅ POST /servicos | ❌ UI tem form, precisa serviço | Conectar |
| Update | ✅ PUT /servicos/:id | ❌ UI tem form, precisa serviço | Conectar |
| Delete | ✅ DELETE /servicos/:id | ❌ UI tem form, precisa serviço | Conectar |
| **Status** | **100%** | **20%** | **Conectar em 3h** |

### 👥 CLIENTES
| Feature | Backend | Frontend | Ação |
|---------|---------|----------|------|
| List (profissional) | ✅ GET /clientes | ⚠️ Service básico existe | Atualizar |
| Create | ✅ POST /clientes | ❌ UI existe, precisa serviço | Conectar |
| Update | ✅ PUT /clientes/:id | ❌ UI existe, precisa serviço | Conectar |
| Delete | ✅ DELETE /clientes/:id | ❌ UI existe, precisa serviço | Conectar |
| **Status** | **100%** | **20%** | **Conectar em 3h** |

### 📅 AGENDAMENTOS
| Feature | Backend | Frontend | Ação |
|---------|---------|----------|------|
| Create (público) | ✅ POST /agendamentos/publicos | ❌ Form existe, precisa endpoint | Conectar |
| List (profissional) | ✅ GET /agendamentos | ⚠️ UI mockada | Conectar |
| Update | ✅ PUT /agendamentos/:id | ❌ Precisa service | Conectar |
| Delete | ✅ DELETE /agendamentos/:id | ❌ Precisa service | Conectar |
| **Status** | **100%** | **10%** | **Conectar em 4h** |

### 📊 DASHBOARD
| Feature | Backend | Frontend | Ação |
|---------|---------|----------|------|
| Summary | ✅ GET /dashboard | ❌ Básico mockado | Conectar |
| **Status** | **60%** | **10%** | **Conectar em 1h** |

### 🚫 BLOQUEIOS
| Feature | Backend | Frontend | Ação |
|---------|---------|----------|------|
| List | ✅ GET /bloqueios | ❌ Tela não existe | Criar tela |
| Create | ✅ POST /bloqueios | ❌ Tela não existe | Criar tela |
| Delete | ✅ DELETE /bloqueios/:id | ❌ Tela não existe | Criar tela |
| **Status** | **100%** | **0%** | **Futuro (baixa prioridade)** |

---

## 🎯 ORDEM DE PRIORIDADE

### 🔴 CRÍTICO (Fazer AGORA)
```
1. Auth (login/register) ← Tudo depende disso
2. Profissionais (listar público)
3. Agendar (criar público)
4. Agendamentos (listar painel)
```

### 🟡 IMPORTANTE (Semana 2)
```
5. Serviços (CRUD painel)
6. Clientes (CRUD painel)
7. Loja (editar dados)
```

### 🟢 DEPOIS (Semana 3+)
```
8. Dashboard
9. Bloqueios
10. E2E tests
11. Segurança avançada
```

---

## 📈 GRÁFICO DE PROGRESSO

```
Hoje (18/05):
┌─────────────────────────────────────────────┐
│ BACKEND:   ████████████████████ 90%        │
│ FRONTEND:  ████░░░░░░░░░░░░░░░░  20%       │
│ INTEGRAÇÃO:░░░░░░░░░░░░░░░░░░░░░  0%       │
└─────────────────────────────────────────────┘

Objetivo (Semana 2):
┌─────────────────────────────────────────────┐
│ BACKEND:   ████████████████████ 95%        │
│ FRONTEND:  ████████░░░░░░░░░░░░  40%       │
│ INTEGRAÇÃO:██████░░░░░░░░░░░░░░  30%       │
└─────────────────────────────────────────────┘

Objetivo (Semana 4):
┌─────────────────────────────────────────────┐
│ BACKEND:   ████████████████████ 100%       │
│ FRONTEND:  ████████████░░░░░░░░  60%       │
│ INTEGRAÇÃO:████████████░░░░░░░░  60%       │
└─────────────────────────────────────────────┘

Objetivo (Semana 6):
┌─────────────────────────────────────────────┐
│ BACKEND:   ████████████████████ 100%       │
│ FRONTEND:  ████████████████████ 100%       │
│ INTEGRAÇÃO:████████████████████ 100%       │
└─────────────────────────────────────────────┘
```

---

## 🔄 FLUXO DE DADOS

### Cadastro de Profissional
```
Frontend (Cadastro)
    ↓ POST /auth/register {email, password, nome, role: PROFISSIONAL}
Backend (Auth Service)
    ↓ Cria usuário + PerfilProfissional
Backend (Retorna)
    ↓ {user, token}
Frontend (Armazena)
    ↓ localStorage.setItem('token', token)
    ↓ Redireciona para /onboarding
Frontend (Onboarding)
    ↓ POST /onboarding/complete {dadosLoja, perfilProfissional}
Backend (Onboarding Service)
    ↓ Atualiza Loja + PerfilProfissional
Frontend (Sucesso)
    ↓ Redireciona para /agenda
```

### Agendamento Cliente
```
Frontend (Explorar - Público)
    ↓ GET /profissionais (sem token)
Backend (Retorna lista pública)
    ↓ Lista com profissionais.publicado = true
Frontend (Seleciona profissional)
    ↓ GET /profissionais/:slug (sem token)
    ↓ GET /profissionais/:slug/disponibilidade (sem token)
Backend (Retorna detalhe + disponibilidades)
Frontend (Formulário de agendamento)
    ↓ POST /agendamentos/publicos {nomeCliente, emailCliente, servicoId, data, hora}
Backend (Cria agendamento)
    ↓ Status: PENDENTE, Origem: PUBLICO
Backend (Retorna)
    ↓ {agendamento}
Frontend (Sucesso)
    ↓ Mensagem "Seu agendamento foi criado!"
```

### Painel do Profissional
```
Frontend (Login)
    ↓ POST /auth/login {email, password}
Backend (Autentica)
    ↓ Valida credenciais
Backend (Retorna)
    ↓ {user, token}
Frontend (Armazena + redireciona)
    ↓ localStorage.setItem('token', token)
    ↓ Redireciona para /agenda
Frontend (Agenda - com token)
    ↓ GET /agendamentos (header Authorization: Bearer token)
Backend (Valida token + role)
    ↓ Valida JWT
    ↓ Valida role = PROFISSIONAL
    ↓ Retorna apenas agendamentos do usuário
Backend (Retorna)
    ↓ {data: [agendamentos]}
Frontend (Exibe agenda)
    ↓ Lista agendamentos com status
```

---

## 🛠️ MUDANÇAS NECESSÁRIAS NO FRONTEND

### AuthService
```typescript
// ANTES (errado)
login(email: string, senha: string) {
  return this.http.post(`${this.apiUrl}/auth/login`, { email, senha })

// DEPOIS (correto)
login(email: string, password: string) {
  return this.http.post(`${this.apiUrl}/auth/login`, { email, password })
```

### Environment
```typescript
// ANTES
apiUrl: 'http://localhost:3000/api'

// DEPOIS
apiUrl: 'http://localhost:3001'
```

### Handling de Response
```typescript
// ANTES (esperava response.token e response.usuario)
if (response.token) localStorage.setItem('token', response.token)

// DEPOIS (ajustar conforme estrutura real do backend)
if (response.token) localStorage.setItem('token', response.token)
// OK, é igual! Mas verifiçar estrutura real
```

---

## ✅ VERIFICAÇÃO RÁPIDA

Rode isto para verificar se tudo está certo:

**No seu terminal (frontend):**
```bash
npm start
# Deve abrir http://localhost:4200
```

**Em outro terminal (backend):**
```bash
cd BookaBackendV2
npm run dev
# Deve rodar http://localhost:3001
```

**No navegador, abra:**
```
http://localhost:3001/docs
```

Você deve ver Swagger com todos os endpoints listados.

**Teste um endpoint:**
```
GET http://localhost:3001/profissionais
```

Se retornar lista de profissionais, o backend está OK!

---

## 🚀 PRÓXIMOS PASSOS

1. **Hoje:** Ler este documento
2. **Amanhã:** Ler `INTEGRACAO_BACKEND.md`
3. **Esta semana:** Começar implementação Fase 1
4. **Próxima semana:** Ter marketplace funcionando
5. **Semana 3:** Ter painel funcionando

**Qualquer dúvida?** Abra issue no repo do backend ou converse com Rubens/Giulliano.

---

**Documento:** Comparativo Backend vs Frontend
**Versão:** 1.0
**Última atualização:** 18/05/2026
**Status:** Pronto para ação

