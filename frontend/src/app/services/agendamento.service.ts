import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Agendamento } from '../models';

export type StatusAgendamento = 'PENDENTE' | 'CONFIRMADO' | 'CANCELADO' | 'CONCLUIDO';

interface BackendAgendamento {
  id: string;
  clienteId: string;
  clienteNome?: string;
  servicoId: string;
  servicoNome?: string;
  inicio: string;
  fim: string;
  status: StatusAgendamento;
  observacoes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAgendamentoRequest {
  clienteId: string;
  servicoId: string;
  inicio: string;
  observacoes?: string | null;
  status?: StatusAgendamento;
}

export interface CreateAgendamentoPublicoRequest {
  lojaId: string;
  servicoId: string;
  inicio: string;
  observacoes?: string | null;
  cliente: {
    nome: string;
    email?: string | null;
    telefone: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AgendamentoService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/agendamentos`;

  private mapAgendamento(item: BackendAgendamento): Agendamento {
    return {
      id: item.id,
      clienteId: item.clienteId,
      clienteNome: item.clienteNome,
      servicoId: item.servicoId,
      servicoNome: item.servicoNome,
      nomeServico: item.servicoNome,
      data: item.inicio,
      dataHora: item.inicio,
      inicio: item.inicio,
      fim: item.fim,
      status: item.status,
      observacoes: item.observacoes,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    };
  }

  criarPublico(dados: CreateAgendamentoPublicoRequest): Observable<Agendamento> {
    return this.http.post<BackendAgendamento>(`${this.apiUrl}/publicos`, dados)
      .pipe(
        map((response) => this.mapAgendamento(response)),
        catchError(err => {
          console.error('Erro ao criar agendamento publico:', err);
          return throwError(() => err);
        })
      );
  }

  listar(params?: { page?: number; limit?: number; status?: StatusAgendamento; data?: string }): Observable<Agendamento[]> {
    let httpParams = new HttpParams();
    if (params) {
      if (params.page) httpParams = httpParams.set('page', params.page);
      if (params.limit) httpParams = httpParams.set('limit', params.limit);
      if (params.status) httpParams = httpParams.set('status', params.status);
      if (params.data) httpParams = httpParams.set('data', params.data);
    }
    return this.http.get<BackendAgendamento[]>(this.apiUrl, { params: httpParams })
      .pipe(
        map((response) => response.map((item) => this.mapAgendamento(item))),
        catchError(err => {
          console.error('Erro ao listar agendamentos:', err);
          return throwError(() => err);
        })
      );
  }

  criar(dados: CreateAgendamentoRequest): Observable<Agendamento> {
    return this.http.post<BackendAgendamento>(this.apiUrl, dados)
      .pipe(
        map((response) => this.mapAgendamento(response)),
        catchError(err => {
          console.error('Erro ao criar agendamento:', err);
          return throwError(() => err);
        })
      );
  }

  atualizar(id: string, dados: Partial<CreateAgendamentoRequest>): Observable<Agendamento> {
    return this.http.put<BackendAgendamento>(`${this.apiUrl}/${id}`, dados)
      .pipe(
        map((response) => this.mapAgendamento(response)),
        catchError(err => {
          console.error('Erro ao atualizar agendamento:', err);
          return throwError(() => err);
        })
      );
  }

  deletar(id: string): Observable<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(err => {
          console.error('Erro ao deletar agendamento:', err);
          return throwError(() => err);
        })
      );
  }

  atualizarStatus(id: string, novoStatus: StatusAgendamento): Observable<Agendamento> {
    return this.atualizar(id, { status: novoStatus });
  }

  getMeusAgendamentos(): Observable<Agendamento[]> {
    return this.listar();
  }

  listarPorLoja(lojaId: string | number): Observable<Agendamento[]> {
    return this.http.get<BackendAgendamento[]>(`${this.apiUrl}?lojaId=${lojaId}`).pipe(
      map((response) => response.map((item) => this.mapAgendamento(item))),
    );
  }

  cancelar(id: string | number): Observable<any> {
    return this.atualizarStatus(id.toString(), 'CANCELADO');
  }
}
