import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

export interface Bloqueio {
  id: number;
  data_inicio: string;
  data_fim: string;
  motivo: string;
}

@Injectable({
  providedIn: 'root'
})
export class BloqueioService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/bloqueios`;

  listar(): Observable<Bloqueio[]> {
    return this.http.get<Bloqueio[]>(this.apiUrl);
  }

  criar(bloqueio: Bloqueio): Observable<Bloqueio> {
    return this.http.post<Bloqueio>(this.apiUrl, bloqueio);
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
