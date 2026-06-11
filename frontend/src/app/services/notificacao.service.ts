import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Notificacao {
  id: string;
  usuarioId: string;
  eventoId?: string | null;
  titulo: string;
  mensagem: string;
  tipo: 'AGENDAMENTO' | 'SISTEMA' | 'LEMBRETE';
  lida: boolean;
  createdAt: string;
}

@Injectable({
  providedIn: 'root',
})
export class NotificacaoService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/notifications`;

  listar(): Observable<Notificacao[]> {
    return this.http.get<Notificacao[]>(this.apiUrl);
  }

  contarNaoLidas(): Observable<{ unread: number }> {
    return this.http.get<{ unread: number }>(`${this.apiUrl}/unread-count`);
  }

  marcarComoLida(id: string): Observable<Notificacao> {
    return this.http.patch<Notificacao>(`${this.apiUrl}/${id}/read`, {});
  }
}
