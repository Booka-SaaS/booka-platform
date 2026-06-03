import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.Spy;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['login', 'getRole']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent, RouterTestingModule],
      providers: [
        provideHttpClient(),
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    const router = TestBed.inject(Router);
    routerSpy = spyOn(router, 'navigate');

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    
    spyOn(window, 'alert');
    fixture.detectChanges();
  });

  it('deve exibir alert se campos vazios', () => {
    component.email = '';
    component.password = '';
    component.onSubmit();
    
    expect(window.alert).toHaveBeenCalledWith('Por favor, preencha todos os campos!');
    expect(authServiceSpy.login).not.toHaveBeenCalled();
  });

  it('deve redirecionar para dashboard se logar como PROFISSIONAL', async () => {
    component.email = 'teste@teste.com';
    component.password = 'senha123';
    
    authServiceSpy.login.and.returnValue(of({ token: 'abc', user: { id: '1', nome: 'A', email: 'a@a', role: 'PROFISSIONAL' } }));
    authServiceSpy.getRole.and.resolveTo('PROFISSIONAL');

    component.onSubmit();

    // Aguarda microtasks
    await Promise.resolve();

    expect(authServiceSpy.login).toHaveBeenCalledWith('teste@teste.com', 'senha123');
    expect(routerSpy).toHaveBeenCalledWith(['/painel/dashboard']);
  });

  it('deve redirecionar para explorar se logar como CLIENTE', async () => {
    component.email = 'teste@teste.com';
    component.password = 'senha123';
    
    authServiceSpy.login.and.returnValue(of({ token: 'abc', user: { id: '1', nome: 'A', email: 'a@a', role: 'CLIENTE' } }));
    authServiceSpy.getRole.and.resolveTo('CLIENTE');

    component.onSubmit();

    // Aguarda microtasks
    await Promise.resolve();

    expect(routerSpy).toHaveBeenCalledWith(['/explorar']);
  });

  it('deve exibir alert de erro em caso de falha', () => {
    component.email = 'teste@teste.com';
    component.password = 'senha123';
    
    authServiceSpy.login.and.returnValue(throwError(() => new Error('Falha')));

    component.onSubmit();

    expect(window.alert).toHaveBeenCalledWith('Erro ao fazer login. Verifique suas credenciais.');
  });
});
