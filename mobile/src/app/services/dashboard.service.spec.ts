import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { DashboardService, DashboardResumo } from './dashboard.service';
import { environment } from '../../environments/environment';

describe('DashboardService', () => {
  let service: DashboardService;
  let httpMock: HttpTestingController;

  const mockResumo: DashboardResumo = {
    totalClientes: 10,
    totalServicos: 5,
    agendamentosHoje: 2,
    proximoAgendamento: null
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DashboardService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(DashboardService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve obter resumo do dashboard', () => {
    service.obterResumo().subscribe(resumo => {
      expect(resumo).toEqual(mockResumo);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/dashboard/resumo`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResumo);
  });
});
