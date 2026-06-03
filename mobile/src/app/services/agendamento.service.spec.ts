import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { AgendamentoService } from './agendamento.service';
import { environment } from '../../environments/environment';
import { Agendamento } from '../models';

describe('AgendamentoService', () => {
  let service: AgendamentoService;
  let httpMock: HttpTestingController;

  const mockAgendamento: Agendamento = {
    id: '1',
    lojaId: 'loja1',
    clienteId: 'cliente1',
    servicoId: 'servico1',
    inicio: '2026-06-02T10:00:00Z',
    fim: '2026-06-02T11:00:00Z',
    status: 'PENDENTE',
    origem: 'PUBLICO',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AgendamentoService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(AgendamentoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve listar agendamentos com filtros', () => {
    service.listarComFiltros({ status: 'PENDENTE' }).subscribe(agendamentos => {
      expect(agendamentos.length).toBe(1);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/agendamentos?status=PENDENTE`);
    expect(req.request.method).toBe('GET');
    req.flush([mockAgendamento]);
  });

  it('deve listar meus agendamentos', () => {
    service.listarMeus().subscribe(agendamentos => {
      expect(agendamentos.length).toBe(1);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/agendamentos/meus`);
    expect(req.request.method).toBe('GET');
    req.flush([mockAgendamento]);
  });

  it('deve criar um agendamento público', () => {
    const payload = { servicoId: '1', inicio: '2026-06-02T10:00:00Z' };
    service.criarPublico(payload).subscribe(agendamento => {
      expect(agendamento).toEqual(mockAgendamento);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/agendamentos/publicos`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush(mockAgendamento);
  });
});
