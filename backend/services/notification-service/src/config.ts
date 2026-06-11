import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NOTIFICATION_SERVICE_PORT: z.coerce.number().int().positive().default(3002),
  CLIENT_ORIGIN: z.string().url().default('http://localhost:4200'),
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(16),
  RABBITMQ_URL: z.string().min(1).default('amqp://guest:guest@127.0.0.1:5672'),
});

export const notificationEnv = envSchema.parse(process.env);

