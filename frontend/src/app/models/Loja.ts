export interface Loja {
  id?: number | string;
  nome: string;
  endereco?: string;
  telefone?: string;
  cnpj?: string;
  usuarioId?: number | string;
  criadoEm?: Date | string;
  atualizadoEm?: Date | string;
}
