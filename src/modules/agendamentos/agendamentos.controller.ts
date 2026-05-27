import { Router } from 'express';
import { requireAuth, AuthenticatedRequest } from '../../middleware/auth';
import { requireRole } from '../../middleware/role';
import { AppError } from '../../lib/errors';
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
  listMeusAgendamentos,
  cancelAgendamentoCliente,
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

  router.get('/meus', requireAuth, async (request, response, next) => {
    try {
      const req = request as AuthenticatedRequest;
      const result = await listMeusAgendamentos(req.auth!.userId, req.auth!.email);
      response.json(result);
    } catch (error) {
      next(error);
    }
  });

  router.put('/:id', requireAuth, async (request, response, next) => {
    try {
      const req = request as AuthenticatedRequest;
      const { id } = agendamentoIdParamSchema.parse(request.params);
      const payload = updateAgendamentoSchema.parse(request.body);
      
      if (req.auth!.role === 'CLIENTE') {
        if (payload.status !== 'CANCELADO') {
          throw new AppError('Clientes so podem cancelar agendamentos.', 403);
        }
        const result = await cancelAgendamentoCliente(req.auth!.email, id);
        response.json(result);
      } else {
        const result = await updateAgendamento(req.auth!.userId, id, payload);
        response.json(result);
      }
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
