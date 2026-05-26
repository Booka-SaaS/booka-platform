import { z } from 'zod';

export const registerSchema = z.object({
  nome: z.string().trim().min(3),
  email: z.string().trim().email(),
  password: z.string().min(8),
  role: z.enum(['CLIENTE', 'PROFISSIONAL']).default('CLIENTE'),
});

export const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});
