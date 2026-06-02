import { BaseEntity } from './BaseEntity';
import { Servico } from './Servico';

export type ModalidadeProfissional = 'ONLINE' | 'PRESENCIAL' | 'HIBRIDO';
export type TipoVendedor = 'AUTONOMO' | 'EMPRESA';

/**
 * Perfil público do profissional — espelha PerfilProfissional do Prisma.
 * Usado no marketplace e na tela de agendamento público.
 */
export interface Profissional extends BaseEntity {
  usuarioId: string;
  nomeExibicao: string;
  profissao: string;
  bio?: string | null;
  imagemUrl?: string | null;
  categoriaPrincipal: string;
  modalidadePrincipal: ModalidadeProfissional;
  tipoVendedor: TipoVendedor;
  cidade?: string | null;
  publicado: boolean;
  rating: number;
  avaliacoesCount: number;
  servicos?: Servico[];
  loja?: { id: string; nome: string; slug: string };
}
