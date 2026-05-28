import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import { ZodError } from 'zod';
import { env } from './config/env';
import { openApiDocument } from './docs/openapi';
import { prisma } from './lib/db';
import { AppError } from './lib/errors';
import { buildAuthRouter } from './modules/auth/auth.controller';
import { buildOnboardingRouter } from './modules/onboarding/onboarding.controller';
import { buildLojaRouter } from './modules/loja/loja.controller';
import { buildServicosRouter } from './modules/servicos/servicos.controller';
import { buildClientesRouter } from './modules/clientes/clientes.controller';
import { buildAgendamentosRouter } from './modules/agendamentos/agendamentos.controller';
import { buildProfissionaisRouter } from './modules/profissionais/profissionais.controller';
import { buildDashboardRouter } from './modules/dashboard/dashboard.controller';
import { buildBloqueiosRouter } from './modules/bloqueios/bloqueios.controller';
import { buildDisponibilidadeRouter } from './modules/disponibilidade/disponibilidade.controller';
import { buildUploadRouter } from './modules/upload/upload.controller';

export function buildApp() {
  const app = express();

  app.use(
    cors({
      origin: env.CLIENT_ORIGINS,
    }),
  );
  app.use(express.json());
  app.use('/uploads', express.static(path.resolve(process.cwd(), 'uploads')));

  app.get('/health', (_request, response) => {
    response.json({
      status: 'ok',
      service: 'booka-api',
    });
  });

  app.get('/test/db-status', async (_request, response) => {
    try {
      await prisma.$queryRaw`SELECT 1`;
      response.json({
        database: 'connected',
        status: 'ok',
      });
    } catch (error) {
      const diagnostic: Record<string, any> = {
        database: 'disconnected',
        status: 'error',
        message: 'Nao foi possivel conectar ao banco de dados.',
      };

      if (env.NODE_ENV !== 'production') {
        console.error('Falha ao testar conexao com o banco:', error);
      }

      // Add secure diagnostic info without exposing secrets
      if (error instanceof Error && 'code' in error && typeof error.code === 'string') {
        diagnostic.errorCode = error.code; // Prisma error code (e.g., P1000, P1001)
      }
      if (process.env.DATABASE_URL) {
        try {
          const url = new URL(process.env.DATABASE_URL);
          diagnostic.dbHost = url.host.split(':')[0]; // Mask port and credentials
        } catch (e) {
          // Ignore URL parsing errors if DATABASE_URL is malformed
        }
      }

      diagnostic.hasDatabaseUrl = !!process.env.DATABASE_URL;
      diagnostic.hasDirectUrl = !!process.env.DIRECT_URL;

      response.status(503).json({
        ...diagnostic,
      });
    }
  });

  app.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiDocument));
  app.use('/auth', buildAuthRouter());
  app.use('/onboarding', buildOnboardingRouter());
  app.use('/loja', buildLojaRouter());
  app.use('/servicos', buildServicosRouter());
  app.use('/clientes', buildClientesRouter());
  app.use('/agendamentos', buildAgendamentosRouter());
  app.use('/profissionais', buildProfissionaisRouter());
  app.use('/dashboard', buildDashboardRouter());
  app.use('/bloqueios', buildBloqueiosRouter());
  app.use('/disponibilidade', buildDisponibilidadeRouter());
  app.use('/upload', buildUploadRouter());

  app.use((_request, response) => {
    response.status(404).json({
      message: 'Rota nao encontrada.',
    });
  });

  app.use((error: Error, _request: Request, response: Response, next: NextFunction) => {
    if (response.headersSent) {
      return next(error);
    }

    if (error instanceof ZodError) {
      return response.status(400).json({
        message: 'Erro de validacao.',
        issues: error.flatten(),
      });
    }

    if (error instanceof AppError) {
      return response.status(error.statusCode).json({
        message: error.message,
      });
    }

    console.error(error);

    return response.status(500).json({
      message: 'Erro interno no servidor.',
    });
  });

  return app;
}
