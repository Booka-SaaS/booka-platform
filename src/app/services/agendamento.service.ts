import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export type StatusAgendamento = 'PENDENTE' | 'CONFIRMADO' | 'CANCELADO' | 'CONCLUIDO';

export interface Agendamento {
  id: string;
  dataAgendamento: string;
  horaInicio: string;
  horaFim: string;
  status: StatusAgendamento;
  origem: 'PUBLICO' | 'PAINEL';
  nomeCliente: string;
  emailCliente: string;
  telefoneCliente?: string;
  notasCliente?: string;
  servicoId: string;
  clienteId?: string;
  lojaId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAgendamentoRequest {
  nomeCliente: string;
  emailCliente: string;
  telefoneCliente?: string;
  notasCliente?: string;
  servicoId: string;
  dataAgendamento: string;
  horaInicio: string;
  horaFim?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AgendamentoService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/agendamentos`;

  // Cliente criar agendamento (público, sem autenticação)
  criarPublico(dados: CreateAgendamentoRequest): Observable<{ agendamento: Agendamento }> {
    return this.http.post<{ agendamento: Agendamento }>(`${this.apiUrl}/publicos`, dados)
      .pipe(
        catchError(err => {
          console.error('Erro ao criar agendamento público:', err);
          return throwError(() => err);
        })
      );
  }

  // Profissional: listar seus agendamentos (requer autenticação)
  listar(params?: { page?: number; limit?: number; status?: StatusAgendamento; data?: string }): Observable<{ data: Agendamento[] }> {
    let httpParams = new HttpParams();
    if (params) {
      if (params.page) httpParams = httpParams.set('page', params.page);
      if (params.limit) httpParams = httpParams.set('limit', params.limit);
      if (params.status) httpParams = httpParams.set('status', params.status);
      if (params.data) httpParams = httpParams.set('data', params.data);
    }
    return this.http.get<{ data: Agendamento[] }>(this.apiUrl, { params: httpParams })
      .pipe(
        catchError(err => {
          console.error('Erro ao listar agendamentos:', err);
          return throwError(() => err);
        })
      );
  }

  // Profissional: criar agendamento (requer autenticação)
  criar(dados: CreateAgendamentoRequest): Observable<{ agendamento: Agendamento }> {
    return this.http.post<{ agendamento: Agendamento }>(this.apiUrl, dados)
      .pipe(
        catchError(err => {
          console.error('Erro ao criar agendamento:', err);
          return throwError(() => err);
        })
      );
  }

  // Profissional: atualizar agendamento (requer autenticação)
  atualizar(id: string, dados: Partial<Agendamento>): Observable<{ agendamento: Agendamento }> {
    return this.http.put<{ agendamento: Agendamento }>(`${this.apiUrl}/${id}`, dados)
      .pipe(
        catchError(err => {
          console.error('Erro ao atualizar agendamento:', err);
          return throwError(() => err);
        })
      );
  }

  // Profissional: deletar agendamento (requer autenticação)
  deletar(id: string): Observable<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(err => {
          console.error('Erro ao deletar agendamento:', err);
          return throwError(() => err);
        })
      );
  }

  // Atualizar status
  atualizarStatus(id: string, novoStatus: StatusAgendamento): Observable<{ agendamento: Agendamento }> {
    return this.atualizar(id, { status: novoStatus });
  }

  // Métodos compatíveis com código legado
  getMeusAgendamentos(): Observable<Agendamento[]> {
    return this.http.get<Agendamento[]>(`${this.apiUrl}`);
  }

  listarPorLoja(lojaId: string | number): Observable<Agendamento[]> {
    return this.http.get<Agendamento[]>(`${this.apiUrl}?lojaId=${lojaId}`);
  }

  cancelar(id: string | number): Observable<any> {
    return this.atualizarStatus(id.toString(), 'CANCELADO');
  }
}