import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function slugify(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function main() {
  const passwordHash = await bcrypt.hash('12345678', 10);

  const profissional = await prisma.usuario.upsert({
    where: { email: 'profissional@booka.local' },
    update: {
      nome: 'Profissional Booka',
      passwordHash,
      role: 'PROFISSIONAL',
      ativo: true,
    },
    create: {
      nome: 'Profissional Booka',
      email: 'profissional@booka.local',
      passwordHash,
      role: 'PROFISSIONAL',
      perfilProfissional: {
        create: {
          nomeExibicao: 'Studio Booka',
          profissao: 'Barbeiro',
          bio: 'Especialista em atendimento com hora marcada.',
          categoriaPrincipal: 'Beleza',
          modalidadePrincipal: 'PRESENCIAL',
          tipoVendedor: 'AUTONOMO',
          cidade: 'Cuiaba',
          publicado: true,
          rating: 4.9,
          avaliacoesCount: 120,
        },
      },
    },
    include: {
      perfilProfissional: true,
      loja: true,
    },
  });

  const perfil =
    profissional.perfilProfissional ??
    (await prisma.perfilProfissional.create({
      data: {
        usuarioId: profissional.id,
        nomeExibicao: 'Studio Booka',
        profissao: 'Barbeiro',
        bio: 'Especialista em atendimento com hora marcada.',
        categoriaPrincipal: 'Beleza',
        modalidadePrincipal: 'PRESENCIAL',
        tipoVendedor: 'AUTONOMO',
        cidade: 'Cuiaba',
        publicado: true,
        rating: 4.9,
        avaliacoesCount: 120,
      },
    }));

  const loja =
    profissional.loja ??
    (await prisma.loja.create({
      data: {
        usuarioId: profissional.id,
        perfilProfissionalId: perfil.id,
        nome: 'Studio Booka',
        slug: slugify('Studio Booka'),
        email: 'contato@booka.local',
        telefone: '65999990000',
        endereco: 'Rua das Palmeiras, 123',
        cidade: 'Cuiaba',
        descricao: 'Atendimento profissional com hora marcada.',
        onboardingConcluido: true,
      },
    }));

  await prisma.loja.update({
    where: { id: loja.id },
    data: {
      perfilProfissionalId: perfil.id,
      nome: 'Studio Booka',
      slug: slugify('Studio Booka'),
      email: 'contato@booka.local',
      telefone: '65999990000',
      endereco: 'Rua das Palmeiras, 123',
      cidade: 'Cuiaba',
      descricao: 'Atendimento profissional com hora marcada.',
      onboardingConcluido: true,
    },
  });

  const servicos = [
    {
      nome: 'Corte Masculino',
      descricao: 'Corte tradicional com acabamento.',
      duracaoMinutos: 45,
      precoCentavos: 5000,
    },
    {
      nome: 'Barba',
      descricao: 'Modelagem e alinhamento de barba.',
      duracaoMinutos: 30,
      precoCentavos: 3500,
    },
  ];

  for (const servico of servicos) {
    await prisma.servico.upsert({
      where: {
        lojaId_nome: {
          lojaId: loja.id,
          nome: servico.nome,
        },
      },
      update: servico,
      create: {
        lojaId: loja.id,
        ativo: true,
        ...servico,
      },
    });
  }

  const cliente = await prisma.cliente.upsert({
    where: {
      lojaId_telefone: {
        lojaId: loja.id,
        telefone: '65999991111',
      },
    },
    update: {
      nome: 'Cliente Seed',
      email: 'cliente.seed@booka.local',
      anotacoes: 'Cliente inicial do painel.',
    },
    create: {
      lojaId: loja.id,
      nome: 'Cliente Seed',
      email: 'cliente.seed@booka.local',
      telefone: '65999991111',
      anotacoes: 'Cliente inicial do painel.',
    },
  });

  const servicoCorte = await prisma.servico.findFirstOrThrow({
    where: {
      lojaId: loja.id,
      nome: 'Corte Masculino',
    },
  });

  const agora = new Date();
  const amanha = new Date(agora.getTime() + 24 * 60 * 60 * 1000);
  amanha.setUTCHours(14, 0, 0, 0);
  const fim = new Date(amanha.getTime() + servicoCorte.duracaoMinutos * 60 * 1000);

  const agendamentoExistente = await prisma.agendamento.findFirst({
    where: {
      lojaId: loja.id,
      clienteId: cliente.id,
      servicoId: servicoCorte.id,
      inicio: amanha,
    },
  });

  if (!agendamentoExistente) {
    await prisma.agendamento.create({
      data: {
        lojaId: loja.id,
        clienteId: cliente.id,
        servicoId: servicoCorte.id,
        inicio: amanha,
        fim,
        status: 'CONFIRMADO',
        origem: 'PAINEL',
      },
    });
  }

  for (const diaSemana of [1, 2, 3, 4, 5]) {
    await prisma.disponibilidadeSemanal.upsert({
      where: {
        lojaId_diaSemana: {
          lojaId: loja.id,
          diaSemana,
        },
      },
      update: {
        horaInicio: '09:00',
        horaFim: '18:00',
        intervaloMinutos: 60,
        ativo: true,
      },
      create: {
        lojaId: loja.id,
        diaSemana,
        horaInicio: '09:00',
        horaFim: '18:00',
        intervaloMinutos: 60,
        ativo: true,
      },
    });
  }

  console.log('Seed concluido com sucesso.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
