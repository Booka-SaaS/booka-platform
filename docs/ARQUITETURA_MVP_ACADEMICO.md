# Booka - MVP Academico de Arquitetura

Este documento descreve a entrega academica dos 10 elementos solicitados no projeto Booka.

## Arquitetura

```text
booka-frontend (Angular, porta 4200)
        |
        | REST /api/*
        v
services/api-gateway (Express proxy, porta 3000)
        |------------------------------|
        |                              |
        v                              v
src/core-api (Express, porta 3001)     services/notification-service (NestJS, porta 3002)
        |                              | REST /notifications/*
        | booking.created              | SOAP /soap/notifications
        v                              |
RabbitMQ exchange booka.events --------|
        |
        v
PostgreSQL / Prisma
```

## Frameworks Web

- Core API: Express + TypeScript em `src/app.ts`.
- API Gateway: Express + TypeScript em `services/api-gateway/server.ts`.
- Notification Service: NestJS em `services/notification-service/src`.

## REST

Entrada publica via gateway:

- `GET http://localhost:3000/health`
- `http://localhost:3000/api/auth/*`
- `http://localhost:3000/api/agendamentos/*`
- `http://localhost:3000/api/profissionais/*`
- `http://localhost:3000/api/servicos/*`
- `http://localhost:3000/api/clientes/*`
- `http://localhost:3000/api/loja/*`
- `http://localhost:3000/api/dashboard/*`
- `http://localhost:3000/api/bloqueios/*`
- `http://localhost:3000/api/disponibilidade/*`
- `http://localhost:3000/api/upload/*`
- `http://localhost:3000/api/notifications/*`

Notification REST:

- `GET /notifications`
- `GET /notifications/unread-count`
- `PATCH /notifications/:id/read`

As rotas REST de notificacao exigem `Authorization: Bearer <jwt>`.

## SOAP

Endpoint publico via gateway:

- `GET http://localhost:3000/soap/notifications?wsdl`
- `POST http://localhost:3000/soap/notifications`

Operacao:

```text
GetNotificationSummary(token) -> { total, unread }
```

Exemplo de body:

```xml
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <GetNotificationSummaryRequest>
      <token>JWT_AQUI</token>
    </GetNotificationSummaryRequest>
  </soap:Body>
</soap:Envelope>
```

## Microsservicos e RabbitMQ

Evento publicado pelo core API ao criar agendamento publico:

```json
{
  "type": "BOOKING_CREATED",
  "eventoId": "booking.created.<agendamentoId>",
  "agendamentoId": "<uuid>",
  "profissionalUserId": "<uuid>",
  "lojaId": "<uuid>",
  "clienteNome": "Maria",
  "servicoNome": "Corte",
  "inicio": "2026-06-10T13:00:00.000Z",
  "createdAt": "2026-06-09T12:00:00.000Z"
}
```

RabbitMQ:

- Exchange: `booka.events`
- Routing key: `booking.created`
- Queue: `notification.booking.created`

O `notification-service` consome o evento e cria `Notificacao` com `eventoId` unico para idempotencia.

## Seguranca Web e Mobile-ready

Backend/gateway:

- `helmet`
- `express-rate-limit`
- CORS centralizado por variavel de ambiente
- JWT Bearer nas rotas privadas
- RBAC por role no core API
- Validacao Zod nos contratos do core API
- `x-request-id` no gateway

Frontend:

- Base URL em `http://localhost:3000/api`
- Interceptor JWT mantido
- Sanitizacao de payloads com `DOMPurify`
- API REST pronta para consumo web ou mobile

Auditoria:

- Backend: `npm audit` retornou `0 vulnerabilities`.
- Frontend runtime: `npm audit --omit=dev` retornou `0 vulnerabilities`.
- Frontend full audit ainda aponta 10 vulnerabilidades em dependencias de desenvolvimento do Angular CLI/build toolchain; a correcao completa exige upgrade major/forcado, portanto ficou documentada para nao quebrar o MVP.

## Docker Compose

`docker compose up` no backend sobe:

- `postgres` em `5434`
- `rabbitmq` em `5672` e management em `15672`
- `core-api` em `3001`
- `api-gateway` em `3000`
- `notification-service` em `3002`

## Testes e CI

Backend:

```bash
npm run build
npm run test
npm run test:integration
```

Frontend:

```bash
npm run build
npm run test:ci
npm run cypress:run
```

CI:

- Backend: `.github/workflows/ci.yml`
- Frontend: `.github/workflows/ci.yml`
- Branches: `dev`, `main`, `master`

## Teste Demonstravel Principal

1. Subir arquitetura:

```bash
cd BookaBackendV2
docker compose up
```

2. Subir frontend:

```bash
cd booka-frontend
npm start
```

3. Criar agendamento publico via marketplace.
4. Validar evento `booking.created` no RabbitMQ.
5. Entrar como profissional e abrir `/notificacoes`.
6. Confirmar notificacao criada.
7. Marcar notificacao como lida.
8. Chamar SOAP `GetNotificationSummary` com JWT e validar `total` e `unread`.

## Checklist dos 10 Itens

| Item | Status | Evidencia |
|---|---|---|
| 1. Web API com 2 frameworks | Implementado | Express core/gateway + NestJS notification-service |
| 2. Web Service SOAP e REST | Implementado | REST `/api/*` e SOAP `/soap/notifications` |
| 3. Microsservicos com comunicacao | Implementado | Core API publica RabbitMQ, notification-service consome |
| 4. API Gateway | Implementado | `services/api-gateway` |
| 5. Autorizacao e autenticacao | Implementado | JWT Bearer + roles |
| 6. Testes unitarios | Implementado | Jest backend, Karma/Jasmine frontend |
| 7. Testes de integracao | Parcial/implementado para MVP | `npm run test:integration` valida contrato booking -> notification; CI possui Postgres/RabbitMQ |
| 8. Automacao de testes | Implementado | GitHub Actions nos dois repos |
| 9. Seguranca web/mobile-ready | Implementado | Helmet, rate limit, CORS, JWT, DOMPurify, audit runtime zerado |
| 10. Arquitetura/design de microsservicos | Implementado | Gateway + core-api + NestJS notification-service + RabbitMQ |
