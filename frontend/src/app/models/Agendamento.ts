export type StatusAgendamento = 'PENDENTE' | 'CONFIRMADO' | 'CANCELADO' | 'CONCLUIDO';
export type OrigemAgendamento = 'PUBLICO' | 'PAINEL';

export interface Agendamento {
  id?: number | string;
  clienteId?: number | string;
  clienteNome?: string;
  lojaId?: number | string;
  nomeLoja?: string;
  servicoId?: number | string;
  servicoNome?: string;
  nomeServico?: string;
  data?: Date | string;
  dataHora?: Date | string;
  inicio?: Date | string;
  fim?: Date | string;
  valor?: number;
  status: StatusAgendamento;
  origem?: OrigemAgendamento;
  observacoes?: string | null;
  criadoEm?: Date | string;
  atualizadoEm?: Date | string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}
