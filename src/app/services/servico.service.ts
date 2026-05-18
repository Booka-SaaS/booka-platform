import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Servico } from '../models';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface CreateServicoRequest {
  nome: string;
  descricao?: string;
  preco: number;
  duracao: number;
  categoria: string;
}

@Injectable({
  providedIn: 'root'
})
export class ServicoService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/servicos`;

  // Listar serviços do profissional logado
  listar(params?: { page?: number; limit?: number }): Observable<{ data: Servico[] }> {
    let httpParams = new HttpParams();
    if (params) {
      if (params.page) httpParams = httpParams.set('page', params.page);
      if (params.limit) httpParams = httpParams.set('limit', params.limit);
    }
    return this.http.get<{ data: Servico[] }>(this.apiUrl, { params: httpParams })
      .pipe(
        catchError(err => {
          console.error('Erro ao listar serviços:', err);
          return throwError(() => err);
        })
      );
  }

  // Criar novo serviço
  criar(dados: CreateServicoRequest): Observable<{ servico: Servico }> {
    return this.http.post<{ servico: Servico }>(this.apiUrl, dados)
      .pipe(
        catchError(err => {
          console.error('Erro ao criar serviço:', err);
          return throwError(() => err);
        })
      );
  }

  // Atualizar serviço
  atualizar(id: string | number, dados: Partial<CreateServicoRequest>): Observable<{ servico: Servico }> {
    return this.http.put<{ servico: Servico }>(`${this.apiUrl}/${id}`, dados)
      .pipe(
        catchError(err => {
          console.error('Erro ao atualizar serviço:', err);
          return throwError(() => err);
        })
      );
  }

  // Deletar serviço
  deletar(id: string | number): Observable<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(err => {
          console.error('Erro ao deletar serviço:', err);
          return throwError(() => err);
        })
      );
  }
}
