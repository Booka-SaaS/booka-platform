import { prisma } from '../../lib/db';
import { AppError } from '../../lib/errors';

type ClienteInput = {
  nome: string;
  email?: string | null;
  telefone: string;
  anotacoes?: string | null;
  observacoes?: string | null;
};

type PartialClienteInput = Partial<ClienteInput>;

function normalizeAnnotations(input: PartialClienteInput) {
  return input.anotacoes ?? input.observacoes ?? undefined;
}

function mapCliente(cliente: {
  id: string;
  nome: string;
  email: string | null;
  telefone: string;
  anotacoes: string | null;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: cliente.id,
    nome: cliente.nome,
    email: cliente.email,
    telefone: cliente.telefone,
    anotacoes: cliente.anotacoes,
    createdAt: cliente.createdAt,
    updatedAt: cliente.updatedAt,
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

export async function listClientes(userId: string) {
  const lojaId = await getLojaId(userId);
  const clientes = await prisma.cliente.findMany({
    where: { lojaId },
    orderBy: { createdAt: 'desc' },
  });

  return clientes.map(mapCliente);
}

export async function getCliente(userId: string, clienteId: string) {
  const lojaId = await getLojaId(userId);
  const cliente = await prisma.cliente.findFirst({
    where: {
      id: clienteId,
      lojaId,
    },
  });

  if (!cliente) {
    throw new AppError('Cliente nao encontrado.', 404);
  }

  return mapCliente(cliente);
}

export async function createCliente(userId: string, input: ClienteInput) {
  const lojaId = await getLojaId(userId);

  const cliente = await prisma.cliente.create({
    data: {
      lojaId,
      nome: input.nome,
      email: input.email ?? null,
      telefone: input.telefone,
      anotacoes: normalizeAnnotations(input) ?? null,
    },
  });

  return mapCliente(cliente);
}

export async function updateCliente(userId: string, clienteId: string, input: PartialClienteInput) {
  const lojaId = await getLojaId(userId);
  const cliente = await prisma.cliente.findFirst({
    where: {
      id: clienteId,
      lojaId,
    },
  });

  if (!cliente) {
    throw new AppError('Cliente nao encontrado.', 404);
  }

  const updatedCliente = await prisma.cliente.update({
    where: { id: cliente.id },
    data: {
      nome: input.nome ?? undefined,
      email: input.email ?? undefined,
      telefone: input.telefone ?? undefined,
      anotacoes: normalizeAnnotations(input) ?? undefined,
    },
  });

  return mapCliente(updatedCliente);
}

export async function deleteCliente(userId: string, clienteId: string) {
  const lojaId = await getLojaId(userId);
  const cliente = await prisma.cliente.findFirst({
    where: {
      id: clienteId,
      lojaId,
    },
  });

  if (!cliente) {
    throw new AppError('Cliente nao encontrado.', 404);
  }

  await prisma.cliente.delete({
    where: { id: cliente.id },
  });

  return {
    success: true,
  };
}
