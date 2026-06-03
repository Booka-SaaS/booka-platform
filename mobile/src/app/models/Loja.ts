import { BaseEntity } from './BaseEntity';

export interface Loja extends BaseEntity {
  usuarioId: string;
  perfilProfissionalId?: string | null;
  nome: string;
  slug: string;
  email?: string | null;
  telefone?: string | null;
  endereco?: string | null;
  cidade?: string | null;
  descricao?: string | null;
  imagemUrl?: string | null;
  onboardingConcluido: boolean;
}

/** Contexto resumido da loja retornado no login (/auth/me) */
export interface LojaContext {
  id: string;
  nome: string;
  onboardingConcluido: boolean;
}
