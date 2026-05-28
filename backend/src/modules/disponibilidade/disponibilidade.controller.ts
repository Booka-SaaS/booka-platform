import { Router } from 'express';
import { z } from 'zod';
import { requireAuth, AuthenticatedRequest } from '../../middleware/auth';
import { requireRole } from '../../middleware/role';
import { getPanelDisponibilidade, setPanelDisponibilidade } from './disponibilidade.service';

const disponibilidadeItemSchema = z.object({
  diaSemana: z.number().int().min(0).max(6),
  horaInicio: z.string().regex(/^\d{2}:\d{2}$/, 'Formato HH:MM invalido'),
  horaFim: z.string().regex(/^\d{2}:\d{2}$/, 'Formato HH:MM invalido'),
  intervaloMinutos: z.number().int().positive().optional(),
  ativo: z.boolean().optional(),
});

const updateDisponibilidadeSchema = z.array(disponibilidadeItemSchema).min(1);

export function buildDisponibilidadeRouter() {
  const router = Router();

  router.use(requireAuth, requireRole('PROFISSIONAL'));

  router.get('/', async (request, response, next) => {
    try {
      const req = request as AuthenticatedRequest;
      const result = await getPanelDisponibilidade(req.auth!.userId);
      response.json(result);
    } catch (error) {
      next(error);
    }
  });

  router.put('/', async (request, response, next) => {
    try {
      const req = request as AuthenticatedRequest;
      const payload = updateDisponibilidadeSchema.parse(request.body);
      const result = await setPanelDisponibilidade(req.auth!.userId, payload);
      response.json(result);
    } catch (error) {
      next(error);
    }
  });

  return router;
}
