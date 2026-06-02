import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { CadastroComponent } from './cadastro.component';
import { AuthService } from '../../services/auth.service';

describe('CadastroComponent', () => {
  let component: CadastroComponent;
  let fixture: ComponentFixture<CadastroComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.Spy;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['register']);

    await TestBed.configureTestingModule({
      imports: [CadastroComponent, RouterTestingModule],
      providers: [
        provideHttpClient(),
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    const router = TestBed.inject(Router);
    routerSpy = spyOn(router, 'navigate');

    fixture = TestBed.createComponent(CadastroComponent);
    component = fixture.componentInstance;
    
    spyOn(window, 'alert');
    fixture.detectChanges();
  });

  it('deve validar requisitos de senha', () => {
    component.password = 'fraca';
    expect(component.hasMinLength).toBeFalse();
    expect(component.hasNumber).toBeFalse();
    expect(component.hasSpecialChar).toBeFalse();

    component.password = 'SenhaFort3@';
    expect(component.hasMinLength).toBeTrue();
    expect(component.hasNumber).toBeTrue();
    expect(component.hasSpecialChar).toBeTrue();
  });

  it('deve validar match de senhas', () => {
    component.password = 'SenhaFort3@';
    component.confirmPassword = 'Diferente';
    expect(component.passwordsMatch).toBeFalse();

    component.confirmPassword = 'SenhaFort3@';
    expect(component.passwordsMatch).toBeTrue();
  });

  it('deve exibir alert se campos obrigatórios vazios', () => {
    component.onSubmit();
    expect(window.alert).toHaveBeenCalledWith('Preencha os campos obrigatórios!');
    expect(authServiceSpy.register).not.toHaveBeenCalled();
  });

  it('deve redirecionar PROFISSIONAL para /onboarding após sucesso', () => {
    component.fullName = 'João';
    component.email = 'joao@teste.com';
    component.password = 'Senha123@';
    component.confirmPassword = 'Senha123@';
    component.role = 'PROFISSIONAL';

    authServiceSpy.register.and.returnValue(of({ token: 'abc', user: { id: '1', nome: 'João', email: 'joao@teste.com', role: 'PROFISSIONAL' } }));

    component.onSubmit();

    expect(authServiceSpy.register).toHaveBeenCalledWith('João', 'joao@teste.com', 'Senha123@', 'PROFISSIONAL');
    expect(routerSpy).toHaveBeenCalledWith(['/onboarding']);
  });

  it('deve redirecionar CLIENTE para /explorar após sucesso', () => {
    component.fullName = 'João';
    component.email = 'joao@teste.com';
    component.password = 'Senha123@';
    component.confirmPassword = 'Senha123@';
    component.role = 'CLIENTE';

    authServiceSpy.register.and.returnValue(of({ token: 'abc', user: { id: '1', nome: 'João', email: 'joao@teste.com', role: 'CLIENTE' } }));

    component.onSubmit();

    expect(routerSpy).toHaveBeenCalledWith(['/explorar']);
  });
});
