import { z } from 'zod';

export const clienteIdParamSchema = z.object({
  id: z.string().uuid(),
});

export const createClienteSchema = z.object({
  nome: z.string().trim().min(2),
  email: z.string().trim().email().nullable().optional(),
  telefone: z.string().trim().min(8),
  anotacoes: z.string().trim().min(2).nullable().optional(),
  observacoes: z.string().trim().min(2).nullable().optional(),
});

export const updateClienteSchema = createClienteSchema.partial();
