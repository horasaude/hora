# feature: trilha

Trilha e aula da aluna, seguindo docs/referencias/app-aluna.png. A liberação é do banco: minha_trilha() traz as aulas fechadas sem link de vídeo, e a tabela aulas só entrega a aula liberada.

| Arquivo                    | Faz                                                                        |
| -------------------------- | -------------------------------------------------------------------------- |
| pages/TrilhaPage.tsx       | Tema atual (dias 1 a 7: Comece por aqui), etapas em abas, progresso, aulas |
| pages/AulaPage.tsx         | Vídeo, profissional e duração, texto, material, marcar como concluída      |
| components/CartaoAula.tsx  | Aula concluída (sálvia), próxima (terracota), liberada, fechada com data   |
| components/Etapas.tsx      | Abas de etapa e barra de progresso                                         |
| components/EstadoAluna.tsx | Carregando, erro e aviso                                                   |
| api/trilha.api.ts          | minha_trilha, dia_de_acesso, aula, aulas_concluidas                        |
| hooks/useTrilha.ts         | Consultas e marcar como concluída                                          |

Regras (aula de hoje, tema atual, progresso, semana, quando abre) em src/domain/trilha.ts.
Exporta (index.ts): TrilhaPage, AulaPage, useTrilha.
