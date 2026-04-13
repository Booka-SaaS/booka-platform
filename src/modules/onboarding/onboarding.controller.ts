import { Router } from 'express';
import { requireAuth, AuthenticatedRequest } from '../../middleware/auth';
import { requireRole } from '../../middleware/role';
import { finalizeOnboardingSchema } from './onboarding.schema';
import { finalizeOnboarding } from './onboarding.service';

export function buildOnboardingRouter() {
  const router = Router();

  router.use(requireAuth, requireRole('PROFISSIONAL'));

  router.post('/finalizar', async (request, response, next) => {
    try {
      const authenticatedRequest = request as AuthenticatedRequest;
      const payload = finalizeOnboardingSchema.parse(request.body);
      const result = await finalizeOnboarding(authenticatedRequest.auth!.userId, payload);
      response.json(result);
    } catch (error) {
      next(error);
    }
  });

  return router;
}
