-- Optional fictitious seed data for Supabase.
-- The backend Prisma seed remains the preferred path because it hashes passwords in application code.

INSERT INTO "Usuario" ("id", "nome", "email", "passwordHash", "role", "ativo")
VALUES
  ('11111111-1111-1111-1111-111111111111', 'Profissional Demo Booka', 'profissional.demo@example.test', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'PROFISSIONAL', true)
ON CONFLICT ("email") DO NOTHING;

INSERT INTO "PerfilProfissional" (
  "id",
  "usuarioId",
  "nomeExibicao",
  "profissao",
  "bio",
  "categoriaPrincipal",
  "modalidadePrincipal",
  "tipoVendedor",
  "cidade",
  "publicado",
  "rating",
  "avaliacoesCount"
)
VALUES (
  '22222222-2222-2222-2222-222222222222',
  '11111111-1111-1111-1111-111111111111',
  'Equipe Sushi Demo',
  'Sushiman freelancer',
  'Perfil ficticio para validar o Booka em homologacao.',
  'Sushi',
  'PRESENCIAL',
  'AUTONOMO',
  'Sao Paulo',
  true,
  4.8,
  12
)
ON CONFLICT ("usuarioId") DO NOTHING;

INSERT INTO "Loja" (
  "id",
  "usuarioId",
  "perfilProfissionalId",
  "nome",
  "slug",
  "email",
  "telefone",
  "cidade",
  "descricao",
  "onboardingConcluido"
)
VALUES (
  '33333333-3333-3333-3333-333333333333',
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222',
  'Sushi Demo Booka',
  'sushi-demo-booka',
  'contato.demo@example.test',
  '11900000000',
  'Sao Paulo',
  'Restaurante ficticio usado somente para testes.',
  true
)
ON CONFLICT ("slug") DO NOTHING;

INSERT INTO "Servico" ("id", "lojaId", "nome", "descricao", "duracaoMinutos", "precoCentavos", "ativo")
VALUES
  ('44444444-4444-4444-4444-444444444444', '33333333-3333-3333-3333-333333333333', 'Turno de sushi bar', 'Servico ficticio para testes.', 240, 35000, true),
  ('55555555-5555-5555-5555-555555555555', '33333333-3333-3333-3333-333333333333', 'Preparo de mise en place', 'Servico ficticio para testes.', 180, 22000, true)
ON CONFLICT ("lojaId", "nome") DO NOTHING;

INSERT INTO "Cliente" ("id", "lojaId", "nome", "email", "telefone", "anotacoes")
VALUES (
  '66666666-6666-6666-6666-666666666666',
  '33333333-3333-3333-3333-333333333333',
  'Cliente Demo',
  'cliente.demo@example.test',
  '11911111111',
  'Contato ficticio para testes.'
)
ON CONFLICT ("lojaId", "telefone") DO NOTHING;

INSERT INTO "Agendamento" ("lojaId", "clienteId", "servicoId", "inicio", "fim", "status", "origem", "observacoes")
VALUES (
  '33333333-3333-3333-3333-333333333333',
  '66666666-6666-6666-6666-666666666666',
  '44444444-4444-4444-4444-444444444444',
  '2026-06-01 14:00:00',
  '2026-06-01 18:00:00',
  'CONFIRMADO',
  'PAINEL',
  'Agendamento ficticio para validacao.'
);

INSERT INTO "DisponibilidadeSemanal" ("lojaId", "diaSemana", "horaInicio", "horaFim", "intervaloMinutos", "ativo")
VALUES
  ('33333333-3333-3333-3333-333333333333', 1, '09:00', '18:00', 60, true),
  ('33333333-3333-3333-3333-333333333333', 2, '09:00', '18:00', 60, true),
  ('33333333-3333-3333-3333-333333333333', 3, '09:00', '18:00', 60, true),
  ('33333333-3333-3333-3333-333333333333', 4, '09:00', '18:00', 60, true),
  ('33333333-3333-3333-3333-333333333333', 5, '09:00', '18:00', 60, true)
ON CONFLICT ("lojaId", "diaSemana") DO NOTHING;
