import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Profissional } from '../models';

/**
 * Serviço para o marketplace público de profissionais.
 * Não herda BaseApiService porque são endpoints públicos somente-leitura.
 */
@Injectable({ providedIn: 'root' })
export class ProfissionalService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/profissionais`;

  /** Lista profissionais publicados com filtros opcionais. */
  listar(filtros?: {
    q?: string;
    cidade?: string;
    categoria?: string;
    modalidade?: string;
  }): Observable<Profissional[]> {
    let params = new HttpParams();
    if (filtros) {
      Object.entries(filtros).forEach(([key, value]) => {
        if (value) { params = params.set(key, value); }
      });
    }
    return this.http.get<Profissional[]>(this.apiUrl, { params });
  }

  /** Detalhes do profissional por ID (inclui serviços). */
  obterPorId(id: string): Observable<Profissional> {
    return this.http.get<Profissional>(`${this.apiUrl}/${id}`);
  }

  /** Slots de horário disponíveis para uma data específica. */
  obterDisponibilidade(id: string, data: string): Observable<{ slots: string[] }> {
    return this.http.get<{ slots: string[] }>(`${this.apiUrl}/${id}/disponibilidade`, {
      params: { data }
    });
  }
}
