create or replace function public.painel_equipe()
returns table (
  id uuid, nome text, email text, especialidade text, titulo_profissional text, foto_path text,
  convite_pendente boolean, ultimo_acesso timestamptz, eu boolean
)
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public.eh_admin() then
    raise exception 'sem permissão' using errcode = '42501';
  end if;
  return query
  select p.id, p.nome, u.email::text, p.especialidade, p.titulo_profissional, p.foto_path,
    u.last_sign_in_at is null, u.last_sign_in_at, p.id = auth.uid()
  from public.perfis p
  join auth.users u on u.id = p.id
  where p.papel = 'admin'
  order by p.nome;
end;
$$;

create or replace function public.editar_profissional(p_perfil uuid, p_nome text, p_especialidade text, p_titulo text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.eh_admin() then
    raise exception 'sem permissão' using errcode = '42501';
  end if;
  if char_length(btrim(coalesce(p_nome, ''))) not between 1 and 120 then
    raise exception 'nome obrigatório' using errcode = '22023';
  end if;
  update public.perfis
  set nome = btrim(p_nome), especialidade = p_especialidade,
    titulo_profissional = nullif(btrim(coalesce(p_titulo, '')), ''), updated_at = now()
  where id = p_perfil and papel = 'admin';
  if not found then
    raise exception 'profissional não encontrada' using errcode = '22023';
  end if;
end;
$$;

create or replace function public.remover_profissional(p_perfil uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.eh_admin() then
    raise exception 'sem permissão' using errcode = '42501';
  end if;
  if p_perfil = auth.uid() then
    raise exception 'não pode tirar o próprio acesso' using errcode = '22023';
  end if;
  update public.perfis set papel = 'aluna', especialidade = null, updated_at = now()
  where id = p_perfil and papel = 'admin';
  if not found then
    raise exception 'profissional não encontrada' using errcode = '22023';
  end if;
end;
$$;

revoke all on function public.painel_equipe(), public.editar_profissional(uuid, text, text, text), public.remover_profissional(uuid) from public, anon;
grant execute on function public.painel_equipe(), public.editar_profissional(uuid, text, text, text), public.remover_profissional(uuid) to authenticated;
