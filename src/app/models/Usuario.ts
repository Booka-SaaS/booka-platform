import { BaseEntity } from './BaseEntity';

export type UserRole = 'CLIENTE' | 'PROFISSIONAL';

export interface Usuario extends BaseEntity {
  nome: string;
  email: string;
  role: UserRole;
  ativo?: boolean;
  imagemUrl?: string | null;
}
