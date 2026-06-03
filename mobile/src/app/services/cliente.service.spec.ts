import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { ClienteService } from './cliente.service';
import { environment } from '../../environments/environment';
import { Cliente } from '../models';

describe('ClienteService', () => {
  let service: ClienteService;
  let httpMock: HttpTestingController;

  const mockCliente: Cliente = {
    id: '1',
    lojaId: 'loja1',
    nome: 'João',
    telefone: '11999999999',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ClienteService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(ClienteService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve listar clientes', () => {
    service.listar().subscribe(clientes => {
      expect(clientes.length).toBe(1);
      expect(clientes[0]).toEqual(mockCliente);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/clientes`);
    expect(req.request.method).toBe('GET');
    req.flush([mockCliente]);
  });

  it('deve criar um cliente', () => {
    const novoCliente = { nome: 'João', telefone: '11999999999' };
    service.criar(novoCliente).subscribe(cliente => {
      expect(cliente).toEqual(mockCliente);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/clientes`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(novoCliente);
    req.flush(mockCliente);
  });

  it('deve deletar um cliente', () => {
    service.deletar('1').subscribe(res => {
      expect(res.success).toBeTrue();
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/clientes/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({ success: true });
  });
});
