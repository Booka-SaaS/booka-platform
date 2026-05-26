export interface Servico {
  id?: number | string;
  nome: string;
  descricao?: string;
  preco: number;
  duracaoMinutos?: number;
  lojaId?: number | string;
  criadoEm?: Date | string;
  atualizadoEm?: Date | string;
}
