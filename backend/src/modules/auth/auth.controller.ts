import { Router } from 'express';
import { requireAuth, AuthenticatedRequest } from '../../middleware/auth';
import { getMe, login, register } from './auth.service';
import { loginSchema, registerSchema } from './auth.schema';

export function buildAuthRouter() {
  const router = Router();

  router.post('/register', async (request, response, next) => {
    try {
      const input = registerSchema.parse(request.body);
      const result = await register(input);
      response.status(201).json(result);
    } catch (error) {
      next(error);
    }
  });

  router.post('/login', async (request, response, next) => {
    try {
      const input = loginSchema.parse(request.body);
      const result = await login(input.email, input.password);
      response.json(result);
    } catch (error) {
      next(error);
    }
  });

  router.get('/me', requireAuth, async (request, response, next) => {
    try {
      const authenticatedRequest = request as AuthenticatedRequest;
      const result = await getMe(authenticatedRequest.auth!.userId);
      response.json(result);
    } catch (error) {
      next(error);
    }
  });

  return router;
}
