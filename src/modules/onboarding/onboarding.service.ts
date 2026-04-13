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
  ]);

  return {
    success: true,
  };
}
