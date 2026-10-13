# admin/treinos: Treinos

Item "Treinos" do menu do painel (bolinha coral, abaixo de Plano alimentar), no padrão do Plano alimentar. Pílulas no topo (components/QuadroTreinos.tsx, com os KPIs): Treinos | Exercícios | Modelos | Publicados (rotas /app/admin/treinos, /exercicios, /modelos, /publicados; /treinos/novo abre a janela de novo treino).

| Parte                                                    | Faz                                                                                                                                                                                                                 |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| pages/ExerciciosPage.tsx, components/ExercicioJanela.tsx | Biblioteca: busca, filtros por grupo e equipamento; janela com vídeo e prévia, foto (espaço treinos), instruções e erros comuns                                                                                     |
| pages/TreinosPainelPage.tsx, components/TreinoJanela.tsx | Montar treino: dados (CamposTreino), aquecimento e alongamento opcionais, exercícios (ItensTreino: arrastar, duplicar, remover; AdicionarExercicio busca na biblioteca); Salvar rascunho, Publicar, Duplicar treino |
| pages/ModelosPage.tsx, components/RotinaJanela.tsx       | Rotina semanal: treino de cada dia ou descanso; a aluna vê a publicada do tema e do nível dela                                                                                                                      |
| pages/PublicadosPage.tsx                                 | Só o que as alunas já veem                                                                                                                                                                                          |
| api/treinos.api.ts                                       | Tabelas e RPCs salvar_treino, salvar_rotina, resumo_treinos (migração 20261015090000_treinos)                                                                                                                       |

Nomes de grupo, equipamento, nível, local e dias em src/domain/treinos.ts (os mesmos da aluna).
