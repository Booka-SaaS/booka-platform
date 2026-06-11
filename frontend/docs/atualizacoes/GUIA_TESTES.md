# 🧪 GUIA DE TESTES E PRÓXIMOS PASSOS

**Data:** 18 de Maio de 2026  
**Etapa:** Preparado para Testes e Validação  
**Time:** Frontend Integration Complete ✅

---

## 🚀 1. Setup Inicial

### 1.1 Instalar Dependências
```bash
cd booka-frontend-1
npm install
```

### 1.2 Verificar Compilação TypeScript
```bash
ng build
# Ou rodar development server:
ng serve
```

### 1.3 Validar Backend Rodando
```bash
# Em outro terminal, verificar que backend está em localhost:3001:
curl http://localhost:3001/docs
# Deve retornar Swagger/OpenAPI docs
```

---

## ✅ 2. Checklist de Testes Funcionais

### 2.1 Teste de Login
- [ ] Abrir http://localhost:4200/login
- [ ] Inserir: `cliente@booka.com` / `teste123`
- [ ] Verificar redirecionamento para `/explorar`
- [ ] Verificar token em localStorage (`TOKEN_KEY`)
- [ ] Fazer logout → redirecionamento para home

### 2.2 Teste de Cadastro
- [ ] Abrir http://localhost:4200/cadastro
- [ ] Preencher:
  - [ ] Nome completo
  - [ ] Email válido
  - [ ] Senha com 8+ chars, maiúsculas, minúsculas, números
  - [ ] Confirmar senha
  - [ ] Selecionar role: CLIENTE ou PROFISSIONAL
- [ ] Submeter
  - [ ] Se CLIENTE → redirecionamento para `/explorar`
  - [ ] Se PROFISSIONAL → redirecionamento para `/onboarding`

### 2.3 Teste Explorar (Público)
- [ ] Abrir http://localhost:4200/explorar
- [ ] Verificar lista de profissionais carregando (GET /profissionais)
- [ ] Testar filtros:
  - [ ] Busca por nome
  - [ ] Filtro de preço
  - [ ] Filtro de avaliação
  - [ ] Filtro de modalidade
- [ ] Clicar em um profissional → `/agendar/:slug`

### 2.4 Teste Agendar (Público - Sem Login)
- [ ] Abrir `/agendar/:slug`
- [ ] Verificar detalhes do profissional (GET /profissionais/:slug)
- [ ] Selecionar serviço
- [ ] Selecionar data
- [ ] Verificar horários disponíveis (GET /profissionais/:slug/disponibilidade)
- [ ] Selecionar horário
- [ ] Preencher dados: nome, email, WhatsApp
- [ ] Submeter
- [ ] Verificar: POST /agendamentos/publicos chamado
- [ ] Mensagem de sucesso exibida

### 2.5 Teste Dashboard Profissional
- [ ] Login: `profissional@booka.com` / `teste123`
- [ ] Redirecionamento automático para `/dashboard`
- [ ] Acessar cada página:

#### 📅 Agenda (`/agenda`)
- [ ] GET /agendamentos retorna lista
- [ ] Exibir agendamentos em tabela/cards
- [ ] Teste de paginação (se implementado)

#### 📋 Serviços (`/servicos`)
- [ ] GET /servicos carrega lista
- [ ] Botão "Novo Serviço" abre modal
- [ ] Form: nome, preço, duração
- [ ] Submeter → POST /servicos
- [ ] Listar atualiza com novo item
- [ ] Edit → PUT /servicos/:id
- [ ] Delete → DELETE /servicos/:id com confirmação

#### 👥 Clientes (`/clientes`)
- [ ] GET /clientes carrega lista
- [ ] Novo cliente → POST /clientes
- [ ] Editar cliente → PUT /clientes/:id
- [ ] Deletar cliente → DELETE /clientes/:id

#### 🏪 Dados Loja (`/dados-loja`)
- [ ] GET /loja carrega informações
- [ ] Editar dados → PUT /loja
- [ ] Confirmação de sucesso

#### 🔒 Bloqueios (`/bloqueios`)
- [ ] GET /bloqueios carrega lista
- [ ] Novo bloqueio → POST /bloqueios (data_inicio, data_fim, motivo)
- [ ] Deletar bloqueio → DELETE /bloqueios/:id

### 2.6 Teste de Segurança
- [ ] Sem token: Acessar `/dashboard` → redirecionamento para `/login`
- [ ] Headers: Verificar `Authorization: Bearer {token}` em requisições
- [ ] XSS: Tentar inserir `<script>alert('xss')</script>` em campo
  - Deve ser sanitizado (não executar)
- [ ] CORS: Requisições cross-origin devem ser bloqueadas

---

## 🐛 3. Verificações de Console (DevTools)

### 3.1 Network Tab
- [ ] Todas requisições para `/api/` vão para `localhost:3001`
- [ ] Status 200 para requisições bem-sucedidas
- [ ] Status 401 para erros de autenticação
- [ ] Headers incluem `Authorization: Bearer {token}`

