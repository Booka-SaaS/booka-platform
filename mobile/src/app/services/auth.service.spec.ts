import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { StorageService } from './storage.service';
import { environment } from '../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let storageSpy: jasmine.SpyObj<StorageService>;

  beforeEach(() => {
    storageSpy = jasmine.createSpyObj('StorageService', ['setItem', 'getItem', 'removeItem', 'clear']);
    storageSpy.getItem.and.callFake(async (key: string) => {
      return key === 'token' ? 'fake-token' : key === 'role' ? 'PROFISSIONAL' : null;
    });

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: StorageService, useValue: storageSpy },
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  it('deve fazer login e persistir tokens', async () => {
    const mockResponse = {
      token: 'new-fake-token',
      user: { id: '1', nome: 'Teste', email: 'teste@teste.com', role: 'CLIENTE' }
    };

    service.login('teste@teste.com', 'senha123').subscribe(res => {
      expect(res.token).toBe('new-fake-token');
      expect(res.user.role).toBe('CLIENTE');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email: 'teste@teste.com', password: 'senha123' });
    req.flush(mockResponse);

    // Esperar microtasks para o switchMap executar o persistAuth assíncrono
    await Promise.resolve();

    expect(storageSpy.setItem).toHaveBeenCalledWith('token', 'new-fake-token');
    expect(storageSpy.setItem).toHaveBeenCalledWith('role', 'CLIENTE');
  });

  it('deve fazer logout e limpar storage', async () => {
    await service.logout();
    expect(storageSpy.removeItem).toHaveBeenCalledWith('token');
    expect(storageSpy.removeItem).toHaveBeenCalledWith('role');
  });

  it('deve verificar isLoggedIn corretamente', async () => {
    expect(await service.isLoggedIn()).toBeTrue();
  });

  it('deve retornar a role corretamente', async () => {
    expect(await service.getRole()).toBe('PROFISSIONAL');
  });

  it('deve atualizar senha corretamente', () => {
    service.updateSenha('senhaVelha', 'senhaNova').subscribe(res => {
      expect(res.message).toBe('Senha atualizada com sucesso');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/senha`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ senhaAtual: 'senhaVelha', novaSenha: 'senhaNova' });
    req.flush({ message: 'Senha atualizada com sucesso' });
  });
});
