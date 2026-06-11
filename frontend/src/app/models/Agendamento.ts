// src/app/models/Agendamento.ts
export type StatusAgendamento = 'PENDENTE' | 'CONFIRMADO' | 'CANCELADO' | 'CONCLUIDO';
export type OrigemAgendamento = 'PUBLICO' | 'PAINEL';

// Retornado por GET /agendamentos (painel do profissional)
export interface Agendamento {
  id: string;
  clienteId: string;
  clienteNome: string;
  servicoId: string;
  servicoNome: string;
  inicio: string;
  fim: string;
  status: StatusAgendamento;
  origem: OrigemAgendamento;
  observacoes: string | null;
  createdAt: string;
  updatedAt: string;
}

// Retornado por GET /agendamentos/meus (visão do cliente logado)
export interface AgendamentoMeu extends Agendamento {
  nomeLoja: string;
  nomeServico: string;
  valor: number;
}