import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface DashboardResumo {
  totalClientes: number;
  totalServicos: number;
  agendamentosHoje: number;
  proximoAgendamento: {
    id: string;
    inicio: string;
    cliente: { nome: string };
    servico: { nome: string };
  } | null;
}

/**
 * Serviço para métricas do dashboard do profissional.
 */
@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/dashboard`;

  obterResumo(): Observable<DashboardResumo> {
    return this.http.get<DashboardResumo>(`${this.apiUrl}/resumo`);
  }
}
