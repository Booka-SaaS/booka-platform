import { Router } from 'express';
import { requireAuth, AuthenticatedRequest } from '../../middleware/auth';
import { requireRole } from '../../middleware/role';
import { createServicoSchema, servicoIdParamSchema, updateServicoSchema } from './servicos.schema';
import { createServico, deleteServico, listServicos, updateServico } from './servicos.service';

export function buildServicosRouter() {
  const router = Router();

  router.use(requireAuth, requireRole('PROFISSIONAL'));

  router.get('/', async (request, response, next) => {
    try {
      const authenticatedRequest = request as AuthenticatedRequest;
      const result = await listServicos(authenticatedRequest.auth!.userId);
      response.json(result);
    } catch (error) {
      next(error);
    }
  });

  router.post('/', async (request, response, next) => {
    try {
      const authenticatedRequest = request as AuthenticatedRequest;
      const payload = createServicoSchema.parse(request.body);
      const result = await createServico(authenticatedRequest.auth!.userId, payload);
      response.status(201).json(result);
    } catch (error) {
      next(error);
    }
  });

  router.put('/:id', async (request, response, next) => {
    try {
      const authenticatedRequest = request as AuthenticatedRequest;
      const { id } = servicoIdParamSchema.parse(request.params);
      const payload = updateServicoSchema.parse(request.body);
      const result = await updateServico(authenticatedRequest.auth!.userId, id, payload);
      response.json(result);
    } catch (error) {
      next(error);
    }
  });

  router.delete('/:id', async (request, response, next) => {
    try {
      const authenticatedRequest = request as AuthenticatedRequest;
      const { id } = servicoIdParamSchema.parse(request.params);
      const result = await deleteServico(authenticatedRequest.auth!.userId, id);
      response.json(result);
    } catch (error) {
      next(error);
    }
  });

  return router;
}
