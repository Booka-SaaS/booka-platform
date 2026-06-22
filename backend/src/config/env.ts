import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3001),
  CLIENT_ORIGIN: z.string().url().default('http://localhost:4200'),
  CLIENT_ORIGINS: z.string().optional(),
  GATEWAY_ORIGIN: z.string().url().default('http://localhost:3000'),
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(16),
  JWT_TTL_SECONDS: z.coerce.number().int().positive().default(604800),
  GOOGLE_CLIENT_ID: z.string().min(1).optional(),
  RESEND_API_KEY: z.string().min(1).default('re_placeholder'),
  EMAIL_FROM: z.string().min(1).default('Booka <noreply@booka.app>'),
  RABBITMQ_URL: z.string().min(1).default('amqp://guest:guest@127.0.0.1:5672'),
});

const parsedEnv = envSchema.parse(process.env);

const clientOrigins = [
  parsedEnv.CLIENT_ORIGIN,
  parsedEnv.GATEWAY_ORIGIN,
  ...(parsedEnv.CLIENT_ORIGINS ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
];

export const env = {
  ...parsedEnv,
  CLIENT_ORIGINS: Array.from(new Set(clientOrigins)),
};
