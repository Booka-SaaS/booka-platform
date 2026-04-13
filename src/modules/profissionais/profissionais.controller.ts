import { Router } from 'express';
import { z } from 'zod';
import {
  getProfissionalDetalhe,
  getProfissionalDisponibilidade,
  listProfissionais,
} from './profissionais.service';

const profissionaisQuerySchema = z.object({
  q: z.string().optional(),
  cidade: z.string().optional(),
  categoria: z.string().optional(),
  modalidade: z.string().optional(),
  precoMax: z.coerce.number().positive().optional(),
  avaliacaoMinima: z.coerce.number().min(0).max(5).optional(),
});

const disponibilidadeQuerySchema = z.object({
  data: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export function buildProfissionaisRouter() {
  const router = Router();

  router.get('/', async (request, response, next) => {
    try {
      const query = profissionaisQuerySchema.parse(request.query);
      const result = await listProfissionais(query);
      response.json(result);
    } catch (error) {
      next(error);
    }
  });

  router.get('/:id/disponibilidade', async (request, response, next) => {
    try {
      const query = disponibilidadeQuerySchema.parse(request.query);
      const result = await getProfissionalDisponibilidade(request.params.id, query.data);
      response.json(result);
    } catch (error) {
      next(error);
    }
  });

  router.get('/:id', async (request, response, next) => {
    try {
      const result = await getProfissionalDetalhe(request.params.id);
      response.json(result);
    } catch (error) {
      next(error);
    }
  });

  return router;
}
