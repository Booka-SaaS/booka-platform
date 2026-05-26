import { Router } from 'express';
import { requireAuth, AuthenticatedRequest } from '../../middleware/auth';
import { requireRole } from '../../middleware/role';
import {
  agendamentoIdParamSchema,
  createAgendamentoPublicoSchema,
  createAgendamentoSchema,
  listAgendamentosQuerySchema,
  updateAgendamentoSchema,
} from './agendamentos.schema';
import {
  createAgendamento,
  createPublicAgendamento,
  deleteAgendamento,
  listAgendamentos,
  updateAgendamento,
} from './agendamentos.service';

export function buildAgendamentosRouter() {
  const router = Router();

  router.post('/publicos', async (request, response, next) => {
    try {
      const payload = createAgendamentoPublicoSchema.parse(request.body);
      const result = await createPublicAgendamento(payload);
      response.status(201).json(result);
    } catch (error) {
      next(error);
    }
  });

  router.use(requireAuth, requireRole('PROFISSIONAL'));

  router.get('/', async (request, response, next) => {
    try {
      const authenticatedRequest = request as AuthenticatedRequest;
      const query = listAgendamentosQuerySchema.parse(request.query);
      const result = await listAgendamentos(authenticatedRequest.auth!.userId, query);
      response.json(result);
    } catch (error) {
      next(error);
    }
  });

  router.post('/', async (request, response, next) => {
    try {
      const authenticatedRequest = request as AuthenticatedRequest;
      const payload = createAgendamentoSchema.parse(request.body);
      const result = await createAgendamento(authenticatedRequest.auth!.userId, payload);
      response.status(201).json(result);
    } catch (error) {
      next(error);
    }
  });

  router.put('/:id', async (request, response, next) => {
    try {
      const authenticatedRequest = request as AuthenticatedRequest;
      const { id } = agendamentoIdParamSchema.parse(request.params);
      const payload = updateAgendamentoSchema.parse(request.body);
      const result = await updateAgendamento(authenticatedRequest.auth!.userId, id, payload);
      response.json(result);
    } catch (error) {
      next(error);
    }
  });

  router.delete('/:id', async (request, response, next) => {
    try {
      const authenticatedRequest = request as AuthenticatedRequest;
      const { id } = agendamentoIdParamSchema.parse(request.params);
      const result = await deleteAgendamento(authenticatedRequest.auth!.userId, id);
      response.json(result);
    } catch (error) {
      next(error);
    }
  });

  return router;
}
