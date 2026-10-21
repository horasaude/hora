# feature: desafios

Desafios da aluna (/app/desafios e /app/desafios/:id) e o cartão do desafio em andamento no Início.

| Arquivo                           | Faz                                                                                                              |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| pages/DesafiosPage.tsx            | Abas Do mês e Encerrados, cartões em grade                                                                       |
| pages/DesafioPage.tsx             | Topo com voltar, prêmio em destaque, nome e regra curta, barra e calendário, Fiz hoje · +N, Quem está no desafio |
| components/PremioDesafio.tsx      | Cartão do prêmio (dourado claro, caixa com presente) e a faixa do prêmio da lista                                |
| components/CartaoDesafio.tsx      | Nome, período, participantes, etiqueta Participando ou Entrar, faixa dourada do prêmio                           |
| components/CartaoEncerrado.tsx    | Quanto ela completou e as vencedoras                                                                             |
| components/CheckinDesafio.tsx     | Entrar no desafio; check-in por tipo: Fiz hoje · +N pontos, foto (câmera) ou número                              |
| components/CalendarioDesafio.tsx  | Dias do período em quadradinhos: feito verde, hoje tracejado dourado                                             |
| components/Progresso.tsx          | Barra dourada "Dia X de N · faltam Y para o prêmio"                                                              |
| components/RankingDesafio.tsx     | Quem está no desafio · N alunas, ranking pelo apelido (ListaRanking da feature ranking)                          |
| components/CartaoDesafioAtivo.tsx | Início: desafio em andamento de que ela participa, com barra e check-in                                          |
| api/desafios.api.ts               | meus_desafios, desafio_checkins dela, ranking_desafio, entrar_desafio, checkin_desafio                           |

Regras no banco: entrar e marcar só com acesso ativo, no período e com o dado do tipo (número ou foto); um check-in por dia; pontos do dia e bônus pelo gatilho pontos_do_desafio. Foto no espaço privado checkins, na pasta da aluna. Quem escolheu não aparecer no ranking some para as outras.
Exporta (index.ts): DesafiosPage, DesafioPage, CartaoDesafioAtivo, useDesafios.
