# 🔧 SNIPPETS DE IMPLEMENTAÇÃO IMEDIATA

## 1. TESTES UNITÁRIOS - COMEÇAR AQUI

### 1.1 AuthService.spec.ts

```typescript
// src/app/services/auth.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

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
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  describe('login', () => {
    it('should send POST request with credentials', () => {
      const mockResponse = {
        token: 'test-jwt-token',
        usuario: { id: 1, email: 'test@test.com', role: 'CLIENTE' }
      };

      service.login('test@test.com', 'password123').subscribe(response => {
        expect(response.token).toBe('test-jwt-token');
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ email: 'test@test.com', senha: 'password123' });
      req.flush(mockResponse);
    });

    it('should store token in localStorage on successful login', () => {
      const mockResponse = {
        token: 'test-jwt-token',
        usuario: { role: 'CLIENTE' }
      };

      service.login('test@test.com', 'password123').subscribe();

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
      req.flush(mockResponse);

      expect(localStorage.getItem('token')).toBe('test-jwt-token');
      expect(localStorage.getItem('role')).toBe('CLIENTE');
    });

    it('should handle login error gracefully', () => {
      service.login('test@test.com', 'wrong-password').subscribe(
        () => fail('should have failed'),
        (error) => {
          expect(error.status).toBe(401);
        }
      );

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
      req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
    });
  });

  describe('register', () => {
    it('should send POST request with user data', () => {
      const mockResponse = {
        token: 'new-jwt-token',
        usuario: { id: 2, email: 'newuser@test.com', role: 'CLIENTE' }
      };

      service.register('New User', 'newuser@test.com', 'password123', 'CLIENTE').subscribe();

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/register`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body.nome).toBe('New User');
      req.flush(mockResponse);
    });

    it('should store token after successful registration', () => {
      const mockResponse = {
        token: 'new-jwt-token',
        usuario: { role: 'PROFISSIONAL' }
      };

      service.register('Pro User', 'pro@test.com', 'password123', 'PROFISSIONAL').subscribe();

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/register`);
      req.flush(mockResponse);

      expect(localStorage.getItem('token')).toBe('new-jwt-token');
      expect(localStorage.getItem('role')).toBe('PROFISSIONAL');
    });
  });

  describe('logout', () => {
    it('should remove token and role from localStorage', () => {
      localStorage.setItem('token', 'test-token');
      localStorage.setItem('role', 'CLIENTE');

      service.logout();

      expect(localStorage.getItem('token')).toBeNull();
      expect(localStorage.getItem('role')).toBeNull();
    });

    it('should set isLoggedIn to false after logout', () => {
      localStorage.setItem('token', 'test-token');
      service.logout();

      expect(service.isLoggedIn()).toBe(false);
    });
  });

  describe('isLoggedIn', () => {
    it('should return true when token exists', () => {
      localStorage.setItem('token', 'valid-token');
      expect(service.isLoggedIn()).toBe(true);
    });

    it('should return false when token does not exist', () => {
      expect(service.isLoggedIn()).toBe(false);
    });

    it('should return false on SSR environment', () => {
      const originalWindow = global.window;
      // @ts-ignore
      delete global.window;

      expect(service.isLoggedIn()).toBe(false);

      global.window = originalWindow;
    });
  });

  describe('loginTeste', () => {
    it('should set test token and role', () => {
      service.loginTeste('PROFISSIONAL');

      expect(localStorage.getItem('token')).toBe('fake-jwt-token-para-teste');
      expect(localStorage.getItem('role')).toBe('PROFISSIONAL');
    });
  });
});
```

### 1.2 AuthGuard.spec.ts

```typescript
// src/app/guards/auth.guard.spec.ts
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';

describe('authGuard', () => {
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(() => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['isLoggedIn']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter }
      ]
    });
  });

  it('should return true when user is logged in', () => {
    mockAuthService.isLoggedIn.and.returnValue(true);

    const result = TestBed.runInInjectionContext(() =>
      authGuard({} as any, {} as any)
    );

    expect(result).toBe(true);
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should navigate to login and return false when user is not logged in', () => {
    mockAuthService.isLoggedIn.and.returnValue(false);

    const result = TestBed.runInInjectionContext(() =>
      authGuard({} as any, {} as any)
    );

    expect(result).toBe(false);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });
});
```

### 1.3 AuthInterceptor.spec.ts

```typescript
// src/app/interceptors/auth.interceptor.spec.ts
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { authInterceptor } from './auth.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

describe('authInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: HTTP_INTERCEPTORS, useValue: authInterceptor, multi: true }
      ]
    });

    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should add Authorization header when token exists', () => {
    const testToken = 'test-jwt-token';
    localStorage.setItem('token', testToken);

    httpClient.get('/api/users').subscribe();

    const req = httpMock.expectOne('/api/users');
    expect(req.request.headers.has('Authorization')).toBe(true);
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${testToken}`);
  });

  it('should not add Authorization header when token does not exist', () => {
    httpClient.get('/api/public').subscribe();

    const req = httpMock.expectOne('/api/public');
    expect(req.request.headers.has('Authorization')).toBe(false);
  });
});
```

---

## 2. SEGURANÇA - IMPLEMENTAÇÕES

### 2.1 Atualizar index.html com CSP

**Arquivo:** `src/index.html`

```html
<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <title>Booka - Agendamentos</title>
  <base href="/">

  <!-- Content Security Policy -->
  <meta http-equiv="Content-Security-Policy"
    content="default-src 'self';
      script-src 'self' 'unsafe-inline' 'unsafe-eval' https://fonts.googleapis.com https://cdn.jsdelivr.net;
      style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
      img-src 'self' data: https: blob:;
      font-src 'self' https://fonts.gstatic.com data:;
      connect-src 'self' http://localhost:3000 http://localhost:3001 ws://localhost:*;
      media-src 'self';
      frame-src 'self';
      object-src 'none';
      base-uri 'self';
      form-action 'self';">

  <!-- X-UA-Compatible -->
  <meta http-equiv="X-UA-Compatible" content="IE=edge">

  <!-- Viewport -->
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <!-- Disable IE -->
  <meta http-equiv="ie=edge">

  <link rel="icon" type="image/x-icon" href="favicon.ico">
