import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { LojaService } from './loja.service';
import { environment } from '../../environments/environment';
import { Loja } from '../models';

describe('LojaService', () => {
  let service: LojaService;
  let httpMock: HttpTestingController;

  const mockLoja: Loja = {
    id: '1',
    usuarioId: 'u1',
    nome: 'Minha Loja',
    slug: 'minha-loja',
    onboardingConcluido: true,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LojaService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(LojaService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve buscar dados da loja', () => {
    service.buscarDados().subscribe(loja => {
      expect(loja).toEqual(mockLoja);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/loja`);
    expect(req.request.method).toBe('GET');
    req.flush(mockLoja);
  });

  it('deve atualizar dados da loja', () => {
    const update = { nome: 'Novo Nome' };
    service.atualizarDados(update).subscribe(loja => {
      expect(loja).toEqual(mockLoja);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/loja`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(update);
    req.flush(mockLoja);
  });
});
