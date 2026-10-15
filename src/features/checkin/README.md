# feature: checkin

Check-in da semana da aluna (cartão do Início), como a planilha da Laís: Sono, Jejum intermitente, Hidratar-se, Dieta, Treino (com foto) e Venci o dia?, de segunda a domingo; marca só o dia de hoje (horário de Brasília). Refeição com foto continua no cardápio; Cardio e Tarefa seguem válidos no banco.

| Arquivo                                                                  | Faz                                                                                                        |
| ------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------- |
| components/CheckinHoje.tsx, GradeSemana.tsx, IconesHabito.tsx, icones.ts | "Semana 01" (semana da aluna), grade de hábitos por dia com ✓, legenda no celular e o "+5" que sobe e some |
| components/JanelaFoto.tsx                                                | Foto do treino ou da refeição: câmera no celular, arquivo no computador, prévia                            |
| components/CamposTreino.tsx                                              | Tipo de treino (musculação, caminhada, corrida, funcional, outro) e duração opcional                       |
| components/Sequencia.tsx                                                 | Bolinhas douradas dos últimos 7 dias e "X dias seguidos"                                                   |
| hooks/useCheckin.ts                                                      | useMeusCheckins (60 dias), useSequencia, useFazerCheckin, useHoje                                          |
| api/checkin.api.ts                                                       | Lê os check-ins válidos e chama fazer_checkin (foto comprimida em src/lib/fotos.ts)                        |
| schemas/treino.schema.ts                                                 | Foto obrigatória, tipo da lista, duração de 1 a 600 minutos                                                |

Pontos: o banco (fazer_checkin) valida foto, tipo e acesso, grava e chama conceder_pontos com o valor da regra do painel; devolve os pontos ganhos (0 se já tinha). Fotos no espaço privado checkins, na pasta da aluna; só ela e as profissionais veem.
Exporta (index.ts): CheckinHoje, useSequencia, useHoje.
