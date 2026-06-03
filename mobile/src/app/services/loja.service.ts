import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Loja } from '../models';

/**
 * Serviço para dados da loja do profissional logado.
 * Não herda BaseApiService porque usa apenas GET/PUT sem CRUD completo.
 */
@Injectable({ providedIn: 'root' })
export class LojaService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/loja`;

  buscarDados(): Observable<Loja> {
    return this.http.get<Loja>(this.apiUrl);
  }

  atualizarDados(loja: Partial<Loja>): Observable<Loja> {
    return this.http.put<Loja>(this.apiUrl, loja);
  }
}
