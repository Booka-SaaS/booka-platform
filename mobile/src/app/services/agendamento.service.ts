import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';
import { Agendamento } from '../models';

/**
 * Serviço para gestão de agendamentos.
 * Herda CRUD de BaseApiService e adiciona endpoints específicos.
 */
@Injectable({ providedIn: 'root' })
export class AgendamentoService extends BaseApiService<Agendamento> {
  constructor() { super('/agendamentos'); }

  /** Lista agendamentos com filtros opcionais (data, status, clienteId, servicoId). */
  listarComFiltros(filtros: {
    data?: string;
    status?: string;
    clienteId?: string;
    servicoId?: string;
  }): Observable<Agendamento[]> {
    return this.listar(filtros as Record<string, string>);
  }

  /** Agendamentos do usuário logado (qualquer role). */
  listarMeus(): Observable<Agendamento[]> {
    return this.http.get<Agendamento[]>(`${this.baseUrl}/meus`);
  }

  /** Agendamento público via marketplace (sem autenticação). */
  criarPublico(dados: Record<string, unknown>): Observable<Agendamento> {
    return this.http.post<Agendamento>(`${this.baseUrl}/publicos`, dados);
  }
}
