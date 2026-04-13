import { NextFunction, Request, Response } from 'express';
import { UserRole } from '@prisma/client';
import { AppError } from '../lib/errors';
import { AuthenticatedRequest } from './auth';

export function requireRole(...roles: UserRole[]) {
  return (request: Request, _response: Response, next: NextFunction) => {
    const authenticatedRequest = request as AuthenticatedRequest;

    if (!authenticatedRequest.auth) {
      return next(new AppError('Usuario nao autenticado.', 401));
    }

    if (!roles.includes(authenticatedRequest.auth.role)) {
      return next(new AppError('Usuario sem permissao para esta operacao.', 403));
    }

    return next();
  };
}
