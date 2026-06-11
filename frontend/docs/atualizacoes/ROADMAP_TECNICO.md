# 🏗️ ROADMAP TÉCNICO DETALHADO - BOOKA PROJECT

## FASE 1: FOUNDATION (2 Semanas) - Consolidação

### 1.1 Testes Unitários - Frontend Angular

**Objetivo:** Cobertura de 80% nos serviços críticos

**Arquivos a implementar:**

```typescript
// src/app/services/auth.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should login and store token', () => {
    const mockResponse = { token: 'fake-jwt-token', usuario: { role: 'CLIENTE' } };
    service.login('test@test.com', '123456').subscribe(response => {
      expect(localStorage.getItem('token')).toBe('fake-jwt-token');
      expect(localStorage.getItem('role')).toBe('CLIENTE');
    });
    
    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should logout and clear storage', () => {
    localStorage.setItem('token', 'test-token');
    service.logout();
    expect(localStorage.getItem('token')).toBeNull();
  });

  it('should return isLoggedIn status', () => {
    localStorage.setItem('token', 'test-token');
    expect(service.isLoggedIn()).toBe(true);
    localStorage.removeItem('token');
    expect(service.isLoggedIn()).toBe(false);
  });
});
```

**Serviços a testar:**
- [ ] `AuthService` - Login, Register, Logout
- [ ] `ClienteService` - CRUD
- [ ] `AgendamentoService` - Booking operations
- [ ] `ServicoService` - Service CRUD
- [ ] `LojaService` - Store operations
- [ ] `Guards/AuthGuard` - Route protection
- [ ] `Interceptors/AuthInterceptor` - Header injection

**Comando para rodar testes:**
```bash
npm test  # Abre Karma com watch mode
npm run test:coverage  # Gera relatório de cobertura
```

---

### 1.2 Segurança - Implementação Imediata

#### A) Content Security Policy (CSP)

**Arquivo:** `src/index.html` (add meta tag)
```html
<meta http-equiv="Content-Security-Policy" 
  content="default-src 'self'; 
    script-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' data: https:;
    font-src 'self' https://fonts.gstatic.com;
    connect-src 'self' http://localhost:3000;">
```

#### B) Backend Security Headers (Backend)

```typescript
// backend/middleware/security.ts (Node.js + Express)
import helmet from 'helmet';
import cors from 'cors';

app.use(helmet()); // Adiciona headers de segurança
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  optionsSuccessStatus: 200
}));

// Rate limiting
import rateLimit from 'express-rate-limit';
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // Limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

#### C) Input Sanitization (Frontend)

```bash
npm install dompurify
npm install --save-dev @types/dompurify
```

```typescript
// src/app/interceptors/sanitize.interceptor.ts
import { Injectable } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import DOMPurify from 'dompurify';

export const sanitizeInterceptor: HttpInterceptorFn = (req, next) => {
  // Sanitizar query params e body se necessário
  if (req.method === 'POST' || req.method === 'PUT') {
    const sanitizedBody = DOMPurify.sanitize(JSON.stringify(req.body));
    req = req.clone({ body: JSON.parse(sanitizedBody) });
  }
  return next(req);
};
```

---

### 1.3 Refresh Token Logic

**Arquivo:** `src/app/services/auth.service.ts`

```typescript
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;
  private TOKEN_KEY = 'access_token';
  private REFRESH_KEY = 'refresh_token';
  private TOKEN_EXPIRY = 'token_expiry';

  login(email: string, senha: string) {
    return this.http.post<TokenResponse>(`${this.apiUrl}/auth/login`, { email, senha })
      .pipe(
        tap(response => this.storeTokens(response)),
        catchError(err => {
          this.handleError(err);
          return throwError(() => err);
        })
      );
  }

  private storeTokens(response: TokenResponse) {
    localStorage.setItem(this.TOKEN_KEY, response.accessToken);
    localStorage.setItem(this.REFRESH_KEY, response.refreshToken);
    
    // Calcular expiração (JWT has exp claim)
    const tokenDecoded = this.decodeToken(response.accessToken);
    if (tokenDecoded?.exp) {
      localStorage.setItem(this.TOKEN_EXPIRY, tokenDecoded.exp.toString());
    }
  }

  refreshToken(): Observable<TokenResponse> {
    const refreshToken = localStorage.getItem(this.REFRESH_KEY);
    return this.http.post<TokenResponse>(
      `${this.apiUrl}/auth/refresh`,
      { refreshToken }
    ).pipe(
      tap(response => this.storeTokens(response))
    );
  }

  private decodeToken(token: string): any {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch {
      return null;
    }
  }

  isTokenExpired(): boolean {
    const expiry = localStorage.getItem(this.TOKEN_EXPIRY);
    if (!expiry) return true;
    return new Date().getTime() > parseInt(expiry) * 1000;
  }
}
```

**Interceptor atualizado:**
```typescript
// src/app/interceptors/auth.interceptor.ts
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = localStorage.getItem('access_token');

  if (token && authService.isTokenExpired()) {
    return authService.refreshToken().pipe(
      switchMap(() => {
        const newToken = localStorage.getItem('access_token');
        req = req.clone({
          setHeaders: { Authorization: `Bearer ${newToken}` }
        });
        return next(req);
      }),
      catchError(() => {
        authService.logout();
        return throwError(() => new Error('Session expired'));
      })
    );
  }

  if (token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }

  return next(req);
};
```

---

## FASE 2: ARCHITECTURE (3 Semanas) - Microsserviços

### 2.1 Refatoração Backend em Microsserviços

**Estrutura proposta:**

```
booka-backend/
├── docker-compose.yml
├── api-gateway/
│   ├── src/
│   ├── package.json
│   └── Dockerfile
├── auth-service/
│   ├── src/
│   ├── package.json
│   └── Dockerfile
├── booking-service/
│   ├── src/
│   ├── package.json
│   └── Dockerfile
├── user-service/
│   ├── src/
│   ├── package.json
│   └── Dockerfile
├── store-service/
│   ├── src/
│   ├── package.json
│   └── Dockerfile
└── shared/
    ├── types.ts
    ├── decorators/
    └── utils/
