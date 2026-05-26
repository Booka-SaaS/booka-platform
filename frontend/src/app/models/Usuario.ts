export interface Usuario {
  id?: number | string;
  nome: string;
  email: string;
  senha?: string;
  role?: string;
  lojaId?: number | string;
  criadoEm?: Date | string;
  atualizadoEm?: Date | string;
}
