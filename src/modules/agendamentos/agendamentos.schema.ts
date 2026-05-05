import { z } from 'zod';

export const agendamentoIdParamSchema = z.object({
  id: z.string().uuid(),
});

export const listAgendamentosQuerySchema = z.object({
  data: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  status: z.enum(['PENDENTE', 'CONFIRMADO', 'CANCELADO', 'CONCLUIDO']).optional(),
  clienteId: z.string().uuid().optional(),
  servicoId: z.string().uuid().optional(),
});

export const createAgendamentoSchema = z.object({
  clienteId: z.string().uuid(),
  servicoId: z.string().uuid(),
  inicio: z.string().datetime(),
  observacoes: z.string().trim().min(2).nullable().optional(),
  status: z.enum(['PENDENTE', 'CONFIRMADO', 'CANCELADO', 'CONCLUIDO']).optional(),
});

export const updateAgendamentoSchema = z.object({
  clienteId: z.string().uuid().optional(),
  servicoId: z.string().uuid().optional(),
  inicio: z.string().datetime().optional(),
  observacoes: z.string().trim().min(2).nullable().optional(),
  status: z.enum(['PENDENTE', 'CONFIRMADO', 'CANCELADO', 'CONCLUIDO']).optional(),
});

export const createAgendamentoPublicoSchema = z.object({
  lojaId: z.string().uuid(),
  servicoId: z.string().uuid(),
  inicio: z.string().datetime(),
  observacoes: z.string().trim().min(2).nullable().optional(),
  cliente: z.object({
    nome: z.string().trim().min(2),
    email: z.string().trim().email().nullable().optional(),
    telefone: z.string().trim().min(8),
  }),
});
