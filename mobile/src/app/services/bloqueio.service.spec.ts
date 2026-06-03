import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { BloqueioService } from './bloqueio.service';
import { environment } from '../../environments/environment';
import { BloqueioAgenda } from '../models';

describe('BloqueioService', () => {
  let service: BloqueioService;
  let httpMock: HttpTestingController;

  const mockBloqueio: BloqueioAgenda = {
    id: '1',
    lojaId: 'loja1',
    inicio: '2026-06-02T12:00:00Z',
    fim: '2026-06-02T13:00:00Z',
    motivo: 'Almoço',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BloqueioService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(BloqueioService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve listar bloqueios', () => {
    service.listar().subscribe(bloqueios => {
      expect(bloqueios.length).toBe(1);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/bloqueios`);
    expect(req.request.method).toBe('GET');
    req.flush([mockBloqueio]);
  });
});
