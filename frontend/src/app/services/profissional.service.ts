import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, catchError } from 'rxjs';
import { throwError } from 'rxjs';

export interface Profissional {
  id: string;
  nomeExibicao: string;
  profissao: string;
  bio?: string;
  imagemUrl?: string;
  categoriaPrincipal: string;
  modalidadePrincipal: 'ONLINE' | 'PRESENCIAL' | 'HIBRIDO';
  cidade?: string;
  publicado: boolean;
  rating: number;
  avaliacoesCount: number;
}

export interface ProfissionalDetalhe extends Profissional {
  loja?: {
    id: string;
    nome: string;
    slug: string;
    email?: string;
    telefone?: string;
    endereco?: string;
    descricao?: string;
  };
  servicos?: any[];
}

@Injectable({
  providedIn: 'root'
})
export class ProfissionalService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/profissionais`;

  // Listing público com paginação
  listar(params?: { page?: number; limit?: number; categoria?: string; cidade?: string }): Observable<{ data: Profissional[] }> {
    let httpParams = new HttpParams();
    if (params) {
      if (params.page) httpParams = httpParams.set('page', params.page);
      if (params.limit) httpParams = httpParams.set('limit', params.limit);
      if (params.categoria) httpParams = httpParams.set('categoria', params.categoria);
      if (params.cidade) httpParams = httpParams.set('cidade', params.cidade);
    }
    return this.http.get<{ data: Profissional[] }>(this.apiUrl, { params: httpParams })
      .pipe(
        catchError(err => {
          console.error('Erro ao listar profissionais:', err);
          return throwError(() => err);
        })
      );
  }

  // Detalhe público por slug
  obterPorSlug(slug: string): Observable<ProfissionalDetalhe> {
    return this.http.get<ProfissionalDetalhe>(`${this.apiUrl}/${slug}`)
      .pipe(
        catchError(err => {
          console.error('Erro ao obter profissional:', err);
          return throwError(() => err);
        })
      );
  }

  // Disponibilidade por data
  obterDisponibilidade(slug: string, data: string): Observable<{ slots: any[] }> {
    let httpParams = new HttpParams().set('data', data);
    return this.http.get<{ slots: any[] }>(`${this.apiUrl}/${slug}/disponibilidade`, { params: httpParams })
      .pipe(
        catchError(err => {
          console.error('Erro ao obter disponibilidade:', err);
          return throwError(() => err);
        })
      );
  }
}