</head>
<body class="m-0">
  <app-root></app-root>
</body>
</html>
```

### 2.2 Novo Interceptor para Sanitização

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
  // Sanitizar body se POST/PUT
  if ((req.method === 'POST' || req.method === 'PUT') && req.body) {
    try {
      const sanitizedBody = sanitizeObject(req.body);
      req = req.clone({ body: sanitizedBody });
    } catch (error) {
      console.error('Error sanitizing request body', error);
    }
  }

  return next(req);
};

function sanitizeObject(obj: any): any {
  if (typeof obj === 'string') {
    return DOMPurify.sanitize(obj);
  }

  if (typeof obj === 'object' && obj !== null) {
    if (Array.isArray(obj)) {
      return obj.map(item => sanitizeObject(item));
    }

    return Object.keys(obj).reduce((acc, key) => {
      acc[key] = sanitizeObject(obj[key]);
      return acc;
    }, {} as any);
  }

  return obj;
}
```

### 2.3 Validação de Entrada em Serviço

```typescript
// src/app/services/validators.ts
import { AbstractControl, ValidationErrors, ValidatorFn, AsyncValidatorFn } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import DOMPurify from 'dompurify';

export class CustomValidators {
  // Validar email
  static email(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;

      const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
      return emailRegex.test(control.value) ? null : { invalidEmail: true };
    };
  }

  // Validar força de senha
  static passwordStrength(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;

      const value = control.value;
      const hasUppercase = /[A-Z]/.test(value);
      const hasLowercase = /[a-z]/.test(value);
      const hasNumeric = /[0-9]/.test(value);
      const hasSpecial = /[!@#$%^&*]/.test(value);
      const isLengthValid = value.length >= 8;

      const isStrong = hasUppercase && hasLowercase && hasNumeric && hasSpecial && isLengthValid;

      return isStrong ? null : { weakPassword: true };
    };
  }

  // Validar sanitização
  static sanitize(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;

      const original = control.value;
      const sanitized = DOMPurify.sanitize(original);

      // Se após sanitizar o valor mudou, há conteúdo malicioso
      return original === sanitized ? null : { unsafeContent: true };
    };
  }

  // Validar comprimento máximo
  static maxLength(max: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      return control.value.length <= max ? null : { maxLength: { max } };
    };
  }

  // Validator assíncrono para verificar email disponível
  static emailAvailable(authService: any): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) return of(null);

      return authService.checkEmailAvailable(control.value).pipe(
        map(available => available ? null : { emailTaken: true }),
        catchError(() => of(null))
      );
    };
  }
}
```

