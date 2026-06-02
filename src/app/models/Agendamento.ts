import { BaseEntity } from './BaseEntity';
import { Cliente } from './Cliente';
import { Servico } from './Servico';

export type StatusAgendamento = 'PENDENTE' | 'CONFIRMADO' | 'CANCELADO' | 'CONCLUIDO';
export type OrigemAgendamento = 'PUBLICO' | 'PAINEL';

export interface Agendamento extends BaseEntity {
  lojaId: string;
  clienteId: string;
  servicoId: string;
  inicio: string;            // ISO 8601 DateTime
  fim: string;               // ISO 8601 DateTime
  status: StatusAgendamento;
  origem: OrigemAgendamento;
  observacoes?: string | null;

  /** Incluídos apenas quando populados pelo backend (joins) */
  cliente?: Cliente;
  servico?: Servico;
}
