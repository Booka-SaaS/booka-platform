import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { NotificacaoService } from './notificacao.service';

describe('NotificacaoService', () => {
  let service: NotificacaoService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(NotificacaoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should list notifications from gateway', () => {
    service.listar().subscribe(notificacoes => {
      expect(notificacoes.length).toBe(1);
      expect(notificacoes[0].titulo).toBe('Novo agendamento');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/notifications`);
    expect(req.request.method).toBe('GET');
    req.flush([
      {
        id: 'notificacao-1',
        usuarioId: 'usuario-1',
        eventoId: 'booking.created.1',
        titulo: 'Novo agendamento',
        mensagem: 'Cliente solicitou Servico.',
        tipo: 'AGENDAMENTO',
        lida: false,
        createdAt: new Date().toISOString(),
      },
    ]);
  });

  it('should mark notification as read', () => {
    service.marcarComoLida('notificacao-1').subscribe(notificacao => {
      expect(notificacao.lida).toBeTrue();
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/notifications/notificacao-1/read`);
    expect(req.request.method).toBe('PATCH');
    req.flush({
      id: 'notificacao-1',
      usuarioId: 'usuario-1',
      titulo: 'Novo agendamento',
      mensagem: 'Cliente solicitou Servico.',
      tipo: 'AGENDAMENTO',
      lida: true,
      createdAt: new Date().toISOString(),
    });
  });
});
