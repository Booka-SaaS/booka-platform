export interface Profissional {
  id?: number | string;
  nome: string;
  email?: string;
  profissao?: string;
  slug?: string;
  img?: string;
  descricao?: string;
  modalidades?: string[];
  servicos?: ProfissionalServico[];
  criadoEm?: Date | string;
  atualizadoEm?: Date | string;
}

export interface ProfissionalServico {
  id: number | string;
  nome: string;
  preco: number;
  duracao: number;
  descricao?: string;
}
