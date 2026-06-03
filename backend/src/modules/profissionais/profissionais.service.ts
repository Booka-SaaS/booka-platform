import { prisma } from '../../lib/db';
import { AppError } from '../../lib/errors';
import { listDisponibilidade } from '../disponibilidade/disponibilidade.service';

type ProfissionaisFilters = {
  q?: string;
  cidade?: string;
  categoria?: string;
  modalidade?: string;
  precoMax?: number;
  avaliacaoMinima?: number;
};

function toDecimalPrice(precoCentavos: number) {
  return precoCentavos / 100;
}

function mapProfissionalListItem(loja: {
  id: string;
  nome: string;
  cidade: string | null;
  imagemUrl: string | null;
  usuario: {
    imagemUrl: string | null;
  };
  perfilProfissional: {
    nomeExibicao: string;
    profissao: string;
    categoriaPrincipal: string;
    modalidadePrincipal: 'ONLINE' | 'PRESENCIAL' | 'HIBRIDO';
    tipoVendedor: 'AUTONOMO' | 'EMPRESA';
    rating: number;
    imagemUrl: string | null;
  } | null;
  servicos: Array<{
    precoCentavos: number;
  }>;
}) {
  const precoInicial =
    loja.servicos.length > 0
      ? toDecimalPrice(Math.min(...loja.servicos.map((servico) => servico.precoCentavos)))
      : 0;

  return {
    id: loja.id,
    nome: loja.perfilProfissional?.nomeExibicao ?? loja.nome,
    profissao: loja.perfilProfissional?.profissao ?? 'Profissional',
    categoria: loja.perfilProfissional?.categoriaPrincipal ?? 'Geral',
    modalidade: loja.perfilProfissional?.modalidadePrincipal ?? 'PRESENCIAL',
    vendedor: loja.perfilProfissional?.tipoVendedor ?? 'AUTONOMO',
    cidade: loja.cidade,
    avatarUrl: loja.usuario.imagemUrl,
    capaUrl: loja.imagemUrl,
    img: loja.usuario.imagemUrl ?? loja.perfilProfissional?.imagemUrl ?? loja.imagemUrl,
    precoInicial,
    rating: loja.perfilProfissional?.rating ?? 0,
  };
}

export async function listProfissionais(filters: ProfissionaisFilters) {
  const lojas = await prisma.loja.findMany({
    where: {
      perfilProfissional: {
        is: {
          publicado: true,
        },
      },
    },
    include: {
      usuario: {
        select: { imagemUrl: true },
      },
      perfilProfissional: true,
      servicos: {
        where: { ativo: true },
      },
    },
  });

  return lojas
    .map(mapProfissionalListItem)
    .filter((profissional) => {
      const q = filters.q?.trim().toLowerCase();
      const cidade = filters.cidade?.trim().toLowerCase();
      const categoria = filters.categoria?.trim().toLowerCase();
      const modalidade = filters.modalidade?.trim().toUpperCase();

      if (
        q &&
        !profissional.nome.toLowerCase().includes(q) &&
        !profissional.profissao.toLowerCase().includes(q)
      ) {
        return false;
      }

      if (cidade && profissional.cidade?.toLowerCase() !== cidade) {
        return false;
      }

      if (categoria && profissional.categoria.toLowerCase() !== categoria) {
        return false;
      }

      if (modalidade && modalidade !== 'TODAS' && profissional.modalidade !== modalidade) {
        return false;
      }

      if (filters.precoMax !== undefined && profissional.precoInicial > filters.precoMax) {
        return false;
      }

      if (
        filters.avaliacaoMinima !== undefined &&
        profissional.rating < filters.avaliacaoMinima
      ) {
        return false;
      }

      return true;
    });
}

export async function getProfissionalDetalhe(lojaId: string) {
  const loja = await prisma.loja.findFirst({
    where: {
      id: lojaId,
      perfilProfissional: {
        is: {
          publicado: true,
        },
      },
    },
    include: {
      usuario: {
        select: { imagemUrl: true },
      },
      perfilProfissional: true,
      servicos: {
        where: { ativo: true },
        orderBy: { precoCentavos: 'asc' },
      },
    },
  });

  if (!loja || !loja.perfilProfissional) {
    throw new AppError('Profissional nao encontrado.', 404);
  }

  return {
    id: loja.id,
    nome: loja.perfilProfissional.nomeExibicao,
    profissao: loja.perfilProfissional.profissao,
    descricao: loja.descricao ?? loja.perfilProfissional.bio,
    telefone: loja.telefone,
    cidade: loja.cidade,
    avatarUrl: loja.usuario.imagemUrl,
    capaUrl: loja.imagemUrl,
    img: loja.usuario.imagemUrl ?? loja.perfilProfissional.imagemUrl ?? loja.imagemUrl,
    rating: loja.perfilProfissional.rating,
    servicos: loja.servicos.map((servico) => ({
      id: servico.id,
      nome: servico.nome,
      descricao: servico.descricao,
      preco: toDecimalPrice(servico.precoCentavos),
      duracaoMinutos: servico.duracaoMinutos,
    })),
  };
}

export async function getProfissionalDisponibilidade(lojaId: string, date: string, servicoId?: string) {
  const loja = await prisma.loja.findFirst({
    where: {
      id: lojaId,
      perfilProfissional: {
        is: {
          publicado: true,
        },
      },
    },
    select: { id: true },
  });

  if (!loja) {
    throw new AppError('Profissional nao encontrado.', 404);
  }

  return listDisponibilidade(loja.id, date, servicoId);
}
