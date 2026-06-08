# 🎯 PRIORIDADES FRONTEND - PLANO DE AÇÃO

## EM UMA PÁGINA: O QUE VOCÊ PRECISA FAZER

### Situação Atual
- ✅ Frontend Angular: 100% visual pronto
- ✅ Backend Express: 100% funcional (9 módulos)
- ❌ **Integração:** 0% feita - CRÍTICA!
- ❌ **Testes:** 0% feito
- ⚠️ **Segurança:** 40% (parcial)

---

## 🔥 TOP 5 COISAS A FAZER (ORDEM)

### 1️⃣ Conectar Backend (CRÍTICO - Semana 1)
```
❌ Environment apontar para http://localhost:3001
❌ AuthService usar 'password' (não 'senha')
❌ Criar 6 novos serviços (Profissional, Agendamento, Servico, Cliente, Loja)
❌ Conectar componentes de login
❌ Testar login real com backend

⏱️ Esforço: 40 horas
```

### 2️⃣ Frontend Marketplace (Semana 2)
```
❌ Conectar "Explorar" ao listar profissionais
❌ Conectar "Agendar" ao criar agendamento público
❌ Testar fluxo completo: buscar → selecionar → agendar

⏱️ Esforço: 20 horas
```

### 3️⃣ Frontend Painel (Semana 3)
```
❌ Conectar "Agenda" ao listar agendamentos
❌ Conectar CRUD de Serviços
❌ Conectar CRUD de Clientes
❌ Conectar edição de Loja

⏱️ Esforço: 30 horas
```

### 4️⃣ Testes Unitários (Semana 4-5)
```
❌ Testes dos 6 serviços (auth, profissional, agendamento, etc)
❌ Testes dos componentes principais
❌ Meta: 80% cobertura

⏱️ Esforço: 40 horas
```

### 5️⃣ Segurança & Qualidade (Semana 5-6)
```
❌ CSP headers
❌ Input sanitization
❌ Refresh token logic
❌ E2E tests com Cypress

⏱️ Esforço: 30 horas
```

---

## 📋 CHECKLIST IMEDIATO (HOJE/AMANHÃ)

- [ ] Clone e rode backend: `git clone https://github.com/RubensGJ/BookaBackendV2.git`
- [ ] Verifique que backend está rodando em `http://localhost:3001`
- [ ] Abra `http://localhost:3001/docs` (Swagger)
- [ ] Teste endpoint `/health` no Swagger
- [ ] **Leia:** `INTEGRACAO_BACKEND.md` (este arquivo!)
- [ ] Comece implementação: Fase 1, Tarefa 1.1

---

## 🚀 ROADMAP VISUAL

```
SEMANA 1: Integração Backend Básica
├─ Env vars
├─ AuthService
├─ 6 Services criados
├─ Login conectado
└─ ✅ Resultado: Login funciona

SEMANA 2: Marketplace
├─ Explorar conectado
├─ Agendar público
└─ ✅ Resultado: Cliente consegue agendar

SEMANA 3: Painel
├─ Agenda (listar)
├─ Serviços (CRUD)
├─ Clientes (CRUD)
└─ ✅ Resultado: Profissional consegue gerenciar

SEMANA 4-5: Testes
├─ Services tests
├─ Component tests
├─ 80% cobertura
└─ ✅ Resultado: Código confiável

SEMANA 5-6: Segurança
├─ CSP
├─ Sanitização
├─ Refresh token
├─ E2E tests
└─ ✅ Resultado: App segura

TOTAL: 5-6 semanas → MVP funcional e testado
```

---

## 📊 ANTES vs DEPOIS

### ANTES (Agora)
```
Frontend: Componentes bonitos mas mockados
Backend: Endpoints prontos mas não ligados
Testes: Nenhum
Segurança: Básica
Resultado: Funciona offline apenas
```

### DEPOIS (Objetivo)
```
Frontend: Componentes conectados a backend real
Backend: Endpoints consumidos com sucesso
Testes: >80% cobertura
Segurança: OWASP compliant
Resultado: App funcional com marketplace + painel
```

---

## ❓ DÚVIDAS FREQUENTES

**P: Por quanto tempo vou trabalhar nisso?**
R: 5-6 semanas se dedicado full-time. Backend está pronto, só precisa conectar.

**P: Preciso esperar mobile terminar?**
R: Não! Mobile vai consumir a mesma API. Faça web primeiro.

**P: E se o backend tiver bugs?**
R: Comunique com Rubens/Giulliano via Issues no GitHub do backend.

**P: Qual é o priority order?**
R: 1) Login funcionar 2) Marketplace funcionar 3) Painel funcionar 4) Testes 5) Segurança

**P: Preciso fazer tudo de uma vez?**
R: Não! Faça fase por fase. Cada fase é "deployable".

---

## 🔗 RECURSOS

| Recurso | Link |
|---------|------|
| Backend Repo | https://github.com/RubensGJ/BookaBackendV2.git |
| Swagger (local) | http://localhost:3001/docs |
| Análise Completa | Ver ANALISE_REQUISITOS.md |
| Roadmap Técnico | Ver ROADMAP_TECNICO.md |
| Integração Detalhada | Ver INTEGRACAO_BACKEND.md ← Você está aqui |
| Snippets Code | Ver SNIPPETS_IMPLEMENTACAO.md |

---

## 🎯 DEFINIÇÃO DE "PRONTO"

### MVP - Pronto para testes (3 semanas)
- ✅ Login funciona
- ✅ Marketplace funciona (explorar + agendar)
- ✅ Painel básico funciona
- ✅ Endpoints integrados
- ✅ Sem testes ainda

### Production - Pronto para clientes (6 semanas)
- ✅ Tudo acima +
- ✅ >80% testes unitários
- ✅ E2E tests
- ✅ Segurança implementada
- ✅ Performance otimizada

---

## 📝 NOTAS IMPORTANTES

### 🔴 Mudanças de API que você PRECISA fazer:

1. **AuthService**
   - Mudar `senha` → `password`
   - Mudar `email` → `email` (ok)
   - Pegar `token` do response (não `accessToken`)

2. **Todos os serviços**
   - Verificar camelCase no backend
   - Adaptar models TypeScript
   - Testar response estrutura

3. **Routes/Guards**
   - Verificar redirecionamento baseado em `role`
   - CLIENTE → `/explorar`
   - PROFISSIONAL → `/agenda`

### 🟡 Integração com Frontend Mobile (Thiago):
- Mesmo backend (http://localhost:3001)
- Mesma autenticação JWT
- Mesmos endpoints
- Vocês trabalham em paralelo sem dependência

### 🟢 Integração com Backend (Rubens + Giulliano):
- Se encontrar bug, abra Issue no GitHub
- Comunique via repo/Discord/Teams
- Prioridade: endpoints de autenticação primeiro

---

## 🚀 COMECE AGORA

1. **Leia:** `INTEGRACAO_BACKEND.md` (completo)
2. **Clone:** Backend do GitHub
3. **Rode:** Backend localmente
4. **Implemente:** Fase 1 (environment + auth)
5. **Teste:** Login com backend real
6. **Repita:** Para cada módulo

---

**Próximo passo:** Abra `INTEGRACAO_BACKEND.md` para instruções detalhadas!

**Tempo de leitura:** 5 minutos
**Tempo de implementação:** 1 hora (Fase 1, Task 1.1-1.2)

