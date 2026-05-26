# Contexto do Projeto: Booka SaaS (Integração Front-end Angular + Back-end Node.js)

## Visão Geral
O Booka é uma plataforma SaaS B2B para gestão inteligente de agendamentos e administração de estabelecimentos.
A equipe é dividida em: Web Front-end & UI/UX (Luís), Mobile Front-end (Thiago) e Back-end/API (Rubens).

## Stack Tecnológica (Front-end Web)
- **Framework:** Angular 17+ (Standalone Components).
- **Estilização:** Tailwind CSS.
- **Roteamento:** Configurado via `app.routes.ts` (SPA).

## Estado Atual do Front-end (Mockups Concluídos)
A interface de usuário (UI) foi 100% codificada. As telas possuem roteamento, validações locais visuais (ex: força de senha) e estados estáticos. 
**Objetivo Atual:** Substituir os dados estáticos pela integração real com a API.

## Arquitetura da API (Back-end já existente)
O back-end foi construído em Node.js (Express) com banco de dados PostgreSQL. 
A autenticação utiliza JWT (JSON Web Tokens) com senhas criptografadas via bcrypt.

**Documentação Viva:** A API possui Swagger acessível em `/api-docs`.
**Base URL:** O front-end deve apontar para `http://localhost:3000/api` (configurar via `environment.ts`).

### Mapeamento Front-end <-> Endpoints da API

#### 1. Autenticação & Onboarding (JWT via Bearer Token)
- **Front:** `/login` e `/cadastro` -> **API:** `POST /api/auth/login` e `POST /api/auth/register`
- *Nota:* O token recebido no login deve ser salvo no localStorage e um `HttpInterceptor` deve injetá-lo em todas as rotas protegidas.

#### 2. Configurações da Loja & Perfil
- **Front:** `/dados-loja` -> **API:** `GET` / `PUT` / `POST /api/loja` (Gerecia nome, endereço, telefone).
- **Front:** `/perfil` -> **API:** Os dados do usuário vêm vinculados à loja/sessão atual.

#### 3. Gestão de Clientes
- **Front:** `/clientes` -> **API:** `GET`, `POST`, `PUT`, `DELETE /api/clientes`

#### 4. Gestão de Serviços
- **Front:** `/servicos` -> **API:** `GET`, `POST`, `PUT`, `DELETE /api/servicos`

#### 5. Agendamentos
- **Front:** `/agenda` -> **API:** `GET`, `POST`, `PUT`, `DELETE /api/agendamentos`

## Próximos Passos de Desenvolvimento (Instruções para a IA)
1. **Environments:** Criar os arquivos de ambiente (`environment.ts` e `environment.development.ts`) com a `apiUrl`.
2. **Interfaces TypeScript:** Criar os modelos exatos espelhando o `schema.js` do back-end (`Usuario`, `Cliente`, `Servico`, `Agendamento`, `Loja`).
3. **Services:** Criar serviços injetáveis (`AuthService`, `ClienteService`, etc.) utilizando o `HttpClient`.
4. **Segurança:** - Implementar o `auth.interceptor.ts` para anexar o JWT no Header `Authorization: Bearer <token>`.
   - Implementar o `auth.guard.ts` para impedir acesso às rotas do painel sem token válido.
5. **Integração nas Telas:** Conectar as funções dos botões de Salvar/Entrar aos respectivos *Services*, gerenciando estados de carregamento (loading) e exibindo erros amigáveis.