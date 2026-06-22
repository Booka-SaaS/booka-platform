# Checklist do Professor

Este documento consolida os 10 itens solicitados para a entrega academica do Booka e aponta a evidencia no monorepo.

## Resumo

| Item | Status | Evidencia principal |
| --- | --- | --- |
| 1. Web API com 2 frameworks diferentes | Implementado | Express na core API/gateway e NestJS no notification-service |
| 2. Web Service SOAP e REST | Implementado | REST em `/api/*` e `/notifications/*`; SOAP em `/soap/notifications` |
| 3. Microsservicos com comunicacao entre eles | Implementado | Core API publica eventos no RabbitMQ; notification-service consome `booking.created` |
| 4. API Gateway | Implementado | Gateway Express em `backend/services/api-gateway/server.ts` |
| 5. Autorizacao e autenticacao | Implementado | JWT Bearer, roles, guards/middlewares, login tradicional e login Google |
| 6. Testes unitarios | Implementado | Jest no backend; Karma/Jasmine no frontend; testes Android/JUnit no mobile |
| 7. Testes de integracao | Implementado para o MVP | Jest integration no backend e Cypress/E2E no frontend/mobile |
| 8. Automacao de testes | Implementado | Workflows em `backend/.github/workflows/ci.yml` e `frontend/.github/workflows/ci.yml` |
| 9. Seguranca/aplicacao web e mobile | Implementado | Helmet, rate limit, CORS, JWT, RBAC, Zod, DOMPurify, interceptor JWT e mobile Capacitor |
| 10. Arquitetura e design de microsservicos | Implementado | Gateway + core API + notification-service + RabbitMQ + PostgreSQL/Prisma |

## 1. Web API com 2 frameworks diferentes

O projeto usa frameworks diferentes no backend:

- Express + TypeScript: core API em `backend/src/app.ts`.
- Express + TypeScript: API Gateway em `backend/services/api-gateway/server.ts`.
- NestJS: notification service em `backend/services/notification-service/src`.

O requisito de dois frameworks e atendido por Express e NestJS.

## 2. Web Service SOAP e REST

REST:

- Core API via gateway: `http://localhost:3000/api/*`.
- Notificacoes REST: `GET /notifications`, `GET /notifications/unread-count`, `PATCH /notifications/:id/read`.
- Swagger/OpenAPI da core API: `backend/src/docs/openapi.ts`.

SOAP:

- Endpoint SOAP: `POST /soap/notifications`.
- WSDL: `GET /soap/notifications?wsdl`.
- Implementacao: `backend/services/notification-service/src/soap.controller.ts`.

## 3. Microsservicos com comunicacao entre eles

Servicos:

- `core-api`: API principal Express.
- `api-gateway`: entrada unica para frontend/web/mobile.
- `notification-service`: microservico NestJS de notificacoes.

Comunicacao:

- Core API publica evento `BOOKING_CREATED`.
- RabbitMQ usa exchange `booka.events`, routing key `booking.created` e queue `notification.booking.created`.
- Notification service consome o evento e cria a notificacao.

Arquivos principais:

- `backend/src/lib/events.ts`
- `backend/services/notification-service/src/events.consumer.ts`
- `backend/docker-compose.yml`

## 4. API Gateway

Implementado em:

- `backend/services/api-gateway/server.ts`

Responsabilidades:

- Entrada central em `http://localhost:3000`.
- Proxy para core API em `/api/*`.
- Proxy para notification service em `/api/notifications/*`.
- Proxy para SOAP em `/soap/notifications`.
- `x-request-id` para rastreabilidade.

## 5. Autorizacao e autenticacao

Implementado:

- Cadastro e login por email/senha.
- Login com Google via `POST /auth/google`.
- JWT Bearer.
- Middleware de autenticacao.
- Middleware de role/RBAC.
- Recuperacao e redefinicao de senha.

Arquivos principais:

- `backend/src/modules/auth/auth.controller.ts`
- `backend/src/modules/auth/auth.service.ts`
- `backend/src/middleware/auth.ts`
- `backend/src/middleware/role.ts`
- `frontend/src/app/interceptors/auth.interceptor.ts`
- `frontend/src/app/guards/auth.guard.ts`

## 6. Testes unitarios

Backend:

- Jest configurado em `backend/jest.config.cjs`.
- Testes em `backend/tests/unit`.

Frontend:

- Karma/Jasmine configurado no Angular.
- Script: `npm run test:ci` em `frontend/package.json`.
- Specs em `frontend/src/**/*.spec.ts`.

Mobile:

- Testes Angular/Ionic e Android/JUnit.
- Exemplos em `mobile/android/app/src/test` e `mobile/android/app/src/androidTest`.

## 7. Testes de integracao

Backend:

- Configuracao: `backend/jest.integration.config.cjs`.
- Script: `npm run test:integration`.
- Teste principal: `backend/tests/integration/booking-notification-flow.integration.spec.ts`.

Frontend/mobile:

- Cypress configurado.
- Scripts: `cypress:run`, `e2e`, `e2e:ci`.

## 8. Automacao de testes

Workflows:

- `backend/.github/workflows/ci.yml`.
- `frontend/.github/workflows/ci.yml`.

Automacoes previstas:

- Instalar dependencias.
- Rodar build.
- Rodar testes unitarios.
- Rodar testes de integracao quando aplicavel.

## 9. Seguranca web e mobile

Backend/gateway:

- `helmet`.
- `express-rate-limit`.
- CORS por variaveis de ambiente.
- JWT Bearer.
- RBAC por roles.
- Validacao de contratos com Zod.
- Hash de senha com bcrypt.

Frontend/mobile:

- Interceptor JWT.
- Guards de rota.
- Sanitizacao com DOMPurify.
- Aplicacao mobile com Ionic/Capacitor reaproveitando a mesma API.

## 10. Arquitetura e design de microsservicos

Arquitetura resumida:

```text
frontend Angular / mobile Ionic
        |
        v
api-gateway Express
        |
        |----> core-api Express + Prisma + PostgreSQL
        |
        |----> notification-service NestJS
                    ^
                    |
              RabbitMQ booking.created
```

## Como demonstrar

1. Subir backend completo com Docker Compose:

```bash
cd backend
docker compose up
```

2. Subir frontend:

```bash
cd frontend
npm start
```

3. Criar um agendamento publico no marketplace.
4. Confirmar a publicacao do evento `booking.created`.
5. Abrir notificacoes do profissional pelo frontend.
6. Consultar REST de notificacoes via gateway.
7. Consultar SOAP `GetNotificationSummary`.
8. Rodar testes:

```bash
cd backend
npm run test
npm run test:integration
```

```bash
cd frontend
npm run test:ci
npm run cypress:run
```
