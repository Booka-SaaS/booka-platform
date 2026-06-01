import { Router } from 'express';
import { requireAuth, AuthenticatedRequest } from '../../middleware/auth';
import { getMe, login, loginWithGoogle, register, requestPasswordReset, resetPassword, updateMe, updateSenha } from './auth.service';
import { googleLoginSchema, loginSchema, registerSchema, updateMeSchema, updateSenhaSchema } from './auth.schema';
import { requestPasswordResetSchema, resetPasswordSchema } from './password-reset.schema';

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

  router.post('/google', async (request, response, next) => {
    try {
      const input = googleLoginSchema.parse(request.body);
      const result = await loginWithGoogle(input.credential);
      response.json(result);
    } catch (error) {
      next(error);
    }
  });

  router.post('/recuperar-senha', async (request, response, next) => {
    try {
      const { email } = requestPasswordResetSchema.parse(request.body);
      const result = await requestPasswordReset(email);
      response.json(result);
    } catch (error) {
      next(error);
    }
  });

  router.post('/nova-senha', async (request, response, next) => {
    try {
      const { token, novaSenha } = resetPasswordSchema.parse(request.body);
      const result = await resetPassword(token, novaSenha);
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

  router.put('/me', requireAuth, async (request, response, next) => {
    try {
      const req = request as AuthenticatedRequest;
      const payload = updateMeSchema.parse(request.body);
      const result = await updateMe(req.auth!.userId, payload);
      response.json(result);
    } catch (error) {
      next(error);
    }
  });

  router.put('/senha', requireAuth, async (request, response, next) => {
    try {
      const req = request as AuthenticatedRequest;
      const { senhaAtual, novaSenha } = updateSenhaSchema.parse(request.body);
      const result = await updateSenha(req.auth!.userId, senhaAtual, novaSenha);
      response.json(result);
    } catch (error) {
      next(error);
    }
  });

  return router;
}
