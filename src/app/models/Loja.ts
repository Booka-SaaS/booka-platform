export interface Loja {
  id: string;
  nome: string;
  email?: string | null;
  telefone?: string | null;
  endereco?: string | null;
  cidade?: string | null;
  descricao?: string | null;
  imagemUrl?: string | null;
  onboardingConcluido: boolean;
  profissao?: string | null;
  categoriaPrincipal?: string | null;
  modalidadePrincipal?: 'ONLINE' | 'PRESENCIAL' | 'HIBRIDO' | null;
  tipoVendedor?: 'AUTONOMO' | 'EMPRESA' | null;
}