```

### 2.2 API Gateway (Kong ou Express Gateway)

**Installation:**
```bash
npm install express-gateway
```

**Configuração (api-gateway/gateway.config.yml):**
```yaml
http:
  port: 3000

apiEndpoints:
  auth:
    host: '*'
    paths: '/api/auth/*'
  users:
    host: '*'
    paths: '/api/users/*'
  bookings:
    host: '*'
    paths: '/api/bookings/*'
  stores:
    host: '*'
    paths: '/api/stores/*'
  services:
    host: '*'
    paths: '/api/services/*'

serviceEndpoints:
  authService:
    url: 'http://auth-service:3001'
  userService:
    url: 'http://user-service:3002'
  bookingService:
    url: 'http://booking-service:3003'
  storeService:
    url: 'http://store-service:3004'
  serviceService:
    url: 'http://service-service:3005'

policies:
  - basic-auth
  - cors
  - expression
  - key-auth
  - log
  - oauth2
  - proxy
  - rate-limit
  - request-transformer
  - response-transformer

pipelines:
  authPipeline:
    apiEndpoints:
      - auth
    policies:
      - cors:
      - log:
      - rate-limit:
      - proxy:
          - action:
              serviceEndpoint: authService
              changeOrigin: true

  usersPipeline:
    apiEndpoints:
      - users
    policies:
      - cors:
      - log:
      - key-auth:
      - proxy:
          - action:
              serviceEndpoint: userService
              changeOrigin: true

  # ... demais pipelines
```

### 2.3 Message Broker (RabbitMQ)

**docker-compose.yml adiciona:**
```yaml
rabbitmq:
  image: rabbitmq:3-management
  ports:
    - "5672:5672"
    - "15672:15672"
  environment:
    RABBITMQ_DEFAULT_USER: guest
    RABBITMQ_DEFAULT_PASS: guest
  volumes:
    - rabbitmq_data:/var/lib/rabbitmq
```

**Exemplo de publicador (booking-service):**
```typescript
import amqp from 'amqplib';

class BookingService {
  private channel: amqp.Channel;

  async publishBookingCreated(bookingId: string) {
    await this.channel.assertExchange('booking_events', 'fanout', { durable: true });
    this.channel.publish(
      'booking_events',
      '',
      Buffer.from(JSON.stringify({ 
        event: 'BOOKING_CREATED', 
        bookingId,
        timestamp: new Date()
      }))
    );
  }
}
```

**Exemplo de subscriber (notification-service):**
```typescript
async subscribeToEvents() {
  await this.channel.assertExchange('booking_events', 'fanout', { durable: true });
  const queue = await this.channel.assertQueue('', { exclusive: true });
  await this.channel.bindQueue(queue.queue, 'booking_events', '');

  this.channel.consume(queue.queue, (msg) => {
    if (msg) {
      const content = JSON.parse(msg.content.toString());
      this.handleBookingEvent(content);
      this.channel.ack(msg);
    }
  });
}
```

---

## FASE 3: DEPLOYMENT (2 Semanas)

### 3.1 Docker & Docker Compose

**Dockerfile (exemplo para cada serviço):**
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY src ./src
COPY tsconfig.json ./

EXPOSE 3001

CMD ["node", "-r", "ts-node/register", "src/index.ts"]
```

