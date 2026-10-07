# feature: ranking

Ranking da aluna (/app/ranking) e o cartão do ranking no Início.

| Arquivo                            | Faz                                                                                             |
| ---------------------------------- | ----------------------------------------------------------------------------------------------- |
| pages/RankingPage.tsx              | Abas Mês e Ano, cartão da posição dela e a lista                                                |
| components/MinhaPosicao.tsx        | Posição, pontos do período e quanto falta para subir uma posição                                |
| components/ListaRanking.tsx        | Linhas com círculo de vidro; a dela em verde claro com "(você)", fixa no rodapé se sair da tela |
| components/CirculoPosicao.tsx      | 1º dourado, 2º prata, 3º coral, demais cinza                                                    |
| components/CartaoRankingInicio.tsx | Início: "4º lugar" e "+10 pts no último treino"                                                 |
| api/ranking.api.ts                 | ranking_pontos (mes ou ano) e o último lançamento positivo dela                                 |

O banco soma lancamentos_pontos do mês ou do ano (Brasília), só alunas; quem marcou "não aparecer" some para as outras e vê a própria posição. Peso e medidas nunca entram.
Exporta (index.ts): RankingPage, CartaoRankingInicio, ListaRanking, useMinhaPosicao.
