-- Schema legado do repositório Giullianoads/booka-app.
-- Mantido como referência de migração/adaptação para Supabase.
-- O schema principal do monorepo atual é o Prisma em backend/prisma/schema.prisma.

create table if not exists perfis (
  id uuid references auth.users on delete cascade not null primary key,
  atualizado_em timestamp with time zone,
  nome_completo text,
  email text,
  telefone text,
  tipo_usuario text check (tipo_usuario in ('cliente', 'prestador')),
  url_avatar text,
  constraint nome_completo_tamanho check (char_length(nome_completo) >= 3)
);

create table if not exists clientes (
  id uuid references perfis(id) on delete cascade not null primary key,
  cpf text unique,
  criado_em timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists prestadores (
  id uuid references perfis(id) on delete cascade not null primary key,
  cpf_cnpj text unique,
  nome_empresa text,
  horario_funcionamento text,
  biografia text,
  criado_em timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists servicos_legacy (
  id uuid default gen_random_uuid() primary key,
  prestador_id uuid references prestadores(id) on delete cascade not null,
  nome text not null,
  descricao text,
  preco decimal(10,2) not null,
  duracao_minutos integer not null,
  ativo boolean default true,
  criado_em timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists agendamentos_legacy (
  id uuid default gen_random_uuid() primary key,
  cliente_id uuid references clientes(id) on delete cascade not null,
  servico_id uuid references servicos_legacy(id) on delete cascade not null,
  data_agendamento timestamp with time zone not null,
  status text check (status in ('pendente', 'confirmado', 'cancelado', 'concluido')) default 'pendente',
  notas text,
  criado_em timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table perfis enable row level security;
alter table clientes enable row level security;
alter table prestadores enable row level security;
alter table servicos_legacy enable row level security;
alter table agendamentos_legacy enable row level security;

drop policy if exists "Perfis publicos sao visiveis por todos." on perfis;
create policy "Perfis publicos sao visiveis por todos." on perfis
  for select using (true);

drop policy if exists "Usuarios podem inserir seu proprio perfil." on perfis;
create policy "Usuarios podem inserir seu proprio perfil." on perfis
  for insert with check (auth.uid() = id);

drop policy if exists "Usuarios podem atualizar seu proprio perfil." on perfis;
create policy "Usuarios podem atualizar seu proprio perfil." on perfis
  for update using (auth.uid() = id);

drop policy if exists "Clientes podem ver seus proprios dados." on clientes;
create policy "Clientes podem ver seus proprios dados." on clientes
  for select using (auth.uid() = id);

drop policy if exists "Clientes podem atualizar seus proprios dados." on clientes;
create policy "Clientes podem atualizar seus proprios dados." on clientes
  for update using (auth.uid() = id);

drop policy if exists "Prestadores sao visiveis por todos." on prestadores;
create policy "Prestadores sao visiveis por todos." on prestadores
  for select using (true);

drop policy if exists "Prestadores podem atualizar seus proprios dados." on prestadores;
create policy "Prestadores podem atualizar seus proprios dados." on prestadores
  for update using (auth.uid() = id);

drop policy if exists "Servicos sao visiveis por todos." on servicos_legacy;
create policy "Servicos sao visiveis por todos." on servicos_legacy
  for select using (true);

drop policy if exists "Prestadores podem gerenciar seus proprios servicos." on servicos_legacy;
create policy "Prestadores podem gerenciar seus proprios servicos." on servicos_legacy
  for all using (auth.uid() = prestador_id);

drop policy if exists "Clientes podem ver seus proprios agendamentos." on agendamentos_legacy;
create policy "Clientes podem ver seus proprios agendamentos." on agendamentos_legacy
  for select using (auth.uid() = cliente_id);

drop policy if exists "Prestadores podem ver agendamentos de seus servicos." on agendamentos_legacy;
create policy "Prestadores podem ver agendamentos de seus servicos." on agendamentos_legacy
  for select using (
    exists (
      select 1 from servicos_legacy
      where servicos_legacy.id = agendamentos_legacy.servico_id
      and servicos_legacy.prestador_id = auth.uid()
    )
  );

drop policy if exists "Clientes podem criar agendamentos." on agendamentos_legacy;
create policy "Clientes podem criar agendamentos." on agendamentos_legacy
  for insert with check (auth.uid() = cliente_id);

create or replace function public.lidar_com_novo_usuario()
returns trigger as $$
begin
  insert into public.perfis (id, nome_completo, email, tipo_usuario)
  values (new.id, new.raw_user_meta_data->>'nome_completo', new.email, new.raw_user_meta_data->>'tipo_usuario');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists ao_criar_usuario_auth on auth.users;
create trigger ao_criar_usuario_auth
  after insert on auth.users
  for each row execute procedure public.lidar_com_novo_usuario();
