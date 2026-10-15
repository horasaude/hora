# feature: avisos

Avisos da equipe para as alunas (criados no painel em Avisos). No Início, os publicados dos últimos 30 dias que ela ainda não fechou aparecem no topo; "Entendi" guarda neste aparelho (localStorage ora-avisos-lidos).

| Arquivo                    | Faz                                                                            |
| -------------------------- | ------------------------------------------------------------------------------ |
| components/AvisosNovos.tsx | Cartões dourados com título, texto e data; até 3 por vez                       |
| hooks/useAvisos.ts         | Lista do banco menos os já fechados                                            |
| api/avisos.api.ts          | avisos publicados e com publicar_em já passado (RLS também exige acesso ativo) |

Exporta (index.ts): AvisosNovos.
