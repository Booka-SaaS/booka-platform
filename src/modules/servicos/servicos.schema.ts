import { z } from 'zod';

export const createServicoSchema = z.object({
  nome: z.string().trim().min(2),
  descricao: z.string().trim().min(2).nullable().optional(),
  duracaoMinutos: z.coerce.number().int().positive(),
  preco: z.coerce.number().positive(),
  ativo: z.boolean().optional(),
});

export const updateServicoSchema = createServicoSchema.partial();
