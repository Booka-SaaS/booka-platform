import { z } from 'zod';

export const updateLojaSchema = z.object({
  nome: z.string().trim().min(2).optional(),
  email: z.string().trim().email().nullable().optional(),
  telefone: z.string().trim().min(8).nullable().optional(),
  endereco: z.string().trim().nullable().optional(),
  cep: z.string().trim().length(8).nullable().optional(),
  logradouro: z.string().trim().min(2).nullable().optional(),
  numero: z.string().trim().min(1).nullable().optional(),
  bairro: z.string().trim().min(2).nullable().optional(),
  complemento: z.string().trim().nullable().optional(),
  estado: z.string().trim().length(2).nullable().optional(),
  cidade: z.string().trim().min(2).nullable().optional(),
  descricao: z.string().trim().min(3).nullable().optional(),
  imagemUrl: z.string().trim().nullable().optional(),
  profissao: z.string().trim().min(2).optional(),
  categoriaPrincipal: z.string().trim().min(2).optional(),
  modalidadePrincipal: z.enum(['ONLINE', 'PRESENCIAL', 'HIBRIDO']).optional(),
  tipoVendedor: z.enum(['AUTONOMO', 'EMPRESA']).optional(),
});
