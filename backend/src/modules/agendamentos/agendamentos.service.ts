import { Prisma, StatusAgendamento } from '@prisma/client';
import { prisma } from '../../lib/db';
import { AppError } from '../../lib/errors';
import { enviarEmailSolicitacao, enviarEmailConfirmacao } from '../../lib/email/email.service';

type ListAgendamentosFilters = {
  data?: string;
  status?: StatusAgendamento;
  clienteId?: string;
  servicoId?: string;
};

type CreateAgendamentoInput = {
  clienteId: string;
  servicoId: string;
  inicio: string;
  observacoes?: string | null;
  status?: StatusAgendamento;
};

type UpdateAgendamentoInput = Partial<CreateAgendamentoInput>;

type CreateAgendamentoPublicoInput = {
  lojaId: string;
  servicoId: string;
  inicio: string;
  observacoes?: string | null;
  cliente: {
    nome: string;
    email?: string | null;
    telefone: string;
  };
};

function startOfDay(date: string) {
  // Interpreta a data como local do servidor (não UTC fixo)
  return new Date(`${date}T00:00:00`);
}

function endOfDay(date: string) {
  return new Date(`${date}T23:59:59.999`);
}

function calculateEnd(inicioIso: string | Date, duracaoMinutos: number) {
  const inicio = new Date(inicioIso);
  return new Date(inicio.getTime() + duracaoMinutos * 60 * 1000);
}

