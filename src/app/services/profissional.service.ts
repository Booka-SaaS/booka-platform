import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Profissional } from '../models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfissionalService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/profissionais`;

  obterPorSlug(slug: string): Observable<Profissional> {
    return this.http.get<Profissional>(`${this.apiUrl}/slug/${slug}`);
  }

  obterDisponibilidade(slug: string, data: string): Observable<{ slots: string[] }> {
    return this.http.get<{ slots: string[] }>(`${this.apiUrl}/${slug}/disponibilidade`, {
      params: { data }
    });
  }

  listar(): Observable<Profissional[]> {
    return this.http.get<Profissional[]>(this.apiUrl);
  }

  obterPorId(id: string | number): Observable<Profissional> {
    return this.http.get<Profissional>(`${this.apiUrl}/${id}`);
  }
}
