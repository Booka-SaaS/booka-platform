import { z } from 'zod';

export const finalizeOnboardingSchema = z.object({
  nome: z.string().trim().min(2),
  telefone: z.string().trim().min(8),
  endereco: z.string().trim().min(5),
  cidade: z.string().trim().min(2).optional(),
  descricao: z.string().trim().min(3).optional(),
  profissao: z.string().trim().min(2),
  categoriaPrincipal: z.string().trim().min(2),
  modalidadePrincipal: z.enum(['ONLINE', 'PRESENCIAL', 'HIBRIDO']).default('PRESENCIAL'),
  tipoVendedor: z.enum(['AUTONOMO', 'EMPRESA']).default('AUTONOMO'),
});
