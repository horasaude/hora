create or replace function public.perguntas_validas(p jsonb)
returns boolean
language sql
immutable
set search_path = public
as $$
  select jsonb_typeof(p) = 'array' and jsonb_array_length(p) <= 60 and coalesce(bool_and(
    jsonb_typeof(q) = 'object'
    and char_length(coalesce(q ->> 'id', '')) between 1 and 40
    and char_length(coalesce(q ->> 'texto', '')) between 2 and 300
    and q ->> 'tipo' in ('texto', 'sim_nao', 'escolha')
    and jsonb_typeof(coalesce(q -> 'opcoes', '[]'::jsonb)) = 'array'
    and jsonb_array_length(coalesce(q -> 'opcoes', '[]'::jsonb)) <= 12
    and (q ->> 'tipo' <> 'escolha' or jsonb_array_length(coalesce(q -> 'opcoes', '[]'::jsonb)) >= 2)
  ), true)
  from jsonb_array_elements(case when jsonb_typeof(p) = 'array' then p else '[]'::jsonb end) as e(q);
$$;

create table public.anamneses (
  id uuid primary key default gen_random_uuid(),
  titulo text not null check (char_length(titulo) between 2 and 120),
  descricao text not null default '' check (char_length(descricao) <= 500),
  perguntas jsonb not null default '[]'::jsonb check (public.perguntas_validas(perguntas)),
  publicada boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger anamneses_updated_at before update on public.anamneses
  for each row execute function public.tocar_updated_at();

create table public.anamnese_respostas (
  anamnese_id uuid not null references public.anamneses (id) on delete cascade,
  perfil_id uuid not null default auth.uid() references public.perfis (id) on delete cascade,
  respostas jsonb not null default '{}'::jsonb
    check (jsonb_typeof(respostas) = 'object' and octet_length(respostas::text) <= 60000),
  enviada_em timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (anamnese_id, perfil_id)
);
create trigger anamnese_respostas_updated_at before update on public.anamnese_respostas
  for each row execute function public.tocar_updated_at();

alter table public.anamneses enable row level security;
alter table public.anamnese_respostas enable row level security;
revoke all on public.anamneses, public.anamnese_respostas from anon, authenticated;
grant select, insert, update, delete on public.anamneses to authenticated;
grant select, insert, update, delete on public.anamnese_respostas to authenticated;

create policy "anamneses: admin edita" on public.anamneses
  for all to authenticated using (public.eh_admin()) with check (public.eh_admin());
create policy "anamneses: aluna com acesso lê as publicadas" on public.anamneses
  for select to authenticated using (publicada and public.tem_acesso_ativo());

create policy "anamnese_respostas: dona e admin leem" on public.anamnese_respostas
  for select to authenticated using (perfil_id = auth.uid() or public.eh_admin());
create policy "anamnese_respostas: dona começa a responder" on public.anamnese_respostas
  for insert to authenticated with check (
    perfil_id = auth.uid() and public.tem_acesso_ativo()
    and exists (select 1 from public.anamneses a where a.id = anamnese_id and a.publicada)
  );
create policy "anamnese_respostas: dona edita até enviar" on public.anamnese_respostas
  for update to authenticated using (perfil_id = auth.uid() and enviada_em is null)
  with check (perfil_id = auth.uid() and public.tem_acesso_ativo());
create policy "anamnese_respostas: admin pede de novo" on public.anamnese_respostas
  for delete to authenticated using (public.eh_admin());

revoke all on function public.perguntas_validas(jsonb) from public, anon;
grant execute on function public.perguntas_validas(jsonb) to authenticated;

insert into public.anamneses (titulo, descricao, publicada, perguntas) values (
  'Anamnese inicial',
  'Suas respostas ajudam a equipe a montar treinos seguros para você. Só a equipe ORA vê.',
  false,
  '[
    {"id": "objetivo", "texto": "Qual é o seu principal objetivo?", "tipo": "escolha", "obrigatoria": true,
     "opcoes": ["Emagrecer", "Ganhar massa muscular", "Condicionamento", "Saúde e qualidade de vida"]},
    {"id": "treina", "texto": "Você pratica atividade física hoje?", "tipo": "sim_nao", "obrigatoria": true, "opcoes": []},
    {"id": "frequencia", "texto": "Quantos dias por semana você consegue treinar?", "tipo": "escolha", "obrigatoria": true,
     "opcoes": ["1 a 2", "3", "4", "5 ou mais"]},
    {"id": "dor", "texto": "Sente dor em alguma articulação (joelho, coluna, ombro)? Conte onde.", "tipo": "texto", "obrigatoria": false, "opcoes": []},
    {"id": "lesao", "texto": "Já teve lesão ou cirurgia? Qual?", "tipo": "texto", "obrigatoria": false, "opcoes": []},
    {"id": "doenca", "texto": "Tem alguma condição de saúde (pressão alta, diabetes, problema no coração)?", "tipo": "sim_nao", "obrigatoria": true, "opcoes": []},
    {"id": "remedios", "texto": "Usa algum remédio contínuo? Qual?", "tipo": "texto", "obrigatoria": false, "opcoes": []},
    {"id": "liberacao", "texto": "Tem liberação médica para atividade física?", "tipo": "sim_nao", "obrigatoria": true, "opcoes": []},
    {"id": "observacoes", "texto": "Quer contar mais alguma coisa para a equipe?", "tipo": "texto", "obrigatoria": false, "opcoes": []}
  ]'::jsonb
);
