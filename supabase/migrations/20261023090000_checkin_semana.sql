alter table public.checkins drop constraint checkins_tipo_check;
alter table public.checkins add constraint checkins_tipo_check
  check (tipo in ('treino', 'agua', 'cardio', 'tarefa', 'refeicao', 'sono', 'jejum', 'dieta', 'venci'));

alter table public.regras_pontos
  drop constraint regras_pontos_acao_check,
  add constraint regras_pontos_acao_check check (
    acao in ('treino_foto', 'agua', 'cardio', 'tarefa', 'foto_refeicao', 'aula_concluida', 'duvida_forum', 'duvida_util',
      'live', 'indicacao', 'sono', 'jejum', 'dieta', 'venci')
    or acao ~ '^extra_[a-f0-9]{8}$'
  );

alter table public.lancamentos_pontos
  drop constraint lancamentos_pontos_acao_check,
  add constraint lancamentos_pontos_acao_check check (
    acao in ('treino_foto', 'agua', 'cardio', 'tarefa', 'foto_refeicao', 'aula_concluida', 'duvida_forum', 'duvida_util',
      'live', 'indicacao', 'desafio_checkin', 'desafio_bonus', 'ajuste', 'estorno', 'sono', 'jejum', 'dieta', 'venci')
    or acao ~ '^extra_[a-f0-9]{8}$'
  );

insert into public.regras_pontos (acao, nome, pontos, limite_tipo, limite_qtd, ordem)
select x.acao, x.nome, 5, 'por_dia', 1, x.ordem
from (values
  ('sono', 'Sono', 11),
  ('jejum', 'Jejum intermitente', 12),
  ('dieta', 'Dieta', 13),
  ('venci', 'Venci o dia', 14)
) as x(acao, nome, ordem)
where not exists (select 1 from public.regras_pontos r where r.acao = x.acao);
