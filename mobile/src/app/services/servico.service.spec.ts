import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { ServicoService } from './servico.service';
import { environment } from '../../environments/environment';
import { Servico } from '../models';

describe('ServicoService', () => {
  let service: ServicoService;
  let httpMock: HttpTestingController;

  const mockServico: Servico = {
    id: '1',
    lojaId: 'loja1',
    nome: 'Corte de Cabelo',
    duracaoMinutos: 30,
    preco: 50.00,
    ativo: true,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ServicoService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(ServicoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve listar serviços', () => {
    service.listar().subscribe(servicos => {
      expect(servicos.length).toBe(1);
      expect(servicos[0]).toEqual(mockServico);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/servicos`);
    expect(req.request.method).toBe('GET');
    req.flush([mockServico]);
  });

  it('deve criar um serviço', () => {
    const novoServico = { nome: 'Corte de Cabelo', duracaoMinutos: 30, preco: 50.00, ativo: true };
    service.criar(novoServico).subscribe(servico => {
      expect(servico).toEqual(mockServico);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/servicos`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(novoServico);
    req.flush(mockServico);
  });

  it('deve atualizar um serviço', () => {
    const update = { preco: 60.00 };
    service.atualizar('1', update).subscribe(servico => {
      expect(servico.preco).toBe(50.00); // Mock response
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/servicos/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(update);
    req.flush(mockServico);
  });

  it('deve deletar um serviço', () => {
    service.deletar('1').subscribe(res => {
      expect(res.success).toBeTrue();
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/servicos/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({ success: true });
  });
});
