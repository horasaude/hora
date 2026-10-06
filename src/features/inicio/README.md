# feature: inicio

Início da aluna (/app), seguindo docs/referencias/app-aluna.png.

| Arquivo                | Faz                                                                   |
| ---------------------- | --------------------------------------------------------------------- |
| pages/InicioPage.tsx   | Saudação com a inicial, check-in, aula de hoje, próxima live, ranking |
| components/Checkin.tsx | Hábitos (Água, Treino, Cardio, Tarefa) e sequência; só visual por ora |
| components/Cartoes.tsx | Aula de hoje, faixa da live, cartão do ranking                        |
| api/inicio.api.ts      | Próxima live publicada                                                |
| textos.ts              | Copy e os valores de exemplo (check-in, sequência, ranking)           |

Aula de hoje vem de useTrilha (feature trilha). Sem acesso ativo, mostra só o aviso de que o acesso começa na confirmação do pagamento.
Exporta (index.ts): InicioPage.
