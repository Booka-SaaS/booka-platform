-- Booka PostgreSQL/Supabase schema
-- Based on backend/prisma/schema.prisma.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DO $$ BEGIN
  CREATE TYPE "UserRole" AS ENUM ('CLIENTE', 'PROFISSIONAL');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "ModalidadeProfissional" AS ENUM ('ONLINE', 'PRESENCIAL', 'HIBRIDO');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "TipoVendedor" AS ENUM ('AUTONOMO', 'EMPRESA');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "StatusAgendamento" AS ENUM ('PENDENTE', 'CONFIRMADO', 'CANCELADO', 'CONCLUIDO');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "OrigemAgendamento" AS ENUM ('PUBLICO', 'PAINEL');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "TipoNotificacao" AS ENUM ('AGENDAMENTO', 'SISTEMA', 'LEMBRETE');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS "Usuario" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "nome" TEXT NOT NULL,
  "email" TEXT NOT NULL UNIQUE,
  "passwordHash" TEXT NOT NULL,
  "role" "UserRole" NOT NULL,
  "ativo" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "PerfilProfissional" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "usuarioId" UUID NOT NULL UNIQUE,
  "nomeExibicao" TEXT NOT NULL,
  "profissao" TEXT NOT NULL,
  "bio" TEXT,
  "imagemUrl" TEXT,
  "categoriaPrincipal" TEXT NOT NULL,
  "modalidadePrincipal" "ModalidadeProfissional" NOT NULL,
  "tipoVendedor" "TipoVendedor" NOT NULL,
  "cidade" TEXT,
  "publicado" BOOLEAN NOT NULL DEFAULT false,
  "rating" DOUBLE PRECISION NOT NULL DEFAULT 5,
  "avaliacoesCount" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "PerfilProfissional_usuarioId_fkey"
    FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "Loja" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "usuarioId" UUID NOT NULL UNIQUE,
  "perfilProfissionalId" UUID UNIQUE,
  "nome" TEXT NOT NULL,
  "slug" TEXT NOT NULL UNIQUE,
  "email" TEXT,
  "telefone" TEXT,
  "endereco" TEXT,
  "cidade" TEXT,
  "descricao" TEXT,
  "imagemUrl" TEXT,
  "onboardingConcluido" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Loja_usuarioId_fkey"
    FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "Loja_perfilProfissionalId_fkey"
    FOREIGN KEY ("perfilProfissionalId") REFERENCES "PerfilProfissional"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "Servico" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "lojaId" UUID NOT NULL,
  "nome" TEXT NOT NULL,
  "descricao" TEXT,
  "duracaoMinutos" INTEGER NOT NULL,
  "precoCentavos" INTEGER NOT NULL,
  "ativo" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Servico_lojaId_fkey"
    FOREIGN KEY ("lojaId") REFERENCES "Loja"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "Servico_lojaId_nome_key" UNIQUE ("lojaId", "nome")
);

CREATE TABLE IF NOT EXISTS "Cliente" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "lojaId" UUID NOT NULL,
  "nome" TEXT NOT NULL,
  "email" TEXT,
  "telefone" TEXT NOT NULL,
  "anotacoes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Cliente_lojaId_fkey"
    FOREIGN KEY ("lojaId") REFERENCES "Loja"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "Cliente_lojaId_telefone_key" UNIQUE ("lojaId", "telefone")
);

CREATE TABLE IF NOT EXISTS "Agendamento" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "lojaId" UUID NOT NULL,
  "clienteId" UUID NOT NULL,
  "servicoId" UUID NOT NULL,
  "inicio" TIMESTAMP(3) NOT NULL,
  "fim" TIMESTAMP(3) NOT NULL,
  "status" "StatusAgendamento" NOT NULL DEFAULT 'PENDENTE',
  "origem" "OrigemAgendamento" NOT NULL DEFAULT 'PAINEL',
  "observacoes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Agendamento_lojaId_fkey"
    FOREIGN KEY ("lojaId") REFERENCES "Loja"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "Agendamento_clienteId_fkey"
    FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "Agendamento_servicoId_fkey"
    FOREIGN KEY ("servicoId") REFERENCES "Servico"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "DisponibilidadeSemanal" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "lojaId" UUID NOT NULL,
  "diaSemana" INTEGER NOT NULL,
  "horaInicio" TEXT NOT NULL,
  "horaFim" TEXT NOT NULL,
  "intervaloMinutos" INTEGER NOT NULL,
  "ativo" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "DisponibilidadeSemanal_lojaId_fkey"
    FOREIGN KEY ("lojaId") REFERENCES "Loja"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "DisponibilidadeSemanal_lojaId_diaSemana_key" UNIQUE ("lojaId", "diaSemana")
);

CREATE TABLE IF NOT EXISTS "BloqueioAgenda" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "lojaId" UUID NOT NULL,
  "inicio" TIMESTAMP(3) NOT NULL,
  "fim" TIMESTAMP(3) NOT NULL,
  "motivo" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "BloqueioAgenda_lojaId_fkey"
    FOREIGN KEY ("lojaId") REFERENCES "Loja"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "PasswordResetToken" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "usuarioId" UUID NOT NULL,
  "tokenHash" TEXT NOT NULL,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "usedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "PasswordResetToken_usuarioId_fkey"
    FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "Notificacao" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "usuarioId" UUID NOT NULL,
  "titulo" TEXT NOT NULL,
  "mensagem" TEXT NOT NULL,
  "tipo" "TipoNotificacao" NOT NULL DEFAULT 'SISTEMA',
  "lida" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Notificacao_usuarioId_fkey"
    FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "Loja_nome_idx" ON "Loja"("nome");
CREATE INDEX IF NOT EXISTS "Servico_lojaId_ativo_idx" ON "Servico"("lojaId", "ativo");
CREATE INDEX IF NOT EXISTS "Cliente_lojaId_nome_idx" ON "Cliente"("lojaId", "nome");
CREATE INDEX IF NOT EXISTS "Agendamento_lojaId_inicio_idx" ON "Agendamento"("lojaId", "inicio");
CREATE INDEX IF NOT EXISTS "Agendamento_clienteId_idx" ON "Agendamento"("clienteId");
CREATE INDEX IF NOT EXISTS "Agendamento_servicoId_idx" ON "Agendamento"("servicoId");
CREATE INDEX IF NOT EXISTS "DisponibilidadeSemanal_lojaId_diaSemana_idx" ON "DisponibilidadeSemanal"("lojaId", "diaSemana");
CREATE INDEX IF NOT EXISTS "BloqueioAgenda_lojaId_inicio_fim_idx" ON "BloqueioAgenda"("lojaId", "inicio", "fim");
CREATE INDEX IF NOT EXISTS "PasswordResetToken_tokenHash_idx" ON "PasswordResetToken"("tokenHash");
CREATE INDEX IF NOT EXISTS "PasswordResetToken_usuarioId_idx" ON "PasswordResetToken"("usuarioId");
CREATE INDEX IF NOT EXISTS "Notificacao_usuarioId_lida_idx" ON "Notificacao"("usuarioId", "lida");
CREATE INDEX IF NOT EXISTS "Notificacao_usuarioId_createdAt_idx" ON "Notificacao"("usuarioId", "createdAt");
