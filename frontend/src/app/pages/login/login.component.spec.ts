import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';
import { of, throwError } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['login', 'getRole']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: AuthService, useValue: authSpy },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
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
    expect(router.navigate).toHaveBeenCalledWith(['/explorar']);
  });

  it('should show error message on login failure', () => {
    spyOn(console, 'error');
    authServiceSpy.login.and.returnValue(throwError(() => new Error('Login failed')));

    component.email = 'wrong@test.com';
    component.password = 'wrong123';
    component.onSubmit();

    expect(authServiceSpy.login).toHaveBeenCalled();
    expect(component.errorMessage).toBe('Email ou senha incorretos. Tente novamente.');
    expect(component.isLoading).toBeFalse();
  });
});
