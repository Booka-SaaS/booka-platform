export interface Profissional {
  id: string;
  nome?: string;
  nomeExibicao?: string;
  profissao?: string;
  especialidade?: string;
  descricao?: string | null;
  bio?: string | null;
  telefone?: string | null;
  cidade?: string | null;
  img?: string | null;
  imagemUrl?: string | null;
  categoria?: string;
  categoriaPrincipal?: string;
  modalidade?: 'ONLINE' | 'PRESENCIAL' | 'HIBRIDO' | string;
  modalidadePrincipal?: 'ONLINE' | 'PRESENCIAL' | 'HIBRIDO';
  modalidades?: string[];
  vendedor?: 'AUTONOMO' | 'EMPRESA' | string;
  tipo_vendedor?: 'AUTONOMO' | 'EMPRESA' | string;
  precoInicial?: number;
  preco_medio?: number;
  preco?: number;
  rating?: number;
  avaliacoesCount?: number;
  publicado?: boolean;
  servicos?: Array<{
    id: string;
    nome: string;
    descricao?: string | null;
    preco: number;
    duracaoMinutos?: number;
    duracao?: number;
  }>;
}
