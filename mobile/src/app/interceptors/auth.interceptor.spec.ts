import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './auth.interceptor';
import { StorageService } from '../services/storage.service';

describe('authInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  let storageSpy: jasmine.SpyObj<StorageService>;

  beforeEach(() => {
    storageSpy = jasmine.createSpyObj('StorageService', ['getItem']);
    storageSpy.getItem.and.resolveTo('fake-token');

    TestBed.configureTestingModule({
      providers: [
        { provide: StorageService, useValue: storageSpy },
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting()
      ]
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve adicionar o header Authorization', async () => {
    httpClient.get('/api/test').subscribe();

    // Aguarda microtasks do from() no interceptor
    await Promise.resolve();

    const req = httpMock.expectOne('/api/test');
    expect(req.request.headers.has('Authorization')).toBeTrue();
    expect(req.request.headers.get('Authorization')).toBe('Bearer fake-token');
  });

  it('não deve adicionar o header se não tiver token', async () => {
    storageSpy.getItem.and.resolveTo(null);
    httpClient.get('/api/test2').subscribe();

    // Aguarda microtasks do from() no interceptor
    await Promise.resolve();

    const req = httpMock.expectOne('/api/test2');
    expect(req.request.headers.has('Authorization')).toBeFalse();
  });
});
