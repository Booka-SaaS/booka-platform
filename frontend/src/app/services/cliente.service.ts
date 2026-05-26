import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Cliente } from '../models';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface CreateClienteRequest {
  nomeCliente: string;
  emailCliente: string;
  telefoneCliente?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/clientes`;

  // Listar clientes do profissional logado
  listar(params?: { page?: number; limit?: number }): Observable<{ data: Cliente[] }> {
    let httpParams = new HttpParams();
    if (params) {
      if (params.page) httpParams = httpParams.set('page', params.page);
      if (params.limit) httpParams = httpParams.set('limit', params.limit);
    }
    return this.http.get<{ data: Cliente[] }>(this.apiUrl, { params: httpParams })
      .pipe(
        catchError(err => {
          console.error('Erro ao listar clientes:', err);
          return throwError(() => err);
        })
      );
  }

  // Criar novo cliente
  criar(dados: CreateClienteRequest): Observable<{ cliente: Cliente }> {
    return this.http.post<{ cliente: Cliente }>(this.apiUrl, dados)
      .pipe(
        catchError(err => {
          console.error('Erro ao criar cliente:', err);
          return throwError(() => err);
        })
      );
  }

  // Atualizar cliente
  atualizar(id: string | number, dados: Partial<CreateClienteRequest>): Observable<{ cliente: Cliente }> {
    return this.http.put<{ cliente: Cliente }>(`${this.apiUrl}/${id}`, dados)
      .pipe(
        catchError(err => {
          console.error('Erro ao atualizar cliente:', err);
          return throwError(() => err);
        })
      );
  }

  // Deletar cliente
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
