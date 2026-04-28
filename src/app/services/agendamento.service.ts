// src/app/services/agendamento.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';
import { environment } from '../../environments/environment';
import { Agendamento } from '../models/Agendamento';

@Injectable({
  providedIn: 'root'
})
export class AgendamentoService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  // Mock para desenvolvimento sem backend
  private mockAgendamentos: Agendamento[] = [
    {
      id: 1,
      clienteId: 'user-123',
      lojaId: 'barber-01',
      nomeLoja: 'Corte & Estilo Premium',
      servicoId: 101,
      nomeServico: 'Corte de Cabelo + Barba',
      data: '2026-04-20T14:30:00',
      dataHora: '2026-04-20T14:30:00',
      valor: 85.00,
      status: 'CONFIRMADO'
    },
    {
      id: 2,
      clienteId: 'user-123',
      lojaId: 'beauty-02',
      nomeLoja: 'Studio Letícia Nails',
      servicoId: 202,
      nomeServico: 'Manicure e Pedicure',
      data: '2026-04-10T09:00:00',
      dataHora: '2026-04-10T09:00:00',
      valor: 120.00,
      status: 'CONCLUIDO'
    },
    {
      id: 3,
      clienteId: 'user-123',
      lojaId: 'spa-03',
      nomeLoja: 'Zen Spa & Wellness',
      servicoId: 303,
      nomeServico: 'Massagem Relaxante',
      data: '2026-04-25T16:00:00',
      dataHora: '2026-04-25T16:00:00',
      valor: 150.00,
      status: 'PENDENTE'
    }
  ];

  getMeusAgendamentos(): Observable<Agendamento[]> {
    // Futuro: return this.http.get<Agendamento[]>(`${this.apiUrl}/agendamentos/meus`);
    return of(this.mockAgendamentos).pipe(delay(1200)); // Delay um pouco maior para ver o loading bonito
  }

  listar() {
    return of(this.mockAgendamentos).pipe(delay(800));
  }

  cancelar(id: string | number): Observable<any> {
    console.log(`Cancelando agendamento ${id}`);
    return of({ success: true }).pipe(delay(1000));
  }

  // Métodos já existentes
  listarPorLoja(lojaId: string | number) {
    return this.http.get<Agendamento[]>(`${this.apiUrl}/agendamentos/loja/${lojaId}`);
  }
}