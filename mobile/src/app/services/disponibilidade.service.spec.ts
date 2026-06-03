import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { DisponibilidadeService } from './disponibilidade.service';
import { environment } from '../../environments/environment';

describe('DisponibilidadeService', () => {
  let service: DisponibilidadeService;
  let httpMock: HttpTestingController;

  const mockDias = [
    { diaSemana: 1, horaInicio: '08:00', horaFim: '18:00', intervaloMinutos: 30, ativo: true }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DisponibilidadeService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(DisponibilidadeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve listar dias da semana', () => {
    service.listar().subscribe(dias => {
      // @ts-ignore
      expect(dias).toEqual(mockDias);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/disponibilidade`);
    expect(req.request.method).toBe('GET');
    req.flush(mockDias);
  });

  it('deve atualizar dias', () => {
    service.atualizar(mockDias).subscribe(dias => {
      // @ts-ignore
      expect(dias).toEqual(mockDias);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/disponibilidade`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockDias);
    req.flush(mockDias);
  });
});
