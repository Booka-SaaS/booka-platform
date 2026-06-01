import { z } from 'zod';

export const updateLojaSchema = z.object({
  nome: z.string().trim().min(2).optional(),
  email: z.string().trim().email().nullable().optional(),
  telefone: z.string().trim().min(8).nullable().optional(),
  endereco: z.string().trim().min(5).nullable().optional(),
  cidade: z.string().trim().min(2).nullable().optional(),
  descricao: z.string().trim().min(3).nullable().optional(),
  imagemUrl: z.string().trim().nullable().optional(),
  profissao: z.string().trim().min(2).optional(),
  categoriaPrincipal: z.string().trim().min(2).optional(),
  modalidadePrincipal: z.enum(['ONLINE', 'PRESENCIAL', 'HIBRIDO']).optional(),
  tipoVendedor: z.enum(['AUTONOMO', 'EMPRESA']).optional(),
});
