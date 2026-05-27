import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Profissional, ProfissionalDetalhe } from '../models';

type DisponibilidadeResponse = {
  data?: string;
  horarios?: string[];
  slots?: string[];
};

@Injectable({
  providedIn: 'root'
})
export class ProfissionalService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/profissionais`;

  private mapProfissional(item: Profissional): Profissional {
    return {
      ...item,
      nome: item.nome ?? item.nomeExibicao ?? 'Profissional',
      profissao: item.profissao ?? item.especialidade ?? 'Profissional',
      categoria: item.categoria ?? item.categoriaPrincipal ?? 'Geral',
      modalidade: item.modalidade ?? item.modalidadePrincipal ?? 'PRESENCIAL',
      vendedor: item.vendedor ?? item.tipo_vendedor ?? 'AUTONOMO',
      precoInicial: item.precoInicial ?? item.preco_medio ?? item.preco ?? 0,
      rating: item.rating ?? 0,
      especialidade: item.especialidade ?? item.profissao,
      preco_medio: item.preco_medio ?? item.precoInicial,
      preco: item.preco ?? item.precoInicial,
      modalidades: item.modalidades ?? (item.modalidade ? [item.modalidade] : []),
      tipo_vendedor: item.tipo_vendedor ?? item.vendedor,
      servicos: item.servicos?.map((servico) => ({
        ...servico,
        duracao: servico.duracao ?? servico.duracaoMinutos,
      })),
    };
  }

  listar(params?: { page?: number; limit?: number; q?: string; categoria?: string; cidade?: string; modalidade?: string; precoMax?: number; avaliacaoMinima?: number }): Observable<Profissional[]> {
    let httpParams = new HttpParams();
    if (params) {
      if (params.page) httpParams = httpParams.set('page', params.page);
      if (params.limit) httpParams = httpParams.set('limit', params.limit);
      if (params.q) httpParams = httpParams.set('q', params.q);
      if (params.categoria) httpParams = httpParams.set('categoria', params.categoria);
      if (params.cidade) httpParams = httpParams.set('cidade', params.cidade);
      if (params.modalidade) httpParams = httpParams.set('modalidade', params.modalidade);
      if (params.precoMax !== undefined) httpParams = httpParams.set('precoMax', params.precoMax);
      if (params.avaliacaoMinima !== undefined) httpParams = httpParams.set('avaliacaoMinima', params.avaliacaoMinima);
    }
    return this.http.get<Profissional[]>(this.apiUrl, { params: httpParams })
      .pipe(
        map((response) => response.map((item) => this.mapProfissional(item))),
        catchError(err => {
          console.error('Erro ao listar profissionais:', err);
          return throwError(() => err);
        })
      );
  }

  obterPorSlug(slug: string): Observable<ProfissionalDetalhe> {
    return this.http.get<ProfissionalDetalhe>(`${this.apiUrl}/${slug}`)
      .pipe(
        map((response) => this.mapProfissional(response) as ProfissionalDetalhe),
        catchError(err => {
          console.error('Erro ao obter profissional:', err);
          return throwError(() => err);
        })
      );
  }

  obterPorId(id: string): Observable<ProfissionalDetalhe> {
    return this.obterPorSlug(id);
  }

  obterDisponibilidade(id: string, data: string): Observable<{ data: string; horarios: string[] }> {
    let httpParams = new HttpParams().set('data', data);
    return this.http.get<DisponibilidadeResponse>(`${this.apiUrl}/${id}/disponibilidade`, { params: httpParams })
      .pipe(
        map((response) => ({
          data: response.data ?? data,
          horarios: response.horarios ?? response.slots ?? [],
        })),
        catchError(err => {
          console.error('Erro ao obter disponibilidade:', err);
          return throwError(() => err);
        })
      );
  }
}
