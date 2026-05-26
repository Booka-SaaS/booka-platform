// Respostas padrão da API
export interface ApiErrorResponse {
  message: string;
  issues?: any;
}

export interface ApiSuccessResponse<T> {
  data?: T;
  message?: string;
}

// Tipos de usuário
export type UserRole = 'CLIENTE' | 'PROFISSIONAL';

// Status de agendamento
export type AgendamentoStatus = 'PENDENTE' | 'CONFIRMADO' | 'CANCELADO' | 'CONCLUIDO';

// Origem do agendamento
export type AgendamentoOrigem = 'PUBLICO' | 'PAINEL';

// Modalidade de serviço
export type Modalidade = 'ONLINE' | 'PRESENCIAL' | 'HIBRIDO';

// Tipo de vendedor
export type TipoVendedor = 'AUTONOMO' | 'EMPRESA';

// Helpers
export const errorToString = (error: any): string => {
  if (error?.error?.message) {
    return error.error.message;
  }
  if (error?.message) {
    return error.message;
  }
  if (error?.error?.issues) {
    return Object.values(error.error.issues)
      .flat()
      .join(', ');
  }
  return 'Erro desconhecido';
};

export const isApiError = (error: any): error is ApiErrorResponse => {
  return error && typeof error === 'object' && 'message' in error;
};
