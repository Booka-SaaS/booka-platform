import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService, AuthResponse } from './auth.service';
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
    
    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should store token and role on successful login', () => {
    const mockResponse: AuthResponse = {
      token: 'mock-jwt-token',
      user: {
        id: '1',
        nome: 'Test User',
        email: 'test@example.com',
        role: 'PROFISSIONAL'
      }
    };

    service.login('test@example.com', 'password123').subscribe(response => {
      expect(response).toEqual(mockResponse);
      expect(localStorage.getItem('token')).toBe('mock-jwt-token');
      expect(localStorage.getItem('role')).toBe('PROFISSIONAL');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email: 'test@example.com', password: 'password123' });
    req.flush(mockResponse);
  });

  it('should clear localStorage on logout', () => {
    localStorage.setItem('token', 'mock-token');
    localStorage.setItem('role', 'CLIENTE');
    
    service.logout();
    
    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('role')).toBeNull();
  });

  it('should return isLoggedIn true when token exists', () => {
    localStorage.setItem('token', 'mock-token');
    expect(service.isLoggedIn()).toBeTrue();
  });

  it('should return isLoggedIn false when token does not exist', () => {
    expect(service.isLoggedIn()).toBeFalse();
  });
});
