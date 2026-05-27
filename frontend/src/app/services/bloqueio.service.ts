import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface BloqueioAgenda {
  id: string;
  inicio: string;
  fim: string;
  motivo?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBloqueioRequest {
  inicio: string;
  fim: string;
  motivo?: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class BloqueioService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/bloqueios`;

  listar(params?: { page?: number; limit?: number }): Observable<BloqueioAgenda[]> {
    let httpParams = new HttpParams();
    if (params) {
      if (params.page) httpParams = httpParams.set('page', params.page);
      if (params.limit) httpParams = httpParams.set('limit', params.limit);
    }
    return this.http.get<BloqueioAgenda[]>(this.apiUrl, { params: httpParams })
      .pipe(
        catchError(err => {
          console.error('Erro ao listar bloqueios:', err);
          return throwError(() => err);
        })
      );
  }

  obter(id: string | number): Observable<BloqueioAgenda> {
    return this.http.get<BloqueioAgenda>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(err => {
          console.error('Erro ao obter bloqueio:', err);
          return throwError(() => err);
        })
      );
  }

  criar(dados: CreateBloqueioRequest): Observable<BloqueioAgenda> {
    return this.http.post<BloqueioAgenda>(this.apiUrl, dados)
      .pipe(
        catchError(err => {
          console.error('Erro ao criar bloqueio:', err);
          return throwError(() => err);
        })
      );
  }

  atualizar(id: string | number, dados: Partial<CreateBloqueioRequest>): Observable<BloqueioAgenda> {
    return this.http.put<BloqueioAgenda>(`${this.apiUrl}/${id}`, dados)
      .pipe(
        catchError(err => {
          console.error('Erro ao atualizar bloqueio:', err);
          return throwError(() => err);
        })
      );
  }

  deletar(id: string | number): Observable<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(err => {
          console.error('Erro ao deletar bloqueio:', err);
          return throwError(() => err);
        })
      );
  }
}
