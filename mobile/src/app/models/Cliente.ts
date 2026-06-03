import { BaseEntity } from './BaseEntity';

export interface Cliente extends BaseEntity {
  lojaId: string;
  nome: string;
  email?: string | null;
  telefone: string;         // Obrigatório no V2
  anotacoes?: string | null;
}
