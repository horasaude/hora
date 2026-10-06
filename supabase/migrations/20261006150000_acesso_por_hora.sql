alter table public.perfis
  add column acesso_inicio_em timestamptz,
  add column acesso_fim_em timestamptz;

update public.perfis
set acesso_inicio_em = (acesso_inicio::timestamp at time zone 'America/Sao_Paulo'),
    acesso_fim_em = ((acesso_fim + 1)::timestamp at time zone 'America/Sao_Paulo')
where acesso_inicio is not null or acesso_fim is not null;

alter table public.perfis
  drop constraint perfis_acesso_periodo,
  drop column acesso_inicio,
  drop column acesso_fim,
  add constraint perfis_acesso_periodo check (
    acesso_fim_em is null or acesso_inicio_em is null or acesso_fim_em > acesso_inicio_em
  );

create or replace function public.tem_acesso_ativo()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.perfis
    where id = auth.uid()
      and acesso_inicio_em is not null
      and acesso_inicio_em <= now()
      and (acesso_fim_em is null or now() < acesso_fim_em)
  );
$$;

create or replace function public.dia_de_acesso()
returns integer
language sql
stable
security definer
set search_path = public
as $$
  select floor(extract(epoch from (now() - acesso_inicio_em)) / 86400)::integer + 1
  from public.perfis
  where id = auth.uid() and public.tem_acesso_ativo();
$$;

revoke all on function public.tem_acesso_ativo(), public.dia_de_acesso() from public, anon;
grant execute on function public.tem_acesso_ativo(), public.dia_de_acesso() to authenticated, service_role;
