import { prisma } from '../../lib/db';
import { AppError } from '../../lib/errors';

type LojaPayload = {
  nome?: string;
  email?: string | null;
  telefone?: string | null;
  endereco?: string | null;
  cep?: string | null;
  logradouro?: string | null;
  numero?: string | null;
  bairro?: string | null;
  complemento?: string | null;
  estado?: string | null;
  cidade?: string | null;
  descricao?: string | null;
  imagemUrl?: string | null;
  profissao?: string;
  categoriaPrincipal?: string;
  modalidadePrincipal?: 'ONLINE' | 'PRESENCIAL' | 'HIBRIDO';
  tipoVendedor?: 'AUTONOMO' | 'EMPRESA';
};

function mapLoja(loja: {
  id: string;
  nome: string;
  email: string | null;
  telefone: string | null;
  endereco: string | null;
  cep: string | null;
  logradouro: string | null;
  numero: string | null;
  bairro: string | null;
  complemento: string | null;
  estado: string | null;
  cidade: string | null;
  descricao: string | null;
  imagemUrl: string | null;
  onboardingConcluido: boolean;
  perfilProfissional: {
    profissao: string;
    categoriaPrincipal: string;
    modalidadePrincipal: 'ONLINE' | 'PRESENCIAL' | 'HIBRIDO';
    tipoVendedor: 'AUTONOMO' | 'EMPRESA';
  } | null;
}) {
  return {
    id: loja.id,
    nome: loja.nome,
    email: loja.email,
    telefone: loja.telefone,
    endereco: loja.endereco,
    cep: loja.cep,
    logradouro: loja.logradouro,
    numero: loja.numero,
    bairro: loja.bairro,
    complemento: loja.complemento,
    estado: loja.estado,
    cidade: loja.cidade,
    descricao: loja.descricao,
    imagemUrl: loja.imagemUrl,
    onboardingConcluido: loja.onboardingConcluido,
    profissao: loja.perfilProfissional?.profissao ?? null,
    categoriaPrincipal: loja.perfilProfissional?.categoriaPrincipal ?? null,
    modalidadePrincipal: loja.perfilProfissional?.modalidadePrincipal ?? null,
    tipoVendedor: loja.perfilProfissional?.tipoVendedor ?? null,
  };
}

async function getLojaOrFail(userId: string) {
  const loja = await prisma.loja.findUnique({
    where: { usuarioId: userId },
    include: {
      perfilProfissional: true,
    },
  });

  if (!loja) {
    throw new AppError('Loja nao encontrada para este usuario.', 404);
  }

  return loja;
}

export async function getOwnLoja(userId: string) {
  const loja = await getLojaOrFail(userId);
  return mapLoja(loja);
}

export async function updateOwnLoja(userId: string, payload: LojaPayload) {
  const loja = await getLojaOrFail(userId);

  const updatedLoja = await prisma.$transaction(async (transaction) => {
    const savedLoja = await transaction.loja.update({
      where: { id: loja.id },
      data: {
        nome: payload.nome ?? undefined,
        email: payload.email ?? undefined,
        telefone: payload.telefone ?? undefined,
        endereco: payload.endereco ?? undefined,
        cep: payload.cep ?? undefined,
        logradouro: payload.logradouro ?? undefined,
        numero: payload.numero ?? undefined,
        bairro: payload.bairro ?? undefined,
        complemento: payload.complemento ?? undefined,
        estado: payload.estado ?? undefined,
        cidade: payload.cidade ?? undefined,
        descricao: payload.descricao ?? undefined,
        imagemUrl: payload.imagemUrl ?? undefined,
      },
      include: {
        perfilProfissional: true,
      },
    });

    if (savedLoja.perfilProfissional) {
      await transaction.perfilProfissional.update({
        where: { id: savedLoja.perfilProfissional.id },
        data: {
          profissao: payload.profissao ?? undefined,
          categoriaPrincipal: payload.categoriaPrincipal ?? undefined,
          modalidadePrincipal: payload.modalidadePrincipal ?? undefined,
          tipoVendedor: payload.tipoVendedor ?? undefined,
          cidade: payload.cidade ?? undefined,
          imagemUrl: payload.imagemUrl ?? undefined,
        },
      });
    }

    return transaction.loja.findUniqueOrThrow({
      where: { id: loja.id },
      include: {
        perfilProfissional: true,
      },
    });
  });

  return mapLoja(updatedLoja);
}
