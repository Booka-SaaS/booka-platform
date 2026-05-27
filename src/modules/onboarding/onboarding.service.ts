import { prisma } from '../../lib/db';
import { AppError } from '../../lib/errors';

type FinalizeOnboardingInput = {
  nome: string;
  telefone: string;
  endereco: string;
  cidade?: string;
  descricao?: string;
  profissao: string;
  categoriaPrincipal: string;
  modalidadePrincipal: 'ONLINE' | 'PRESENCIAL' | 'HIBRIDO';
  tipoVendedor: 'AUTONOMO' | 'EMPRESA';
};

export async function finalizeOnboarding(userId: string, input: FinalizeOnboardingInput) {
  const loja = await prisma.loja.findUnique({
    where: { usuarioId: userId },
    include: {
      perfilProfissional: true,
    },
  });

  if (!loja || !loja.perfilProfissional) {
    throw new AppError('Contexto de onboarding nao encontrado.', 404);
  }

  const diasUteisDefault = [1, 2, 3, 4, 5].map((diaSemana) => ({
    lojaId: loja.id,
    diaSemana,
    horaInicio: '09:00',
    horaFim: '18:00',
    intervaloMinutos: 30,
    ativo: true,
  }));

  const sabadoDefault = {
    lojaId: loja.id,
    diaSemana: 6,
    horaInicio: '09:00',
    horaFim: '14:00',
    intervaloMinutos: 30,
    ativo: true,
  };

  await prisma.$transaction([
    prisma.loja.update({
      where: { id: loja.id },
      data: {
        nome: input.nome,
        telefone: input.telefone,
        endereco: input.endereco,
        cidade: input.cidade,
        descricao: input.descricao,
        onboardingConcluido: true,
      },
    }),
    prisma.perfilProfissional.update({
      where: { id: loja.perfilProfissional.id },
      data: {
        nomeExibicao: input.nome,
        profissao: input.profissao,
        categoriaPrincipal: input.categoriaPrincipal,
        modalidadePrincipal: input.modalidadePrincipal,
        tipoVendedor: input.tipoVendedor,
        cidade: input.cidade,
        publicado: true,
      },
    }),
    ...[...diasUteisDefault, sabadoDefault].map((dia) =>
      prisma.disponibilidadeSemanal.upsert({
        where: { lojaId_diaSemana: { lojaId: dia.lojaId, diaSemana: dia.diaSemana } },
        update: {},
        create: dia,
      }),
    ),
  ]);

  return {
    success: true,
  };
}
