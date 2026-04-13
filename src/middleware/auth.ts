import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UserRole } from '@prisma/client';
import { env } from '../config/env';
import { AppError } from '../lib/errors';

type AuthPayload = {
  sub: string;
  role: UserRole;
  email: string;
};

export type AuthenticatedRequest = Request & {
  auth?: {
    userId: string;
    role: UserRole;
    email: string;
  };
};

export function requireAuth(request: Request, _response: Response, next: NextFunction) {
  const authHeader = request.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return next(new AppError('Token de autenticacao ausente.', 401));
  }

  const token = authHeader.slice('Bearer '.length).trim();

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as AuthPayload;
    const authenticatedRequest = request as AuthenticatedRequest;

    authenticatedRequest.auth = {
      userId: payload.sub,
      role: payload.role,
      email: payload.email,
    };

    return next();
  } catch {
    return next(new AppError('Token de autenticacao invalido.', 401));
  }
}
