import { Router } from 'express';
import { requireAuth, AuthenticatedRequest } from '../../middleware/auth';
import { requireRole } from '../../middleware/role';
import { bloqueioIdParamSchema, createBloqueioSchema, createBloqueiosLoteSchema, updateBloqueioSchema } from './bloqueios.schema';
import { createBloqueio, createBloqueiosLote, deleteBloqueio, getBloqueio, listBloqueios, updateBloqueio } from './bloqueios.service';

export function buildBloqueiosRouter() {
  const router = Router();

  router.use(requireAuth, requireRole('PROFISSIONAL'));

  router.get('/', async (request, response, next) => {
    try {
      const authenticatedRequest = request as AuthenticatedRequest;
      const result = await listBloqueios(authenticatedRequest.auth!.userId);
      response.json(result);
    } catch (error) {
      next(error);
    }
  });

  router.post('/lote', async (request, response, next) => {
    try {
      const authenticatedRequest = request as AuthenticatedRequest;
      const payload = createBloqueiosLoteSchema.parse(request.body);
      const result = await createBloqueiosLote(authenticatedRequest.auth!.userId, payload.bloqueios);
      response.status(201).json(result);
    } catch (error) {
      next(error);
    }
  });

  router.get('/:id', async (request, response, next) => {
    try {
      const authenticatedRequest = request as AuthenticatedRequest;
      const { id } = bloqueioIdParamSchema.parse(request.params);
      const result = await getBloqueio(authenticatedRequest.auth!.userId, id);
      response.json(result);
    } catch (error) {
      next(error);
    }
  });

  router.post('/', async (request, response, next) => {
    try {
      const authenticatedRequest = request as AuthenticatedRequest;
      const payload = createBloqueioSchema.parse(request.body);
      const result = await createBloqueio(authenticatedRequest.auth!.userId, payload);
      response.status(201).json(result);
    } catch (error) {
      next(error);
    }
  });

  router.put('/:id', async (request, response, next) => {
    try {
      const authenticatedRequest = request as AuthenticatedRequest;
      const { id } = bloqueioIdParamSchema.parse(request.params);
      const payload = updateBloqueioSchema.parse(request.body);
      const result = await updateBloqueio(authenticatedRequest.auth!.userId, id, payload);
      response.json(result);
    } catch (error) {
      next(error);
    }
  });

  router.delete('/:id', async (request, response, next) => {
    try {
      const authenticatedRequest = request as AuthenticatedRequest;
      const { id } = bloqueioIdParamSchema.parse(request.params);
      const result = await deleteBloqueio(authenticatedRequest.auth!.userId, id);
      response.json(result);
    } catch (error) {
      next(error);
    }
  });

  return router;
}
