import { prisma } from '../../lib/db';
import { AppError } from '../../lib/errors';

type ServicoInput = {
  nome: string;
  descricao?: string | null;
  duracaoMinutos: number;
  preco: number;
  ativo?: boolean;
};

type PartialServicoInput = Partial<ServicoInput>;

function toDecimalPrice(precoCentavos: number) {
  return precoCentavos / 100;
}

function mapServico(servico: {
  id: string;
  nome: string;
  descricao: string | null;
  duracaoMinutos: number;
  precoCentavos: number;
  ativo: boolean;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: servico.id,
    nome: servico.nome,
    descricao: servico.descricao,
    duracaoMinutos: servico.duracaoMinutos,
    preco: toDecimalPrice(servico.precoCentavos),
    ativo: servico.ativo,
    createdAt: servico.createdAt,
    updatedAt: servico.updatedAt,
  };
}

async function getLojaId(userId: string) {
  const loja = await prisma.loja.findUnique({
    where: { usuarioId: userId },
    select: { id: true },
  });

  if (!loja) {
    throw new AppError('Loja nao encontrada.', 404);
  }

  return loja.id;
}

export async function listServicos(userId: string) {
  const lojaId = await getLojaId(userId);
  const servicos = await prisma.servico.findMany({
    where: { lojaId },
    orderBy: { createdAt: 'desc' },
  });

  return servicos.map(mapServico);
}

export async function createServico(userId: string, input: ServicoInput) {
  const lojaId = await getLojaId(userId);

  const servico = await prisma.servico.create({
    data: {
      lojaId,
      nome: input.nome,
      descricao: input.descricao ?? null,
      duracaoMinutos: input.duracaoMinutos,
      precoCentavos: Math.round(input.preco * 100),
      ativo: input.ativo ?? true,
    },
  });

  return mapServico(servico);
}

export async function updateServico(userId: string, servicoId: string, input: PartialServicoInput) {
  const lojaId = await getLojaId(userId);
  const servico = await prisma.servico.findFirst({
    where: {
      id: servicoId,
      lojaId,
    },
  });

  if (!servico) {
    throw new AppError('Servico nao encontrado.', 404);
  }

  const updatedServico = await prisma.servico.update({
    where: { id: servico.id },
    data: {
      nome: input.nome ?? undefined,
      descricao: input.descricao ?? undefined,
      duracaoMinutos: input.duracaoMinutos ?? undefined,
      precoCentavos: input.preco !== undefined ? Math.round(input.preco * 100) : undefined,
      ativo: input.ativo ?? undefined,
    },
  });

  return mapServico(updatedServico);
}

export async function deleteServico(userId: string, servicoId: string) {
  const lojaId = await getLojaId(userId);
  const servico = await prisma.servico.findFirst({
    where: {
      id: servicoId,
      lojaId,
    },
  });

  if (!servico) {
    throw new AppError('Servico nao encontrado.', 404);
  }

  await prisma.servico.delete({
    where: { id: servico.id },
  });

  return {
    success: true,
  };
}
