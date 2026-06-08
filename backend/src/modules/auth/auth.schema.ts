import { z } from 'zod';

export const registerSchema = z.object({
  nome: z.string().trim().min(3),
  email: z.string().trim().email(),
  password: z.string().min(8),
  role: z.enum(['CLIENTE', 'PROFISSIONAL']).default('CLIENTE'),
  endereco: z.object({
    cep: z.string().trim().length(8),
    logradouro: z.string().trim().min(2),
    numero: z.string().trim().min(1),
    bairro: z.string().trim().min(2),
    complemento: z.string().trim().optional(),
    cidade: z.string().trim().min(2),
    estado: z.string().trim().length(2),
  }).optional(),
});

export const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});

export const googleLoginSchema = z.object({
  credential: z.string().min(10),
});

export const updateMeSchema = z.object({
  nome: z.string().trim().min(2).optional(),
  email: z.string().trim().email().optional(),
});

export const updateSenhaSchema = z.object({
  senhaAtual: z.string().min(1),
  novaSenha: z.string().min(8),
});
