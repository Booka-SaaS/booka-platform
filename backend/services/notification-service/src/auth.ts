import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import jwt from 'jsonwebtoken';
import { notificationEnv } from './config';

export type AuthUser = {
  userId: string;
  email: string;
  role: 'CLIENTE' | 'PROFISSIONAL';
};

type JwtPayload = {
  sub: string;
  email: string;
  role: 'CLIENTE' | 'PROFISSIONAL';
};

export function verifyBearerToken(token: string): AuthUser {
  const payload = jwt.verify(token, notificationEnv.JWT_SECRET) as JwtPayload;
  return {
    userId: payload.sub,
    email: payload.email,
    role: payload.role,
  };
}

@Injectable()
export class BearerAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token de autenticacao ausente.');
    }

    try {
      request.auth = verifyBearerToken(authHeader.slice('Bearer '.length).trim());
      return true;
    } catch {
      throw new UnauthorizedException('Token de autenticacao invalido.');
    }
  }
}

