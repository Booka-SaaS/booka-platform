import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';

describe('authGuard', () => {
  let routerSpy: jasmine.SpyObj<Router>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['isLoggedIn']);

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: AuthService, useValue: authServiceSpy }
      ]
    });
  });

  it('deve retornar true se logado', async () => {
    authServiceSpy.isLoggedIn.and.resolveTo(true);
    
    let result: any;
    TestBed.runInInjectionContext(() => {
      result = authGuard({} as any, {} as any);
    });

    expect(await result).toBeTrue();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('deve retornar false e redirecionar se não logado', async () => {
    authServiceSpy.isLoggedIn.and.resolveTo(false);
    
    let result: any;
    TestBed.runInInjectionContext(() => {
      result = authGuard({} as any, {} as any);
    });

    expect(await result).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });
});
