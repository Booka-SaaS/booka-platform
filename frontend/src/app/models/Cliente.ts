export interface Cliente {
  id?: number | string;
  nome: string;
  email?: string;
  telefone?: string;
  lojaId?: number | string;
  anotacoes?: string;
  criadoEm?: Date | string;
  atualizadoEm?: Date | string;
}
