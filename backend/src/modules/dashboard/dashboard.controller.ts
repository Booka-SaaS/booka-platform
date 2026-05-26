import { Router } from 'express';
import { requireAuth, AuthenticatedRequest } from '../../middleware/auth';
import { requireRole } from '../../middleware/role';
import { getDashboardResumo } from './dashboard.service';

export function buildDashboardRouter() {
  const router = Router();

  router.use(requireAuth, requireRole('PROFISSIONAL'));

  router.get('/resumo', async (request, response, next) => {
    try {
      const authenticatedRequest = request as AuthenticatedRequest;
      const result = await getDashboardResumo(authenticatedRequest.auth!.userId);
      response.json(result);
    } catch (error) {
      next(error);
    }
  });

  return router;
}
