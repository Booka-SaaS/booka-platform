import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { DisponibilidadeSemanal } from '../models';

/**
 * Serviço para gestão de horários de funcionamento semanais.
 */
@Injectable({ providedIn: 'root' })
export class DisponibilidadeService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/disponibilidade`;

  listar(): Observable<DisponibilidadeSemanal[]> {
    return this.http.get<DisponibilidadeSemanal[]>(this.apiUrl);
  }

  /** Upsert de todos os dias da semana de uma vez. */
  atualizar(dias: Partial<DisponibilidadeSemanal>[]): Observable<DisponibilidadeSemanal[]> {
    return this.http.put<DisponibilidadeSemanal[]>(this.apiUrl, dias);
  }
}