function mapAgendamento(agendamento: {
  id: string;
  clienteId: string;
  servicoId: string;
  inicio: Date;
  fim: Date;
  status: StatusAgendamento;
  origem: 'PUBLICO' | 'PAINEL';
  observacoes: string | null;
  createdAt: Date;
  updatedAt: Date;
  cliente: { nome: string };
  servico: { nome: string };
}) {
  return {
    id: agendamento.id,
    clienteId: agendamento.clienteId,
    clienteNome: agendamento.cliente.nome,
    servicoId: agendamento.servicoId,
    servicoNome: agendamento.servico.nome,
    inicio: agendamento.inicio,
    fim: agendamento.fim,
    status: agendamento.status,
    origem: agendamento.origem,
    observacoes: agendamento.observacoes,
    createdAt: agendamento.createdAt,
    updatedAt: agendamento.updatedAt,
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

async function getServicoFromStore(lojaId: string, servicoId: string) {
  const servico = await prisma.servico.findFirst({
    where: {
      id: servicoId,
      lojaId,
      ativo: true,
    },
  });

  if (!servico) {
    throw new AppError('Servico nao encontrado para esta loja.', 400);
  }

  return servico;
}

async function ensureClienteFromStore(lojaId: string, clienteId: string) {
  const cliente = await prisma.cliente.findFirst({
    where: {
      id: clienteId,
      lojaId,
    },
  });

  if (!cliente) {
    throw new AppError('Cliente nao encontrado para esta loja.', 400);
  }

  return cliente;
}

async function assertNoConflict(lojaId: string, inicio: Date, fim: Date, ignoreAppointmentId?: string) {
  const conflictingAppointment = await prisma.agendamento.findFirst({
    where: {
      lojaId,
      id: ignoreAppointmentId ? { not: ignoreAppointmentId } : undefined,
      status: {
        in: ['PENDENTE', 'CONFIRMADO'],
      },
      AND: [
        {
          inicio: { lt: fim },
        },
        {
          fim: { gt: inicio },
        },
      ],
    },
  });

  if (conflictingAppointment) {
    throw new AppError('Ja existe um agendamento nesse horario.', 409);
  }

  const conflictingBlock = await prisma.bloqueioAgenda.findFirst({
    where: {
      lojaId,
      AND: [
        {
          inicio: { lt: fim },
        },
        {
          fim: { gt: inicio },
        },
      ],
    },
  });

  if (conflictingBlock) {
    throw new AppError('Horario indisponivel por bloqueio de agenda.', 409);
  }
}

export async function listAgendamentos(userId: string, filters: ListAgendamentosFilters) {
  const lojaId = await getLojaId(userId);
  const where: Prisma.AgendamentoWhereInput = {
    lojaId,
    status: filters.status,
    clienteId: filters.clienteId,
    servicoId: filters.servicoId,
  };

  if (filters.data) {
    where.inicio = {
      gte: startOfDay(filters.data),
      lte: endOfDay(filters.data),
    };
  }

  const agendamentos = await prisma.agendamento.findMany({
    where,
    include: {
      cliente: {
        select: { nome: true },
      },
      servico: {
        select: { nome: true },
      },
    },
    orderBy: { inicio: 'asc' },
  });

  return agendamentos.map(mapAgendamento);
}

export async function createAgendamento(userId: string, input: CreateAgendamentoInput) {
  const lojaId = await getLojaId(userId);
  const servico = await getServicoFromStore(lojaId, input.servicoId);
  await ensureClienteFromStore(lojaId, input.clienteId);

  const inicio = new Date(input.inicio);
  const fim = calculateEnd(inicio, servico.duracaoMinutos);

  await assertNoConflict(lojaId, inicio, fim);

  const agendamento = await prisma.agendamento.create({
    data: {
      lojaId,
      clienteId: input.clienteId,
      servicoId: input.servicoId,
      inicio,
      fim,
      observacoes: input.observacoes ?? null,
      status: input.status ?? 'PENDENTE',
      origem: 'PAINEL',
    },
    include: {
      cliente: {
        select: { nome: true },
      },
      servico: {
        select: { nome: true },
      },
    },
  });

  return mapAgendamento(agendamento);
}

export async function updateAgendamento(userId: string, agendamentoId: string, input: UpdateAgendamentoInput) {
  const lojaId = await getLojaId(userId);
  const current = await prisma.agendamento.findFirst({
    where: {
      id: agendamentoId,
      lojaId,
    },
  });

  if (!current) {
    throw new AppError('Agendamento nao encontrado.', 404);
  }

  const clienteId = input.clienteId ?? current.clienteId;
  const servicoId = input.servicoId ?? current.servicoId;
  const inicio = new Date(input.inicio ?? current.inicio);

  const servico = await getServicoFromStore(lojaId, servicoId);
  const cliente = await ensureClienteFromStore(lojaId, clienteId);

  const fim = calculateEnd(inicio, servico.duracaoMinutos);

  if ((input.status ?? current.status) !== 'CANCELADO') {
    await assertNoConflict(lojaId, inicio, fim, current.id);
  }

  const novoStatus = input.status ?? current.status;
  const confirmaAgora = novoStatus === 'CONFIRMADO' && current.status !== 'CONFIRMADO';

  const agendamento = await prisma.agendamento.update({
    where: { id: current.id },
    data: {
      clienteId,
      servicoId,
      inicio,
      fim,
      observacoes: input.observacoes ?? undefined,
      status: novoStatus,
    },
    include: {
      cliente: {
        select: { nome: true },
      },
      servico: {
        select: { nome: true },
      },
    },
  });

  if (confirmaAgora && cliente.email) {
    const loja = await prisma.loja.findUnique({
      where: { id: lojaId },
      select: {
        nome: true,
        telefone: true,
        endereco: true,
        logradouro: true,
        numero: true,
        bairro: true,
        cidade: true,
        estado: true,
      },
    });

    if (loja) {
      enviarEmailConfirmacao({
        clienteEmail: cliente.email,
        clienteNome: cliente.nome,
        lojaNome: loja.nome,
        servicoNome: servico.nome,
        inicio,
        fim,
        lojaEndereco: loja.endereco,
        lojaLogradouro: loja.logradouro,
        lojaNumero: loja.numero,
        lojaBairro: loja.bairro,
        lojaCidade: loja.cidade,
        lojaEstado: loja.estado,
        lojaTelefone: loja.telefone,
      });
    }
  }

  return mapAgendamento(agendamento);
}

export async function deleteAgendamento(userId: string, agendamentoId: string) {
  const lojaId = await getLojaId(userId);
  const agendamento = await prisma.agendamento.findFirst({
    where: {
      id: agendamentoId,
      lojaId,
    },
  });

  if (!agendamento) {
    throw new AppError('Agendamento nao encontrado.', 404);
  }

  await prisma.agendamento.delete({
    where: { id: agendamento.id },
  });

  return {
    success: true,
  };
}

export async function createPublicAgendamento(input: CreateAgendamentoPublicoInput) {
  const loja = await prisma.loja.findFirst({
    where: {
      id: input.lojaId,
      perfilProfissional: {
        is: {
          publicado: true,
        },
      },
    },
    include: {
      perfilProfissional: true,
    },
  });

  if (!loja) {
    throw new AppError('Loja publica nao encontrada.', 404);
  }

  const servico = await getServicoFromStore(loja.id, input.servicoId);
  const inicio = new Date(input.inicio);
  const fim = calculateEnd(inicio, servico.duracaoMinutos);

  await assertNoConflict(loja.id, inicio, fim);

  const cliente = await prisma.cliente.upsert({
    where: {
      lojaId_telefone: {
        lojaId: loja.id,
        telefone: input.cliente.telefone,
      },
    },
    update: {
      nome: input.cliente.nome,
      email: input.cliente.email ?? null,
    },
    create: {
      lojaId: loja.id,
      nome: input.cliente.nome,
      email: input.cliente.email ?? null,
      telefone: input.cliente.telefone,
    },
  });

  const agendamento = await prisma.agendamento.create({
    data: {
      lojaId: loja.id,
      clienteId: cliente.id,
      servicoId: servico.id,
      inicio,
      fim,
      observacoes: input.observacoes ?? null,
      status: 'PENDENTE',
      origem: 'PUBLICO',
    },
    include: {
      cliente: {
        select: { nome: true },
      },
      servico: {
        select: { nome: true },
      },
    },
  });

  if (cliente.email) {
    enviarEmailSolicitacao({
      clienteEmail: cliente.email,
      clienteNome: cliente.nome,
      lojaNome: loja.nome,
      servicoNome: servico.nome,
      inicio,
    });
  }

  return mapAgendamento(agendamento);
}

export async function listMeusAgendamentos(userId: string, email: string) {
  // Buscar clientes associados a esse email em qualquer loja
  const clientes = await prisma.cliente.findMany({
    where: { email },
    select: { id: true },
  });

  const clienteIds = clientes.map(c => c.id);

  if (clienteIds.length === 0) return [];

  const agendamentos = await prisma.agendamento.findMany({
    where: { clienteId: { in: clienteIds } },
    include: {
      cliente: { select: { nome: true } },
      servico: { select: { nome: true, precoCentavos: true } },
      loja: { select: { nome: true } },
    },
    orderBy: { inicio: 'desc' },
  });

  return agendamentos.map(a => ({
    ...mapAgendamento(a),
    nomeLoja: a.loja.nome,
    nomeServico: a.servico.nome,
    valor: a.servico.precoCentavos / 100,
  }));
}

export async function cancelAgendamentoCliente(email: string, agendamentoId: string) {
  const clientes = await prisma.cliente.findMany({
    where: { email },
    select: { id: true },
  });

  const clienteIds = clientes.map(c => c.id);

  const agendamento = await prisma.agendamento.findFirst({
    where: {
      id: agendamentoId,
      clienteId: { in: clienteIds },
    },
  });

  if (!agendamento) {
    throw new AppError('Agendamento nao encontrado ou nao pertence ao usuario.', 404);
  }

  const updated = await prisma.agendamento.update({
    where: { id: agendamentoId },
    data: {
      status: 'CANCELADO',
    },
    include: {
      cliente: {
        select: { nome: true },
      },
      servico: {
        select: { nome: true },
      },
    },
  });

  return mapAgendamento(updated);
}
