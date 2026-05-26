import { Router } from 'express';
import { requireAuth, AuthenticatedRequest } from '../../middleware/auth';
import { requireRole } from '../../middleware/role';
import { getOwnLoja, updateOwnLoja } from './loja.service';
import { updateLojaSchema } from './loja.schema';

export function buildLojaRouter() {
  const router = Router();

  router.use(requireAuth, requireRole('PROFISSIONAL'));

  router.get('/', async (request, response, next) => {
    try {
      const authenticatedRequest = request as AuthenticatedRequest;
      const loja = await getOwnLoja(authenticatedRequest.auth!.userId);
      response.json(loja);
    } catch (error) {
      next(error);
    }
  });

  router.put('/', async (request, response, next) => {
    try {
      const authenticatedRequest = request as AuthenticatedRequest;
      const payload = updateLojaSchema.parse(request.body);
      const loja = await updateOwnLoja(authenticatedRequest.auth!.userId, payload);
      response.json(loja);
    } catch (error) {
      next(error);
    }
  });

  return router;
}