---

## 3. CONFIGURAÇÃO DO PACKAGE.JSON

### 3.1 Adicionar scripts de teste e segurança

```json
{
  "scripts": {
    "ng": "ng",
    "start": "ng serve",
    "build": "ng build",
    "watch": "ng build --watch --configuration development",
    "test": "ng test",
    "test:coverage": "ng test --no-watch --code-coverage",
    "test:headless": "ng test --watch=false --browsers=ChromeHeadless",
    "lint": "eslint src/**/*.ts",
    "audit": "npm audit --production",
    "audit:fix": "npm audit fix",
    "e2e": "cypress run",
    "e2e:open": "cypress open",
    "build:prod": "ng build --configuration production",
    "serve:ssr:booka-frontend": "node dist/booka-frontend/server/server.mjs"
  },
  "devDependencies": {
    "@angular-devkit/build-angular": "^19.2.22",
    "@angular/cli": "^19.2.22",
    "@angular/compiler-cli": "^19.2.0",
    "@types/express": "^4.17.17",
    "@types/jasmine": "~5.1.0",
    "@types/node": "^18.18.0",
    "autoprefixer": "^10.4.27",
    "cypress": "^13.0.0",
    "dompurify": "^3.0.0",
    "@types/dompurify": "^3.0.0",
    "eslint": "^8.0.0",
    "jasmine-core": "~5.6.0",
    "karma": "~6.4.0",
    "karma-chrome-launcher": "~3.2.0",
    "karma-coverage": "~2.2.0",
    "karma-jasmine": "~5.1.0",
    "karma-jasmine-html-reporter": "~2.1.0",
    "postcss": "^8.5.8",
    "tailwindcss": "^3.4.19",
    "typescript": "~5.7.2"
  }
}
```

---

## 4. ENVIRONMENT VARIABLES

### 4.1 environment.ts

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  logLevel: 'debug',
  jwt: {
    accessTokenExpiry: 15 * 60 * 1000, // 15 minutos
    refreshTokenExpiry: 7 * 24 * 60 * 60 * 1000, // 7 dias
  },
  security: {
    enableCSP: true,
    enableHTTPS: false,
    secureCookies: false
  }
};
```

### 4.2 environment.production.ts

```typescript
// src/environments/environment.production.ts
export const environment = {
  production: true,
  apiUrl: 'https://api.booka.com',
  logLevel: 'error',
  jwt: {
    accessTokenExpiry: 15 * 60 * 1000,
    refreshTokenExpiry: 7 * 24 * 60 * 60 * 1000,
  },
  security: {
    enableCSP: true,
    enableHTTPS: true,
    secureCookies: true
  }
};
```

---

## 5. CHECKLIST DE IMPLEMENTAÇÃO

### Semana 1:
- [ ] Implementar `auth.service.spec.ts`
- [ ] Implementar `auth.guard.spec.ts`
- [ ] Implementar `auth.interceptor.spec.ts`
- [ ] Adicionar `sanitize.interceptor.ts`
- [ ] Adicionar validators.ts
- [ ] Atualizar `index.html` com CSP
- [ ] npm install dompurify

### Semana 2:
- [ ] Implementar testes para ClienteService
- [ ] Implementar testes para AgendamentoService
- [ ] Implementar testes para ServicoService
- [ ] Adicionar `PermissionGuard`
- [ ] Implementar `Refresh Token` logic
- [ ] Atingir >80% cobertura de testes

### Semana 3+:
- [ ] E2E tests com Cypress
- [ ] Backend: API Gateway
- [ ] Backend: Microsserviços
- [ ] CI/CD Pipeline

---

**Dúvidas ou dificuldades?** Consulte as páginas anteriores para contexto completo.
