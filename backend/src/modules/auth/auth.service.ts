import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import jwt from 'jsonwebtoken';
import { Prisma, UserRole } from '@prisma/client';
import { env } from '../../config/env';
import { prisma } from '../../lib/db';
import { AppError } from '../../lib/errors';

type RegisterInput = {
  nome: string;
  email: string;
  password: string;
  role: UserRole;
};

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function slugify(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function buildToken(user: { id: string; email: string; role: UserRole }) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role,
    },
    env.JWT_SECRET,
    {
      expiresIn: env.JWT_TTL_SECONDS,
    },
  );
}

function mapAuthUser(user: { id: string; nome: string; email: string; role: UserRole }) {
  return {
    id: user.id,
    nome: user.nome,
    email: user.email,
    role: user.role,
  };
}

function mapLojaContext(loja: {
  id: string;
  nome: string;
  onboardingConcluido: boolean;
} | null) {
  if (!loja) {
    return null;
  }

  return {
    id: loja.id,
    nome: loja.nome,
    onboardingConcluido: loja.onboardingConcluido,
  };
}

export async function register(input: RegisterInput) {
  const email = normalizeEmail(input.email);

  const existingUser = await prisma.usuario.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new AppError('Ja existe um usuario com este email.', 409);
  }

  const passwordHash = await bcrypt.hash(input.password, 10);

  const user = await prisma.$transaction(async (transaction) => {
    const createdUser = await transaction.usuario.create({
      data: {
        nome: input.nome.trim(),
        email,
        passwordHash,
        role: input.role,
      },
    });

    if (input.role === 'PROFISSIONAL') {
      const perfil = await transaction.perfilProfissional.create({
        data: {
          usuarioId: createdUser.id,
          nomeExibicao: input.nome.trim(),
          profissao: 'Profissional',
          categoriaPrincipal: 'Geral',
          modalidadePrincipal: 'PRESENCIAL',
          tipoVendedor: 'AUTONOMO',
          publicado: false,
        },
      });

      await transaction.loja.create({
        data: {
          usuarioId: createdUser.id,
          perfilProfissionalId: perfil.id,
          nome: `${input.nome.trim()} Studio`,
          slug: `${slugify(input.nome)}-${createdUser.id.slice(0, 8)}`,
          onboardingConcluido: false,
        },
      });
    }

    return createdUser;
  });

  return {
    token: buildToken(user),
    user: mapAuthUser(user),
  };
}

export async function login(emailInput: string, password: string) {
  const email = normalizeEmail(emailInput);
  const user = await prisma.usuario.findUnique({
    where: { email },
  });

  if (!user) {
    throw new AppError('Credenciais invalidas.', 401);
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);

  if (!passwordMatches) {
    throw new AppError('Credenciais invalidas.', 401);
  }

  return {
    token: buildToken(user),
    user: mapAuthUser(user),
  };
}

export async function getMe(userId: string) {
  const user = await prisma.usuario.findUnique({
    where: { id: userId },
    include: {
      loja: true,
    },
  });

  if (!user) {
    throw new AppError('Usuario nao encontrado.', 404);
  }

  return {
    user: mapAuthUser(user),
    loja: mapLojaContext(user.loja),
  };
}

export async function requestPasswordReset(email: string) {
  const normalizedEmail = normalizeEmail(email);
  const user = await prisma.usuario.findUnique({
    where: { email: normalizedEmail },
  });

  // Sempre retorna sucesso para não revelar se o email existe
  if (!user) {
    return {
      message: 'Se o email estiver cadastrado, você receberá um link para redefinir sua senha.',
    };
  }

  // Invalidar tokens anteriores
  await prisma.passwordResetToken.updateMany({
    where: {
      usuarioId: user.id,
      usedAt: null,
    },
    data: {
      usedAt: new Date(),
    },
  });

  // Gerar token
  const rawToken = randomUUID();
  const tokenHash = await bcrypt.hash(rawToken, 10);

  await prisma.passwordResetToken.create({
    data: {
      usuarioId: user.id,
      tokenHash,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hora
    },
  });

  // Em producao, o token deve ser enviado por email.
  // Em desenvolvimento, ele volta na resposta para facilitar testes locais.
  return {
    message: 'Se o email estiver cadastrado, você receberá um link para redefinir sua senha.',
    ...(env.NODE_ENV === 'production' ? {} : { resetToken: rawToken }),
  };
}

export async function resetPassword(rawToken: string, novaSenha: string) {
  // Buscar tokens não usados e não expirados
  const tokens = await prisma.passwordResetToken.findMany({
    where: {
      usedAt: null,
      expiresAt: {
        gt: new Date(),
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 50,
  });

  let matchedToken = null;
  for (const token of tokens) {
    const matches = await bcrypt.compare(rawToken, token.tokenHash);
    if (matches) {
      matchedToken = token;
      break;
    }
  }

  if (!matchedToken) {
    throw new AppError('Token invalido ou expirado.', 400);
  }

  const passwordHash = await bcrypt.hash(novaSenha, 10);

  await prisma.$transaction([
    prisma.usuario.update({
      where: { id: matchedToken.usuarioId },
      data: { passwordHash },
    }),
    prisma.passwordResetToken.update({
      where: { id: matchedToken.id },
      data: { usedAt: new Date() },
    }),
  ]);

  return {
    message: 'Senha atualizada com sucesso.',
  };
}
