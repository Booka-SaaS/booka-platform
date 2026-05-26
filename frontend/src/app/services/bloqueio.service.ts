import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface BloqueioAgenda {
  id: string;
  dataInicio: string;
  dataFim: string;
  motivo?: string;
  lojaId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBloqueioRequest {
  dataInicio: string;
  dataFim: string;
  motivo?: string;
}

@Injectable({
  providedIn: 'root'
})
export class BloqueioService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/bloqueios`;

  // Listar bloqueios da loja do profissional logado
  listar(params?: { page?: number; limit?: number }): Observable<{ data: BloqueioAgenda[] }> {
    let httpParams = new HttpParams();
    if (params) {
      if (params.page) httpParams = httpParams.set('page', params.page);
      if (params.limit) httpParams = httpParams.set('limit', params.limit);
    }
    return this.http.get<{ data: BloqueioAgenda[] }>(this.apiUrl, { params: httpParams })
      .pipe(
        catchError(err => {
          console.error('Erro ao listar bloqueios:', err);
          return throwError(() => err);
        })
      );
  }

  // Criar novo bloqueio
  criar(dados: CreateBloqueioRequest): Observable<{ bloqueio: BloqueioAgenda }> {
    return this.http.post<{ bloqueio: BloqueioAgenda }>(this.apiUrl, dados)
      .pipe(
        catchError(err => {
          console.error('Erro ao criar bloqueio:', err);
          return throwError(() => err);
        })
      );
  }

  // Deletar bloqueio
  deletar(id: string): Observable<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(err => {
          console.error('Erro ao deletar bloqueio:', err);
          return throwError(() => err);
        })
      );
  }
}
