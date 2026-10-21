# feature: ranking

Ranking da aluna (/app/ranking) e o cartão do ranking no Início.

| Arquivo                            | Faz                                                                                                           |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| pages/RankingPage.tsx              | Abas Mês e Ano, pódio, quanto falta para subir, lista do 4º em diante e Como ganhar pontos                    |
| components/Podio.tsx               | Pódio: 2º, 1º (mais alto, com coroa) e 3º, com foto ou inicial e base prata, dourada e terracota              |
| components/ComoGanhar.tsx          | Como ganhar pontos: regras_pontos ligadas, na ordem do painel                                                 |
| components/Inicial.tsx             | Foto de perfil ou inicial em círculo colorido                                                                 |
| components/MinhaPosicao.tsx        | Linha curta: posição e quanto falta para subir uma posição                                                    |
| components/ListaRanking.tsx        | Linhas com posição, foto ou inicial, nome e valor; a dela em verde com "Você", fixa no rodapé se sair da tela |
| components/CartaoRankingInicio.tsx | Início: "4º lugar" e "+10 pts no último treino"                                                               |
| api/ranking.api.ts                 | ranking_pontos (mes ou ano), o último lançamento positivo dela e as regras de pontos                          |

O banco soma lancamentos_pontos do mês ou do ano (Brasília), só alunas; quem marcou "não aparecer" some para as outras e vê a própria posição. Peso e medidas nunca entram.
Exporta (index.ts): RankingPage, CartaoRankingInicio, ListaRanking, useMinhaPosicao, useLugarNoPodio (coroinha na foto dela no Início e no Perfil), useRetratos, useRegrasPontos e usePontosDaRegra (pontos de uma ação, ex.: Entrar · +75 nas lives).
