# Cards do Kanban — Dia do Caos no Booka

## Backlog

### Card 1 — Criar branch de hotfix

**Título:** Criar branch `hotfix/broken-checkout`

**Responsável:** Desenvolvedores

**Descrição:**  
Criar uma branch de hotfix a partir da `main` para corrigir a falha crítica no fluxo de agendamento do Booka.

**Comandos:**

```bash
git checkout main
git pull origin main
git checkout -b hotfix/broken-checkout
git push -u origin hotfix/broken-checkout
```

**Critérios de aceite:**

* Branch criada a partir da `main`.
* Nenhum commit direto na `main`.
* Branch enviada ao repositório remoto.
* Todos os commits da crise feitos apenas na branch `hotfix/broken-checkout`.

---

### Card 2 — Isolar erro no fluxo de agendamento

**Título:** Isolar erro na rota de agendamento

**Responsável:** Backend

**Descrição:**
Investigar a falha que impede parte dos usuários de criar agendamentos após o deploy.

**Verificar:**

* rota de criação de agendamento;
* validação de horário;
* relacionamento entre cliente e prestador;
* regras de disponibilidade;
* logs do backend;
* retorno da API;
* arquivos responsáveis pelo agendamento.

**Critérios de aceite:**

* Causa provável identificada.
* Arquivo ou trecho de código ofensivo localizado.
* Evidência registrada no Pull Request ou Postmortem.

---

### Card 3 — Otimizar consulta do banco de dados

**Título:** Otimizar consulta de disponibilidade

**Responsável:** Banco de Dados / Backend

**Descrição:**
Analisar a consulta responsável por retornar horários disponíveis no Booka, buscando reduzir lentidão e gargalos.

**Verificar:**

* consultas Prisma;
* filtros por prestador;
* busca de agendamentos existentes;
* consultas repetidas;
* necessidade de índice;
* impacto no tempo de resposta.

**Critérios de aceite:**

* Consulta revisada.
* Melhoria aplicada ou justificativa técnica registrada.
* Fluxo de disponibilidade validado.

---

### Card 4 — Aplicar Pair Programming

**Título:** Pair Programming no hotfix

**Responsável:** Dois desenvolvedores

**Descrição:**
Executar a correção principal utilizando programação em pares.

**Papéis:**

* Piloto: desenvolvedor que codifica a solução.
* Navegador: desenvolvedor que valida segurança, lógica técnica e boas práticas.

**Critérios de aceite:**

* Dupla definida.
* Correção feita com acompanhamento.
* Aprendizados registrados na retrospectiva.

---

### Card 5 — Simular Merge Conflict

**Título:** Simular Merge Conflict em arquivo de configuração

**Responsável:** Dois desenvolvedores

**Descrição:**
Dois desenvolvedores devem alterar propositalmente o mesmo arquivo de configuração em branches locais diferentes e tentar integrar as alterações.

**Arquivos possíveis:**

* `README.md`
* `backend/.env.example`
* `backend/prisma/schema.prisma`
* `backend/src/config/database.ts`

**Critérios de aceite:**

* Conflito gerado.
* Conflito resolvido colaborativamente.
* Nenhuma credencial sensível exposta.
* Arquivo final validado pela equipe.

---

### Card 6 — Revisar segurança das credenciais

**Título:** Garantir que nenhuma credencial sensível foi exposta

**Responsável:** Banco de Dados / Segurança

**Descrição:**
Revisar os arquivos alterados para garantir que nenhuma informação sensível foi commitada.

**Não podem aparecer no código:**

* `DATABASE_URL` real;
* `DIRECT_URL` real;
* `JWT_SECRET` real;
* `SUPABASE_SERVICE_ROLE_KEY` real;
* tokens privados;
* senhas reais;
* chaves de API reais;
* credenciais de produção.

**Critérios de aceite:**

* Apenas variáveis de exemplo mantidas.
* Arquivos `.env` reais não versionados.
* Nenhum segredo exposto no Pull Request.

---

### Card 7 — Abrir Pull Request

**Título:** Abrir PR da branch `hotfix/broken-checkout` para `main`

**Responsável:** Desenvolvedores

**Descrição:**
Abrir um Pull Request contendo a correção da crise simulada.

**O PR deve conter:**

* resumo do problema;
* causa identificada;
* arquivos alterados;
* solução aplicada;
* testes realizados;
* confirmação de que não houve exposição de credenciais.

**Critérios de aceite:**

* Pull Request aberto.
* Outro integrante realizou revisão cruzada.
* Ajustes solicitados foram resolvidos.
* Product Owner aprovou a integração.

---

### Card 8 — Executar validação técnica

**Título:** Validar build, testes e fluxo principal

**Responsável:** Toda a equipe

**Descrição:**
Executar validações técnicas antes da integração do hotfix.

**Backend:**

```bash
cd backend
npm install
npm run build
npx prisma generate
```

**Frontend:**

```bash
cd frontend
npm install
npm run build
```

**Testes funcionais:**

* login;
* cadastro;
* consulta de disponibilidade;
* criação de agendamento;
* cancelamento de agendamento;
* validação de mensagens de erro.

**Critérios de aceite:**

* Build do backend executado ou erro documentado.
* Build do frontend executado ou erro documentado.
* Fluxo principal validado.
* Nenhum erro crítico restante.

---

### Card 9 — Criar Postmortem

**Título:** Documentar Postmortem da crise

**Responsável:** Product Owner / Scrum Master

**Descrição:**
Criar documentação rápida explicando o incidente.

**O Postmortem deve conter:**

* resumo do incidente;
* impacto;
* causa raiz;
* correção aplicada;
* ações preventivas;
* responsáveis;
* aprendizados.

**Critérios de aceite:**

* Postmortem criado.
* Documento revisado pela equipe.
* Conteúdo incluído na entrega final.

---

### Card 10 — Realizar mini-retrospectiva

**Título:** Realizar mini-retrospectiva de 5 minutos

**Responsável:** Scrum Master

**Descrição:**
Ao final da dinâmica, realizar uma retrospectiva rápida.

**Perguntas:**

* O Kanban foi atualizado corretamente?
* O Gitflow foi respeitado?
* O Pair Programming ajudou?
* O Merge Conflict foi resolvido de forma limpa?
* A comunicação da equipe foi eficiente?
* O que pode ser melhorado em uma próxima crise?

**Critérios de aceite:**

* Retrospectiva realizada.
* Pontos positivos registrados.
* Pontos de melhoria registrados.
