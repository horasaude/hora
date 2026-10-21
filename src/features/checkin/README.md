# feature: checkin

Check-in da semana da aluna (cartão do Início), como a planilha da Laís: Sono, Hidratar-se, Dieta, Treino (com foto) e Venci o dia? (marca sozinho, pelo banco, quando os outros quatro estão feitos; não é manual), de segunda a domingo; marca só o dia de hoje (horário de Brasília). Refeição com foto continua no cardápio; Cardio e Tarefa seguem válidos no banco.

| Arquivo                                                                  | Faz                                                                                                                                                   |
| ------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| components/CheckinHoje.tsx, GradeSemana.tsx, IconesHabito.tsx, icones.ts | "Semana 01" (semana da aluna), grade de hábitos por dia com ✓, legenda no celular e o "+5" que sobe e some                                            |
| pages/DiaPage.tsx (/app/dia)                                             | Seu dia: lista dos hábitos de hoje, Venci o dia e, ao lado ou embaixo, a semana (CheckinHoje semAgua)                                                 |
| components/ListaHabitos.tsx, LinhaHabito.tsx, LinhaAgua.tsx              | Sono, Água (copos de 250 ml até a meta, +250, +500, desfazer, lembrete), Dieta, Treino com foto e Refeição (leva ao cardápio), com os pontos da regra |
| components/VenciODia.tsx                                                 | Cartão que fica dourado quando o banco marca venci (só mostra o estado)                                                                               |
| components/ResumoDoDia.tsx                                               | Início: as 4 bolinhas de hoje e Ver tudo                                                                                                              |
| components/JanelaFoto.tsx                                                | Foto do treino ou da refeição: câmera no celular, arquivo no computador, prévia                                                                       |
| components/CamposTreino.tsx                                              | Tipo de treino (musculação, caminhada, corrida, funcional, outro) e duração opcional                                                                  |
| components/Sequencia.tsx                                                 | Bolinhas douradas dos últimos 7 dias e "X dias seguidos"                                                                                              |
| hooks/useCheckin.ts                                                      | useMeusCheckins (60 dias), useSequencia, useFazerCheckin, useHoje                                                                                     |
| api/checkin.api.ts                                                       | Lê os check-ins válidos e chama fazer_checkin (foto comprimida em src/lib/fotos.ts)                                                                   |
| schemas/treino.schema.ts                                                 | Foto obrigatória, tipo da lista, duração de 1 a 600 minutos                                                                                           |

Pontos: o banco (fazer_checkin) valida foto, tipo e acesso, grava e chama conceder_pontos com o valor da regra do painel; devolve os pontos ganhos (0 se já tinha). Fotos no espaço privado checkins, na pasta da aluna; só ela e as profissionais veem.
Exporta (index.ts): CheckinHoje (prop semAgua), useSequencia, useHoje, RegistrarRefeicao, RegistrarTreino, PontosDoDia, Notificacoes, DiaPage, ResumoDoDia.
