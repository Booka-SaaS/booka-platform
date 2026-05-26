// src/app/models/Agendamento.ts
export interface Agendamento {
  id?: number | string;
  clienteId: number | string;
  lojaId: number | string;
  nomeLoja?: string;      // Adicionado para o front-end
  servicoId: number | string;
  nomeServico?: string;   // Adicionado para o front-end
  data: Date | string;
  dataHora?: Date | string; // Compatibilidade com AgendaComponent
  valor?: number;         // Adicionado para o front-end
  status: 'PENDENTE' | 'CONFIRMADO' | 'CONCLUIDO' | 'CANCELADO';
  criadoEm?: Date | string;
  atualizadoEm?: Date | string;
}