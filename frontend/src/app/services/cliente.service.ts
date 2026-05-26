import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Cliente } from '../models';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface CreateClienteRequest {
  nome: string;
  email?: string | null;
  telefone: string;
  anotacoes?: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/clientes`;

  listar(params?: { page?: number; limit?: number }): Observable<Cliente[]> {
    let httpParams = new HttpParams();
    if (params) {
      if (params.page) httpParams = httpParams.set('page', params.page);
      if (params.limit) httpParams = httpParams.set('limit', params.limit);
    }
    return this.http.get<Cliente[]>(this.apiUrl, { params: httpParams })
      .pipe(
        catchError(err => {
          console.error('Erro ao listar clientes:', err);
          return throwError(() => err);
        })
      );
  }

  criar(dados: CreateClienteRequest): Observable<Cliente> {
    return this.http.post<Cliente>(this.apiUrl, dados)
      .pipe(
        catchError(err => {
          console.error('Erro ao criar cliente:', err);
          return throwError(() => err);
        })
      );
  }

  atualizar(id: string | number, dados: Partial<CreateClienteRequest>): Observable<Cliente> {
    return this.http.put<Cliente>(`${this.apiUrl}/${id}`, dados)
      .pipe(
        catchError(err => {
          console.error('Erro ao atualizar cliente:', err);
          return throwError(() => err);
        })
      );
  }

  deletar(id: string | number): Observable<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(err => {
          console.error('Erro ao deletar cliente:', err);
          return throwError(() => err);
        })
      );
  }
}
