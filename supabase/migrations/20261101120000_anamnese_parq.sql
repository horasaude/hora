update public.anamneses a
set perguntas = (
    select coalesce(jsonb_agg(q order by o), '[]'::jsonb)
    from jsonb_array_elements(a.perguntas) with ordinality as e(q, o)
    where q ->> 'id' <> 'observacoes'
  )
  || '[{"id": "parq_coracao", "texto": "Algum médico já disse que você possui algum problema de coração e que só deveria fazer atividade física com supervisão de profissionais de saúde?", "tipo": "sim_nao", "opcoes": [], "obrigatoria": true}, {"id": "parq_dor_peito", "texto": "Você sente dores no peito quando pratica atividade física?", "tipo": "sim_nao", "opcoes": [], "obrigatoria": true}, {"id": "parq_dor_mes", "texto": "No último mês, você sentiu dores no peito quando praticou atividade física?", "tipo": "sim_nao", "opcoes": [], "obrigatoria": true}, {"id": "parq_tontura", "texto": "Você apresenta desequilíbrio por tontura ou perda de consciência?", "tipo": "sim_nao", "opcoes": [], "obrigatoria": true}, {"id": "parq_osso", "texto": "Você possui algum problema ósseo ou articular que poderia piorar com a atividade física?", "tipo": "sim_nao", "opcoes": [], "obrigatoria": true}, {"id": "parq_remedio", "texto": "Você toma atualmente algum remédio para pressão arterial ou problema de coração?", "tipo": "sim_nao", "opcoes": [], "obrigatoria": true}, {"id": "parq_outra", "texto": "Sabe de alguma outra razão pela qual você não deve praticar atividade física?", "tipo": "sim_nao", "opcoes": [], "obrigatoria": true}]'::jsonb
  || coalesce((select jsonb_agg(q) from jsonb_array_elements(a.perguntas) q where q ->> 'id' = 'observacoes'), '[]'::jsonb),
  publicada = true
where a.titulo = 'Anamnese inicial'
  and not exists (select 1 from jsonb_array_elements(a.perguntas) q where q ->> 'id' = 'parq_coracao');
