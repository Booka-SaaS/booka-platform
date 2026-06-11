import crypto from 'crypto';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import { createProxyMiddleware } from 'http-proxy-middleware';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  GATEWAY_PORT: z.coerce.number().int().positive().default(3000),
  CLIENT_ORIGIN: z.string().url().default('http://localhost:4200'),
  CORE_API_URL: z.string().url().default('http://localhost:3001'),
  NOTIFICATION_SERVICE_URL: z.string().url().default('http://localhost:3002'),
});

const env = envSchema.parse(process.env);
const app = express();

app.use(helmet());
app.use(cors({ origin: env.CLIENT_ORIGIN }));
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
  }),
);

app.use((request, response, next) => {
  const requestId = request.header('x-request-id') ?? crypto.randomUUID();
  response.setHeader('x-request-id', requestId);
  console.log(`[gateway] ${requestId} ${request.method} ${request.originalUrl}`);
  next();
});

app.get('/health', (_request, response) => {
  response.json({
    name: 'Booka API Gateway',
    status: 'ok',
    coreApi: env.CORE_API_URL,
    notificationService: env.NOTIFICATION_SERVICE_URL,
  });
});

const coreProxy = createProxyMiddleware({
  target: env.CORE_API_URL,
  changeOrigin: true,
  pathRewrite: { '^/api': '' },
});

const notificationProxy = createProxyMiddleware({
  target: env.NOTIFICATION_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: { '^/api': '' },
});

app.use('/api/notifications', notificationProxy);
app.use('/soap/notifications', createProxyMiddleware({
  target: env.NOTIFICATION_SERVICE_URL,
  changeOrigin: true,
}));
app.use('/api', coreProxy);

app.listen(env.GATEWAY_PORT, () => {
  console.log(`[gateway] listening on http://localhost:${env.GATEWAY_PORT}`);
});

