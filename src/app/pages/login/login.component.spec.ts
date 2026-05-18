import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '../../services/auth.service';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['login', 'getRole']);
    const navSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent, HttpClientTestingModule, RouterTestingModule],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: navSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show error if email or password are empty', () => {
    component.email = '';
    component.password = '';
    component.onSubmit();
    expect(component.errorMessage).toBe('Por favor, preencha todos os campos!');
    expect(authServiceSpy.login).not.toHaveBeenCalled();
  });

  it('should call authService.login on submit with valid credentials', () => {
    authServiceSpy.login.and.returnValue(of({ token: 'mock-token' }));
    authServiceSpy.getRole.and.returnValue('CLIENTE');
    
    component.email = 'test@test.com';
    component.password = 'password123';
    component.onSubmit();
    
    expect(authServiceSpy.login).toHaveBeenCalledWith('test@test.com', 'password123');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/explorar']);
  });

  it('should show error message on login failure', () => {
    authServiceSpy.login.and.returnValue(throwError(() => new Error('Login failed')));
    
    component.email = 'wrong@test.com';
    component.password = 'wrong123';
    component.onSubmit();
    
    expect(authServiceSpy.login).toHaveBeenCalled();
    expect(component.errorMessage).toBe('Email ou senha incorretos. Tente novamente.');
    expect(component.isLoading).toBeFalse();
  });
});
