import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const optionalString = z.preprocess((value) => (value === '' ? undefined : value), z.string().optional());
const optionalUrl = z.preprocess((value) => (value === '' ? undefined : value), z.string().url().optional());

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3001),
  FRONTEND_URL: optionalUrl,
  CLIENT_ORIGIN: optionalUrl,
  CLIENT_ORIGINS: optionalString,
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(16),
  JWT_TTL_SECONDS: z.coerce.number().int().positive().default(604800),
  SUPABASE_URL: optionalUrl,
  SUPABASE_ANON_KEY: optionalString,
  SUPABASE_SERVICE_ROLE_KEY: optionalString,
  GOOGLE_CLIENT_ID: optionalString,
  RESEND_API_KEY: z.string().min(1).default('re_placeholder'),
  EMAIL_FROM: z.string().min(1).default('Booka <noreply@booka.app>'),
});

const parsedEnv = envSchema.parse(process.env);

const defaultClientOrigins = ['http://localhost:4200', 'http://localhost:5173', 'http://localhost:3000'];

const configuredOrigins =
  parsedEnv.CLIENT_ORIGINS ??
  parsedEnv.FRONTEND_URL ??
  parsedEnv.CLIENT_ORIGIN ??
  defaultClientOrigins.join(',');

const clientOrigins = configuredOrigins
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

export const env = {
  ...parsedEnv,
  CLIENT_ORIGINS: z.array(z.string().url()).nonempty().parse(clientOrigins),
};
