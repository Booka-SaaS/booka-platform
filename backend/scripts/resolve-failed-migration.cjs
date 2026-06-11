const { spawnSync } = require('node:child_process');
const { PrismaClient } = require('@prisma/client');

const FAILED_MIGRATION = '20260527000000_add_password_reset_and_notificacao';

async function main() {
  const prisma = new PrismaClient();

  try {
    const rows = await prisma.$queryRaw`
      SELECT migration_name
      FROM "_prisma_migrations"
      WHERE migration_name = ${FAILED_MIGRATION}
        AND finished_at IS NULL
        AND rolled_back_at IS NULL
      LIMIT 1
    `;

    if (!Array.isArray(rows) || rows.length === 0) {
      console.log(`[prisma] No failed migration record found for ${FAILED_MIGRATION}.`);
      return;
    }

    console.log(`[prisma] Resolving failed migration ${FAILED_MIGRATION} as applied.`);
    const result = spawnSync(
      process.platform === 'win32' ? 'npx.cmd' : 'npx',
      ['prisma', 'migrate', 'resolve', '--applied', FAILED_MIGRATION],
      { stdio: 'inherit' },
    );

    if (result.status !== 0) {
      process.exit(result.status ?? 1);
    }
  } catch (error) {
    if (error && error.code === 'P2021') {
      console.log('[prisma] _prisma_migrations table not found; skipping migration resolve.');
      return;
    }

    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error('[prisma] Failed to inspect/resolve migration state:', error);
  process.exit(1);
});
