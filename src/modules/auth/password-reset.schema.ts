import { z } from 'zod';

export const requestPasswordResetSchema = z.object({
  email: z.string().trim().email(),
});

export const resetPasswordSchema = z.object({
  token: z.string().trim().min(1),
  novaSenha: z.string().min(8),
});
