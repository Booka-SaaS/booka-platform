import { buildApp } from './app';
import { env } from './config/env';
import { prisma } from './lib/db';

async function bootstrap() {
  const app = buildApp();
  const server = app.listen(env.PORT, () => {
    console.log(`Booka Backend V2 rodando em http://localhost:${env.PORT}`);
  });

  const shutdown = async () => {
    await prisma.$disconnect();
    server.close(() => process.exit(0));
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

bootstrap().catch(async (error) => {
  console.error('Erro ao iniciar a API:', error);
  await prisma.$disconnect();
  process.exit(1);
});
