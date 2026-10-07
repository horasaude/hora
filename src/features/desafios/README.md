# feature: desafios

Desafios da aluna (/app/desafios e /app/desafios/:id) e o cartão do desafio em andamento no Início.

| Arquivo                           | Faz                                                                                     |
| --------------------------------- | --------------------------------------------------------------------------------------- |
| pages/DesafiosPage.tsx            | Abas Do mês e Encerrados, cartões em grade                                              |
| pages/DesafioPage.tsx             | Regras, meta, prêmio, barra, check-in do dia, calendário e ranking do desafio           |
| components/CartaoDesafio.tsx      | Nome, período, participantes, prêmio, etiqueta Participando (verde) ou Entrar (dourado) |
| components/CartaoEncerrado.tsx    | Quanto ela completou e as vencedoras                                                    |
| components/CheckinDesafio.tsx     | Entrar no desafio; check-in por tipo: Fiz hoje, foto (câmera) ou número                 |
| components/CalendarioDesafio.tsx  | Dias do período: feito em vidro verde com ✓, hoje com contorno dourado                  |
| components/Progresso.tsx          | Barra dourada "Dia X de N · faltam Y para o prêmio"                                     |
| components/RankingDesafio.tsx     | Ranking pelo apelido (ListaRanking da feature ranking)                                  |
| components/CartaoDesafioAtivo.tsx | Início: desafio em andamento de que ela participa, com barra e check-in                 |
| api/desafios.api.ts               | meus_desafios, desafio_checkins dela, ranking_desafio, entrar_desafio, checkin_desafio  |

Regras no banco: entrar e marcar só com acesso ativo, no período e com o dado do tipo (número ou foto); um check-in por dia; pontos do dia e bônus pelo gatilho pontos_do_desafio. Foto no espaço privado checkins, na pasta da aluna. Quem escolheu não aparecer no ranking some para as outras.
Exporta (index.ts): DesafiosPage, DesafioPage, CartaoDesafioAtivo, useDesafios.
