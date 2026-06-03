import { BaseEntity } from './BaseEntity';

export interface Servico extends BaseEntity {
  lojaId?: string;
  nome: string;
  descricao?: string | null;
  duracaoMinutos: number;
  preco: number;            // API retorna em reais (convertido de centavos no backend)
  ativo: boolean;
}
