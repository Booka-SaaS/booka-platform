import { z } from 'zod';

export const bloqueioIdParamSchema = z.object({
  id: z.string().uuid(),
});

export const createBloqueioSchema = z
  .object({
    inicio: z.string().datetime(),
    fim: z.string().datetime(),
    motivo: z.string().trim().min(2).nullable().optional(),
  })
  .refine((payload) => new Date(payload.fim) > new Date(payload.inicio), {
    message: 'Fim deve ser posterior ao inicio.',
    path: ['fim'],
  });

export const updateBloqueioSchema = z.object({
  inicio: z.string().datetime().optional(),
  fim: z.string().datetime().optional(),
  motivo: z.string().trim().min(2).nullable().optional(),
});
