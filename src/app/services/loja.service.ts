import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Loja } from '../models';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface CreateLojaRequest {
  nome: string;
  slug?: string;
  email?: string;
  telefone?: string;
  endereco?: string;
  cidade?: string;
  descricao?: string;
  imagemUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class LojaService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/loja`;

  // Obter dados da loja do profissional logado
  obter(): Observable<{ loja: Loja }> {
    return this.http.get<{ loja: Loja }>(this.apiUrl)
      .pipe(
        catchError(err => {
          console.error('Erro ao obter loja:', err);
          return throwError(() => err);
        })
      );
  }

  // Criar loja
  criar(dados: CreateLojaRequest): Observable<{ loja: Loja }> {
    return this.http.post<{ loja: Loja }>(this.apiUrl, dados)
      .pipe(
        catchError(err => {
          console.error('Erro ao criar loja:', err);
          return throwError(() => err);
        })
      );
  }

  // Atualizar loja
  atualizar(dados: Partial<CreateLojaRequest>): Observable<{ loja: Loja }> {
    return this.http.put<{ loja: Loja }>(this.apiUrl, dados)
      .pipe(
        catchError(err => {
          console.error('Erro ao atualizar loja:', err);
          return throwError(() => err);
        })
      );
  }

  // Métodos legados para compatibilidade
  buscarDados(): Observable<Loja> {
    return this.http.get<Loja>(this.apiUrl);
  }

  atualizarDados(loja: Partial<Loja>): Observable<Loja> {
    return this.http.put<Loja>(this.apiUrl, loja);
  }
}
