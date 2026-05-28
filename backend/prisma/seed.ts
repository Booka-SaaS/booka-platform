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
  const passwordHash =
    process.env.SEED_PASSWORD_HASH ??
    (process.env.SEED_PASSWORD
      ? await bcrypt.hash(process.env.SEED_PASSWORD, 10)
      : '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy');

  // ── Profissional ────────────────────────────────────────────────────────────
  const profissional = await prisma.usuario.upsert({
    where: { email: 'profissional@booka.local' },
    update: { nome: 'Profissional Booka', passwordHash, role: 'PROFISSIONAL', ativo: true },
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
    include: { perfilProfissional: true, loja: true },
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

  // ── Cliente (usuário para login + registro na loja) ────────────────────────
  const clienteUsuario = await prisma.usuario.upsert({
    where: { email: 'cliente@booka.local' },
    update: { nome: 'Cliente Booka', passwordHash, role: 'CLIENTE', ativo: true },
    create: {
      nome: 'Cliente Booka',
      email: 'cliente@booka.local',
      passwordHash,
      role: 'CLIENTE',
    },
  });

  const cliente = await prisma.cliente.upsert({
    where: { lojaId_telefone: { lojaId: loja.id, telefone: '65999991111' } },
    update: { nome: clienteUsuario.nome, email: clienteUsuario.email, anotacoes: 'Cliente inicial do painel.' },
    create: {
      lojaId: loja.id,
      nome: clienteUsuario.nome,
      email: clienteUsuario.email,
      telefone: '65999991111',
      anotacoes: 'Cliente inicial do painel.',
    },
  });

  // ── Serviços ───────────────────────────────────────────────────────────────
  const servicosData = [
    { nome: 'Corte Masculino', descricao: 'Corte tradicional com acabamento.', duracaoMinutos: 45, precoCentavos: 5000 },
    { nome: 'Barba', descricao: 'Modelagem e alinhamento de barba.', duracaoMinutos: 30, precoCentavos: 3500 },
    { nome: 'Corte + Barba', descricao: 'Combo completo corte e barba.', duracaoMinutos: 70, precoCentavos: 7500 },
    { nome: 'Hidratação Capilar', descricao: 'Tratamento profundo para os cabelos.', duracaoMinutos: 60, precoCentavos: 6000 },
  ];

  for (const s of servicosData) {
    await prisma.servico.upsert({
      where: { lojaId_nome: { lojaId: loja.id, nome: s.nome } },
      update: s,
      create: { lojaId: loja.id, ativo: true, ...s },
    });
  }

  // ── Agendamento de exemplo ─────────────────────────────────────────────────
  const servicoCorte = await prisma.servico.findFirstOrThrow({
    where: { lojaId: loja.id, nome: 'Corte Masculino' },
  });

  const amanha = new Date();
  amanha.setDate(amanha.getDate() + 1);
  amanha.setHours(14, 0, 0, 0);
  const fimCorte = new Date(amanha.getTime() + servicoCorte.duracaoMinutos * 60 * 1000);

  const agendamentoExistente = await prisma.agendamento.findFirst({
    where: { lojaId: loja.id, clienteId: cliente.id, servicoId: servicoCorte.id, inicio: amanha },
  });

  if (!agendamentoExistente) {
    await prisma.agendamento.create({
      data: {
        lojaId: loja.id,
        clienteId: cliente.id,
        servicoId: servicoCorte.id,
        inicio: amanha,
        fim: fimCorte,
        status: 'CONFIRMADO',
        origem: 'PAINEL',
      },
    });
  }

  // ── Disponibilidade semanal completa (Seg-Sex + Sábado + Domingo fechado) ──
  const disponibilidades = [
    { diaSemana: 0, horaInicio: '00:00', horaFim: '00:00', intervaloMinutos: 30, ativo: false },
    { diaSemana: 1, horaInicio: '09:00', horaFim: '18:00', intervaloMinutos: 30, ativo: true },
    { diaSemana: 2, horaInicio: '09:00', horaFim: '18:00', intervaloMinutos: 30, ativo: true },
    { diaSemana: 3, horaInicio: '09:00', horaFim: '18:00', intervaloMinutos: 30, ativo: true },
    { diaSemana: 4, horaInicio: '09:00', horaFim: '18:00', intervaloMinutos: 30, ativo: true },
    { diaSemana: 5, horaInicio: '09:00', horaFim: '18:00', intervaloMinutos: 30, ativo: true },
    { diaSemana: 6, horaInicio: '09:00', horaFim: '14:00', intervaloMinutos: 30, ativo: true },
  ];

  for (const d of disponibilidades) {
    await prisma.disponibilidadeSemanal.upsert({
      where: { lojaId_diaSemana: { lojaId: loja.id, diaSemana: d.diaSemana } },
      update: d,
      create: { lojaId: loja.id, ...d },
    });
  }

  // ── Notificação de boas-vindas ─────────────────────────────────────────────
  const notifExistente = await prisma.notificacao.findFirst({
    where: { usuarioId: profissional.id, tipo: 'SISTEMA' },
  });

  if (!notifExistente) {
    await prisma.notificacao.create({
      data: {
        usuarioId: profissional.id,
        titulo: 'Bem-vindo ao Booka!',
        mensagem: 'Seu painel está configurado e pronto para receber agendamentos.',
        tipo: 'SISTEMA',
        lida: false,
      },
    });
  }

  console.log('');
  console.log('✓ Seed concluído com sucesso!');
  console.log('  Profissional : profissional@booka.local  /  12345678');
  console.log('  Cliente      : cliente@booka.local       /  12345678');
  console.log('');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