**docker-compose.yml (completo):**
```yaml
version: '3.8'

services:
  # PostgreSQL
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: booka_db
      POSTGRES_USER: booka
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  # RabbitMQ
  rabbitmq:
    image: rabbitmq:3-management
    ports:
      - "5672:5672"
      - "15672:15672"
    environment:
      RABBITMQ_DEFAULT_USER: ${RABBITMQ_USER}
      RABBITMQ_DEFAULT_PASS: ${RABBITMQ_PASS}

  # Redis (caching)
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  # API Gateway
  api-gateway:
    build:
      context: ./api-gateway
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    depends_on:
      - auth-service
      - user-service
      - booking-service

  # Auth Service
  auth-service:
    build:
      context: ./auth-service
      dockerfile: Dockerfile
    environment:
      - PORT=3001
      - DB_URL=postgresql://booka:${DB_PASSWORD}@postgres:5432/booka_db
      - JWT_SECRET=${JWT_SECRET}
      - RABBITMQ_URL=amqp://guest:guest@rabbitmq:5672
    depends_on:
      - postgres
      - rabbitmq

  # User Service
  user-service:
    build:
      context: ./user-service
      dockerfile: Dockerfile
    environment:
      - PORT=3002
      - DB_URL=postgresql://booka:${DB_PASSWORD}@postgres:5432/booka_db

  # Booking Service
  booking-service:
    build:
      context: ./booking-service
      dockerfile: Dockerfile
    environment:
      - PORT=3003
      - DB_URL=postgresql://booka:${DB_PASSWORD}@postgres:5432/booka_db
      - RABBITMQ_URL=amqp://guest:guest@rabbitmq:5672

volumes:
  postgres_data:
```

### 3.2 CI/CD Pipeline (GitHub Actions)

**Arquivo:** `.github/workflows/ci-cd.yml`

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  frontend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        working-directory: ./booka-frontend-1
        run: npm ci
      
      - name: Lint
        working-directory: ./booka-frontend-1
        run: npm run lint
      
      - name: Unit Tests
        working-directory: ./booka-frontend-1
        run: npm run test:coverage
      
      - name: Build
        working-directory: ./booka-frontend-1
        run: npm run build

      - name: E2E Tests
        working-directory: ./booka-frontend-1
        run: npm run e2e

  backend-tests:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: password
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies (API Gateway)
        working-directory: ./booka-backend/api-gateway
        run: npm ci
      
      - name: Unit Tests
        working-directory: ./booka-backend
        run: npm run test
      
      - name: Build
        working-directory: ./booka-backend
        run: npm run build

  deploy:
    runs-on: ubuntu-latest
    needs: [frontend-tests, backend-tests]
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to production
        run: |
          # Add deployment script here
          echo "Deploying to production..."
```

---

## FASE 4: QUALITY & MONITORING (Contínuo)

### 4.1 E2E Tests (Cypress)

```bash
npm install cypress --save-dev
npx cypress init
```

**Exemplo test:** `cypress/e2e/booking.cy.ts`

```typescript
describe('Booking Flow', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200');
  });

  it('should complete a booking', () => {
    // Login
    cy.get('[data-cy=login-email]').type('test@test.com');
    cy.get('[data-cy=login-password]').type('password123');
    cy.get('[data-cy=login-button]').click();

    // Wait for redirect
    cy.url().should('include', '/explorar');

    // Search and select service
    cy.get('[data-cy=search-input]').type('haircut');
    cy.get('[data-cy=service-card]').first().click();

    // Book appointment
    cy.get('[data-cy=calendar]').click();
    cy.get('[data-cy=time-slot]').first().click();
    cy.get('[data-cy=book-button]').click();

    // Verify success
    cy.get('[data-cy=success-message]').should('be.visible');
  });
});
```

### 4.2 Monitoring (Prometheus + Grafana)

**docker-compose.yml adiciona:**
```yaml
prometheus:
  image: prom/prometheus
  ports:
    - "9090:9090"
  volumes:
    - ./prometheus.yml:/etc/prometheus/prometheus.yml
    - prometheus_data:/prometheus

grafana:
  image: grafana/grafana
  ports:
    - "3001:3000"
  environment:
    GF_SECURITY_ADMIN_PASSWORD: admin
  volumes:
    - grafana_data:/var/lib/grafana
```

---

## 📊 TIMELINE ESTIMADA

| Fase | Duração | Deliverables |
|------|---------|--------------|
| **Fase 1** | 2 semanas | Testes, Segurança, Refresh Token |
| **Fase 2** | 3 semanas | Microsserviços, Message Broker, API Gateway |
| **Fase 3** | 2 semanas | Docker, CI/CD Pipeline |
| **Fase 4** | Contínuo | E2E Tests, Monitoring, Otimizações |
| **TOTAL** | ~7-8 semanas | MVP + Infraestrutura |

---

## 🎯 INDICADORES DE SUCESSO

- ✅ Cobertura de testes >80%
- ✅ Build time <5 minutos
- ✅ Deploy automatizado
- ✅ 0 vulnerabilidades no npm audit
- ✅ API Gateway funcionando
- ✅ Microsserviços comunicando via Message Broker
- ✅ Monitoring e alertas ativos

---

**Documento versão:** 1.0  
**Last updated:** 18/05/2026
