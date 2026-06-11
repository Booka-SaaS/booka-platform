import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import path from 'path';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import { ZodError } from 'zod';
import { env } from './config/env';
import { openApiDocument } from './docs/openapi';
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

  app.use(helmet());
  app.use(
    cors({
      origin: true,
    }),
  );
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 300,
      standardHeaders: 'draft-8',
      legacyHeaders: false,
    }),
  );
  app.use(express.json());
  app.use('/uploads', express.static(path.resolve(process.cwd(), 'uploads')));

  app.get('/health', (_request, response) => {
    response.json({
      name: 'Booka Backend V2',
      status: 'ok',
      docs: '/docs',
    });
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
