import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { notificationEnv } from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: false });

  app.use(helmet());
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 300,
      standardHeaders: 'draft-8',
      legacyHeaders: false,
    }),
  );
  app.enableCors({
    origin: notificationEnv.CLIENT_ORIGIN,
    credentials: true,
  });
  app.use('/soap/notifications', express.text({ type: ['text/xml', 'application/xml', 'application/soap+xml', '*/*'] }));
  app.use(express.json());

  await app.listen(notificationEnv.NOTIFICATION_SERVICE_PORT);
  console.log(`[notification-service] HTTP na porta ${notificationEnv.NOTIFICATION_SERVICE_PORT}`);
}

bootstrap();
