import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { ProfissionalService } from './profissional.service';
import { environment } from '../../environments/environment';
import { Profissional } from '../models';

describe('ProfissionalService', () => {
  let service: ProfissionalService;
  let httpMock: HttpTestingController;

  const mockProfissional: Profissional = {
    id: '1',
    usuarioId: 'u1',
    nomeExibicao: 'João Silva',
    profissao: 'Barbeiro',
    categoriaPrincipal: 'Beleza',
    modalidadePrincipal: 'PRESENCIAL',
    tipoVendedor: 'AUTONOMO',
    publicado: true,
    rating: 5,
    avaliacoesCount: 10,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProfissionalService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(ProfissionalService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve listar profissionais com filtros', () => {
    service.listar({ cidade: 'São Paulo' }).subscribe(profissionais => {
      expect(profissionais.length).toBe(1);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/profissionais?cidade=S%C3%A3o%20Paulo`);
    expect(req.request.method).toBe('GET');
    req.flush([mockProfissional]);
  });

  it('deve obter profissional por id', () => {
    service.obterPorId('1').subscribe(prof => {
      expect(prof).toEqual(mockProfissional);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/profissionais/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockProfissional);
  });

  it('deve obter disponibilidade', () => {
    service.obterDisponibilidade('1', '2026-06-02').subscribe(res => {
      expect(res.slots).toEqual(['10:00', '11:00']);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/profissionais/1/disponibilidade?data=2026-06-02`);
    expect(req.request.method).toBe('GET');
    req.flush({ slots: ['10:00', '11:00'] });
  });
});
