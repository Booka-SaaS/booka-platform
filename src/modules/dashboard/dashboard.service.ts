import { prisma } from '../../lib/db';
import { AppError } from '../../lib/errors';

function startOfToday() {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0, 0));
}

function endOfToday() {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59, 999));
}

export async function getDashboardResumo(userId: string) {
  const loja = await prisma.loja.findUnique({
    where: { usuarioId: userId },
    select: { id: true, nome: true },
  });

  if (!loja) {
    throw new AppError('Loja nao encontrada.', 404);
  }

  const [clientes, servicos, agendamentosHoje, proximoAgendamento] = await Promise.all([
    prisma.cliente.count({
      where: { lojaId: loja.id },
    }),
    prisma.servico.count({
      where: {
        lojaId: loja.id,
        ativo: true,
      },
    }),
    prisma.agendamento.count({
      where: {
        lojaId: loja.id,
        inicio: {
          gte: startOfToday(),
          lte: endOfToday(),
        },
      },
    }),
    prisma.agendamento.findFirst({
      where: {
        lojaId: loja.id,
        inicio: {
          gte: new Date(),
        },
        status: {
          in: ['PENDENTE', 'CONFIRMADO'],
        },
      },
      include: {
        cliente: {
          select: { nome: true },
        },
        servico: {
          select: { nome: true },
        },
      },
      orderBy: { inicio: 'asc' },
    }),
  ]);

  return {
    loja: {
      id: loja.id,
      nome: loja.nome,
    },
    metricas: {
      clientes,
      servicosAtivos: servicos,
      agendamentosHoje,
    },
    proximoAgendamento: proximoAgendamento
      ? {
          id: proximoAgendamento.id,
          inicio: proximoAgendamento.inicio,
          clienteNome: proximoAgendamento.cliente.nome,
          servicoNome: proximoAgendamento.servico.nome,
          status: proximoAgendamento.status,
        }
      : null,
  };
}
