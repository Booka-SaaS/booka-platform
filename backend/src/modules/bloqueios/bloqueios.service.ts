import { prisma } from '../../lib/db';
import { AppError } from '../../lib/errors';

type BloqueioInput = {
  inicio: string;
  fim: string;
  motivo?: string | null;
};

type UpdateBloqueioInput = Partial<BloqueioInput>;

function mapBloqueio(bloqueio: {
  id: string;
  inicio: Date;
  fim: Date;
  motivo: string | null;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: bloqueio.id,
    inicio: bloqueio.inicio,
    fim: bloqueio.fim,
    motivo: bloqueio.motivo,
    createdAt: bloqueio.createdAt,
    updatedAt: bloqueio.updatedAt,
  };
}

function assertPeriodoValido(inicio: Date, fim: Date) {
  if (fim <= inicio) {
    throw new AppError('Fim deve ser posterior ao inicio.', 400);
  }
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

async function getBloqueioFromStore(lojaId: string, bloqueioId: string) {
  const bloqueio = await prisma.bloqueioAgenda.findFirst({
    where: {
      id: bloqueioId,
      lojaId,
    },
  });

  if (!bloqueio) {
    throw new AppError('Bloqueio nao encontrado.', 404);
  }

  return bloqueio;
}

export async function listBloqueios(userId: string) {
  const lojaId = await getLojaId(userId);
  const bloqueios = await prisma.bloqueioAgenda.findMany({
    where: { lojaId },
    orderBy: { inicio: 'asc' },
  });

  return bloqueios.map(mapBloqueio);
}

export async function getBloqueio(userId: string, bloqueioId: string) {
  const lojaId = await getLojaId(userId);
  const bloqueio = await getBloqueioFromStore(lojaId, bloqueioId);

  return mapBloqueio(bloqueio);
}

export async function createBloqueio(userId: string, input: BloqueioInput) {
  const lojaId = await getLojaId(userId);
  const inicio = new Date(input.inicio);
  const fim = new Date(input.fim);

  assertPeriodoValido(inicio, fim);

  const bloqueio = await prisma.bloqueioAgenda.create({
    data: {
      lojaId,
      inicio,
      fim,
      motivo: input.motivo ?? null,
    },
  });

  return mapBloqueio(bloqueio);
}

export async function createBloqueiosLote(userId: string, inputs: BloqueioInput[]) {
  const lojaId = await getLojaId(userId);
  const bloqueios = inputs.map((input) => {
    const inicio = new Date(input.inicio);
    const fim = new Date(input.fim);
    assertPeriodoValido(inicio, fim);

    return {
      lojaId,
      inicio,
      fim,
      motivo: input.motivo ?? null,
    };
  });

  const created = await prisma.$transaction(
    bloqueios.map((bloqueio) =>
      prisma.bloqueioAgenda.create({
        data: bloqueio,
      }),
    ),
  );

  return created.map(mapBloqueio);
}

export async function updateBloqueio(userId: string, bloqueioId: string, input: UpdateBloqueioInput) {
  const lojaId = await getLojaId(userId);
  const current = await getBloqueioFromStore(lojaId, bloqueioId);
  const inicio = input.inicio ? new Date(input.inicio) : current.inicio;
  const fim = input.fim ? new Date(input.fim) : current.fim;

  assertPeriodoValido(inicio, fim);

  const bloqueio = await prisma.bloqueioAgenda.update({
    where: { id: current.id },
    data: {
      inicio,
      fim,
      motivo: input.motivo ?? undefined,
    },
  });

  return mapBloqueio(bloqueio);
}

export async function deleteBloqueio(userId: string, bloqueioId: string) {
  const lojaId = await getLojaId(userId);
  const bloqueio = await getBloqueioFromStore(lojaId, bloqueioId);

  await prisma.bloqueioAgenda.delete({
    where: { id: bloqueio.id },
  });

  return {
    success: true,
  };
}
