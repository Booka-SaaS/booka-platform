import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3001),
  CLIENT_ORIGIN: z.string().url().optional(),
  CLIENT_ORIGINS: z.string().optional(),
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(16),
  JWT_TTL_SECONDS: z.coerce.number().int().positive().default(604800),
});

const parsedEnv = envSchema.parse(process.env);

const defaultClientOrigins = ['http://localhost:4200', 'http://localhost:5173', 'http://localhost:3000'];

const clientOrigins = (parsedEnv.CLIENT_ORIGINS ?? parsedEnv.CLIENT_ORIGIN ?? defaultClientOrigins.join(','))
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

export const env = {
  ...parsedEnv,
  CLIENT_ORIGINS: z.array(z.string().url()).nonempty().parse(clientOrigins),
};
