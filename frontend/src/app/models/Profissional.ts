export type ModalidadeProfissional = 'ONLINE' | 'PRESENCIAL' | 'HIBRIDO';
export type TipoVendedor = 'AUTONOMO' | 'EMPRESA';

export interface ProfissionalServico {
  id: string;
  nome: string;
  descricao?: string | null;
  preco: number;
  duracaoMinutos?: number;
  duracao?: number;
  ativo?: boolean;
}

export interface Profissional {
  id: string;
  nome: string;
  nomeExibicao?: string;
  profissao: string;
  especialidade?: string;
  descricao?: string | null;
  bio?: string | null;
  telefone?: string | null;
  cidade?: string | null;
  img?: string | null;
  imagemUrl?: string | null;
  categoria: string;
  categoriaPrincipal?: string;
  modalidade: ModalidadeProfissional | string;
  modalidadePrincipal?: ModalidadeProfissional;
  modalidades?: string[];
  vendedor: TipoVendedor | string;
  tipo_vendedor?: TipoVendedor | string;
  precoInicial: number;
  preco_medio?: number;
  preco?: number;
  rating: number;
  avaliacoesCount?: number;
  publicado?: boolean;
  servicos?: ProfissionalServico[];
}

export interface ProfissionalDetalhe extends Profissional {
  loja?: {
    id: string;
    nome: string;
    slug?: string;
    email?: string;
    telefone?: string;
    endereco?: string;
    descricao?: string;
  };
  servicos: ProfissionalServico[];
}
