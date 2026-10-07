# feature: inicio

Início da aluna (/app), seguindo docs/referencias/app-aluna.png.

| Arquivo                | Faz                                                                                                     |
| ---------------------- | ------------------------------------------------------------------------------------------------------- |
| pages/InicioPage.tsx   | Saudação, resumo (pontos no mês, dias seguidos, posição), check-in, aula, live, ranking e desafio ativo |
| components/Resumo.tsx  | Os três números do topo                                                                                 |
| components/Cartoes.tsx | Aula de hoje e faixa da live                                                                            |
| api/inicio.api.ts      | Próxima live publicada                                                                                  |
| textos.ts              | Copy                                                                                                    |

Aula de hoje vem de useTrilha (feature trilha). Sem acesso ativo, mostra só o aviso de que o acesso começa na confirmação do pagamento.
Exporta (index.ts): InicioPage.
