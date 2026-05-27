-- Quick validation queries for Supabase SQL editor.

SELECT 1 AS database_status;

SELECT "id", "nome", "email", "role", "ativo", "createdAt"
FROM "Usuario"
ORDER BY "createdAt" DESC
LIMIT 20;

SELECT
  l."id" AS "lojaId",
  l."nome" AS "loja",
  p."nomeExibicao",
  p."profissao",
  p."categoriaPrincipal",
  p."publicado",
  p."rating"
FROM "Loja" l
LEFT JOIN "PerfilProfissional" p ON p."id" = l."perfilProfissionalId"
ORDER BY l."createdAt" DESC;

SELECT
  a."id",
  c."nome" AS "cliente",
  s."nome" AS "servico",
  a."inicio",
  a."fim",
  a."status",
  a."origem"
FROM "Agendamento" a
JOIN "Cliente" c ON c."id" = a."clienteId"
JOIN "Servico" s ON s."id" = a."servicoId"
ORDER BY a."inicio" DESC
LIMIT 20;
