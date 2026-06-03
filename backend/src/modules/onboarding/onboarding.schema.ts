import { z } from 'zod';

export const finalizeOnboardingSchema = z.object({
  nome: z.string().trim().min(2),
  telefone: z.string().trim().min(8),
  endereco: z.string().trim().optional(),
  cep: z.string().trim().length(8),
  logradouro: z.string().trim().min(2),
  numero: z.string().trim().min(1),
  bairro: z.string().trim().min(2),
  complemento: z.string().trim().optional(),
  estado: z.string().trim().length(2),
  cidade: z.string().trim().min(2),
  descricao: z.string().trim().min(3).optional(),
  profissao: z.string().trim().min(2),
  categoriaPrincipal: z.string().trim().min(2),
  modalidadePrincipal: z.enum(['ONLINE', 'PRESENCIAL', 'HIBRIDO']).default('PRESENCIAL'),
  tipoVendedor: z.enum(['AUTONOMO', 'EMPRESA']).default('AUTONOMO'),
});