### 3.2 Application Tab
- [ ] localStorage contém `TOKEN_KEY` após login
- [ ] localStorage contém `ROLE_KEY` (PROFISSIONAL ou CLIENTE)
- [ ] localStorage contém `REFRESH_KEY` para refresh token

### 3.3 Console Tab
- [ ] Sem erros vermelhos críticos
- [ ] Warnings sobre deprecação de Angular OK
- [ ] Logs de requisições (opcional)

---

## 📊 4. Performance & UX

### 4.1 Loading States
- [ ] Explorar: loading spinner enquanto busca profissionais
- [ ] Agendar: loading spinner ao buscar disponibilidade
- [ ] Agenda: loading spinner ao listar agendamentos
- [ ] Dashboard: loading skeleton ou spinner

### 4.2 Error Handling
- [ ] Erro de API: exibir mensagem amigável
- [ ] Desconexão: sugerir reconectar
- [ ] Timeout: alertar ao usuário
- [ ] Validação: mostrar erros inline (se implementado)

### 4.3 Responsividade
- [ ] [ ] Desktop (1920x1080)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)

---

## 🔄 5. Testes de Integração End-to-End

### Fluxo Completo 1: Public Booking
```
1. Abrir /explorar (sem login)
2. Ver lista de profissionais
3. Clicar em um profissional
4. Ir para /agendar/:slug
5. Preencher todos os dados
6. Submeter → Agendamento criado
7. Verificar em backend: SELECT * FROM agendamentos WHERE cliente_email = ?
```

### Fluxo Completo 2: Professional Dashboard
```
1. Login: profissional@booka.com
2. Ir para /dashboard
3. Criar novo serviço em /servicos
4. Adicionar cliente em /clientes
5. Criar bloqueio em /bloqueios
6. Ver agendamentos em /agenda
7. Logout
```

### Fluxo Completo 3: Cliente Autenticado
```
1. Cadastro novo cliente
2. Login como cliente
3. Explorar profissionais
4. Agendar com profissional
5. Verificar agendamento em /meus-agendamentos (se implementado)
6. Logout
```

---

## 🛠️ 6. Testes Técnicos

### 6.1 Angular Build
```bash
# Verificar compilação
ng build

# Verificar bundle size
ng build --configuration production --stats-json
```

### 6.2 TypeScript Check
```bash
# Verificar tipos
ng build --configuration development

# Ou apenas type check
npx tsc --noEmit
```

### 6.3 Tests (Se Implementados)
```bash
# Unit tests
ng test

# E2E tests
ng e2e
```

---

## 📈 7. Monitoramento

### Métricas a Acompanhar
- [ ] Tempo de carregamento da página (`/explorar` < 2s)
- [ ] Tempo de requisição API (< 500ms)
- [ ] Taxa de sucesso de autenticação (100%)
- [ ] Taxa de erro de network (0%)

### Logs Importantes
```typescript
// AuthService
console.log('Login realizado para:', email); // Debug
console.error('Erro ao fazer login:', err); // Error

// ProfissionalService
console.error('Erro ao carregar profissionais:', err);

// AgendamentoService
console.error('Erro ao criar agendamento público:', err);
```

---

## 🚨 8. Possíveis Issues e Soluções

### Issue: "Cannot find module '@angular/core'"
**Causa:** Dependências não instaladas  
**Solução:** `npm install`

### Issue: "localhost:3001 connection refused"
**Causa:** Backend não está rodando  
**Solução:** Verificar se backend está em localhost:3001

### Issue: "401 Unauthorized em requisições"
**Causa:** Token expirado ou inválido  
**Solução:** Fazer logout + novo login

### Issue: "CORS error"
**Causa:** Headers de segurança  
**Solução:** Verificar CORS config no backend

### Issue: "XSS injection não é bloqueada"
**Causa:** SanitizeInterceptor não está funcionando  
**Solução:** Verificar se interceptor está registrado em app.config.ts

---

## 📝 9. Próximas Implementações (Backlog)

### Phase 6: Unit Tests
- [ ] Service tests (80% coverage)
- [ ] Component tests (50% coverage)
- [ ] Guard tests
- [ ] Interceptor tests

### Phase 7: E2E Tests
- [ ] Cypress tests para fluxos principais
- [ ] Test data seeding

### Phase 8: Otimizações
- [ ] Lazy loading de módulos
- [ ] Change detection optimization
- [ ] Image optimization
- [ ] Bundle size optimization

### Phase 9: Features Adicionais
- [ ] Pagination em listas
- [ ] Search avançado
- [ ] Filtros salvos
- [ ] Favoritos de profissionais
- [ ] Avaliações e reviews
- [ ] Notificações em tempo real

---

## ✨ 10. Conclusão

✅ **Frontend completamente integrado com backend**  
✅ **Segurança implementada em camadas**  
✅ **Componentes públicos e privados separados**  
✅ **Error handling robusto**  
✅ **Pronto para testes e validação**  

🎯 **Próximo passo:** Executar testes e documentar descobertas

---

**Documentação gerada em:** 18 de Maio de 2026  
**Status:** 🟢 Ready for QA  
**Owner:** Frontend Team  
**Reviewer:** Tech Lead
