import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Servico } from '../models';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface CreateServicoRequest {
  nome: string;
  descricao?: string | null;
  preco: number;
  duracaoMinutos: number;
  ativo?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ServicoService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/servicos`;

  listar(params?: { page?: number; limit?: number }): Observable<Servico[]> {
    let httpParams = new HttpParams();
    if (params) {
      if (params.page) httpParams = httpParams.set('page', params.page);
      if (params.limit) httpParams = httpParams.set('limit', params.limit);
    }
    return this.http.get<Servico[]>(this.apiUrl, { params: httpParams })
      .pipe(
        catchError(err => {
          console.error('Erro ao listar servicos:', err);
          return throwError(() => err);
        })
      );
  }

  obter(id: string | number): Observable<Servico> {
    return this.http.get<Servico>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(err => {
          console.error('Erro ao obter servico:', err);
          return throwError(() => err);
        })
      );
  }

  criar(dados: CreateServicoRequest): Observable<Servico> {
    return this.http.post<Servico>(this.apiUrl, dados)
      .pipe(
        catchError(err => {
          console.error('Erro ao criar servico:', err);
          return throwError(() => err);
        })
      );
  }

  atualizar(id: string | number, dados: Partial<CreateServicoRequest>): Observable<Servico> {
    return this.http.put<Servico>(`${this.apiUrl}/${id}`, dados)
      .pipe(
        catchError(err => {
          console.error('Erro ao atualizar servico:', err);
          return throwError(() => err);
        })
      );
  }

  deletar(id: string | number): Observable<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(err => {
          console.error('Erro ao deletar servico:', err);
          return throwError(() => err);
        })
      );
  }
}
