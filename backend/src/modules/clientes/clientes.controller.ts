import { Router } from 'express';
import { requireAuth, AuthenticatedRequest } from '../../middleware/auth';
import { requireRole } from '../../middleware/role';
import { clienteIdParamSchema, createClienteSchema, updateClienteSchema } from './clientes.schema';
import { createCliente, deleteCliente, getCliente, listClientes, updateCliente } from './clientes.service';

export function buildClientesRouter() {
  const router = Router();

  router.use(requireAuth, requireRole('PROFISSIONAL'));

  router.get('/', async (request, response, next) => {
    try {
      const authenticatedRequest = request as AuthenticatedRequest;
      const result = await listClientes(authenticatedRequest.auth!.userId);
      response.json(result);
    } catch (error) {
      next(error);
    }
  });

  router.get('/:id', async (request, response, next) => {
    try {
      const authenticatedRequest = request as AuthenticatedRequest;
      const { id } = clienteIdParamSchema.parse(request.params);
      const result = await getCliente(authenticatedRequest.auth!.userId, id);
      response.json(result);
    } catch (error) {
      next(error);
    }
  });

  router.post('/', async (request, response, next) => {
    try {
      const authenticatedRequest = request as AuthenticatedRequest;
      const payload = createClienteSchema.parse(request.body);
      const result = await createCliente(authenticatedRequest.auth!.userId, payload);
      response.status(201).json(result);
    } catch (error) {
      next(error);
    }
  });

  router.put('/:id', async (request, response, next) => {
    try {
      const authenticatedRequest = request as AuthenticatedRequest;
      const { id } = clienteIdParamSchema.parse(request.params);
      const payload = updateClienteSchema.parse(request.body);
      const result = await updateCliente(authenticatedRequest.auth!.userId, id, payload);
      response.json(result);
    } catch (error) {
      next(error);
    }
  });

  router.delete('/:id', async (request, response, next) => {
    try {
      const authenticatedRequest = request as AuthenticatedRequest;
      const { id } = clienteIdParamSchema.parse(request.params);
      const result = await deleteCliente(authenticatedRequest.auth!.userId, id);
      response.json(result);
    } catch (error) {
      next(error);
    }
  });

  return router;
}
