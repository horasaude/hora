# feature: treinos

Treinos da aluna (/app/treinos e /app/treinos/:id), em vidro coral. No computador, "Treinos" no menu lateral logo abaixo de Cardápios; no celular, pílula dentro de Trilhas (Temas | Cardápios | Treinos).

| Arquivo                                      | Faz                                                                                                                                                                            |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| pages/TreinosPage.tsx                        | Primeiro acesso (EscolhaNivelLocal: nível e local em dois passos), Treino de hoje, a semana com check verde e Outros treinos                                                   |
| components/Hoje.tsx                          | TreinoDeHoje (pela rotina e pelo dia da semana; dia sem treino mostra o próximo) e SemanaTreinos                                                                               |
| pages/ExecucaoPage.tsx, hooks/useExecucao.ts | Exercício por exercício (aquecimento e alongamento como passos), bolinhas das séries, descanso, Anterior e Próximo, barra coral; tela cheia no celular; ?passo= abre num passo |
| components/Descanso.tsx                      | Cronômetro regressivo (src/domain/cronometro.ts) com bipe curto opcional (Web Audio)                                                                                           |
| components/Concluido.tsx                     | "Treino concluído" com Registrar com foto (RegistrarTreino da checkin: mesmo check-in, +10 uma vez por dia)                                                                    |
| components/PreferenciasTreino.tsx            | Minha conta: trocar nível e local                                                                                                                                              |
| components/TreinosFeitos.tsx                 | Minha evolução: calendário do mês com ponto coral nos dias com treino                                                                                                          |
| pages/PreviaTreinosPage.tsx, previa.ts       | Painel > Ver como aluna > Ver Treinos: mesmo tema da prévia, publicado só, sem gravar nada                                                                                     |
| api/treinos.api.ts                           | Leituras (RLS: publicados do tema dela ou Preparação; exercícios só com acesso ativo) e treinos_feitos                                                                         |

Regras em src/domain/treinos.ts (treino de hoje, semana, progresso) e src/domain/cronometro.ts.
Exporta (index.ts): TreinosPage, ExecucaoPage, PreviaTreinosPage, PreviaExecucaoPage, PreferenciasTreino, TreinosFeitos.
