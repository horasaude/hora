# feature: perfil

Perfil da aluna (/app/perfil, Minha evolução): topo centrado (foto, nome, Assinante desde o mês do acesso), três números (variação de peso, de cintura e pontos no mês, com a constância embaixo), Minha evolução (gráfico), Antes e depois e o menu (Avaliações, Indique e ganhe, Minhas medidas, Instalar o app, Minha conta); depois treinos feitos, arquivos da equipe e histórico. No computador, duas colunas. /app/perfil/indique: Indique e ganhe. /app/perfil/conta: Minha conta.

| Arquivo                                                                      | Faz                                                                                                                 |
| ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| pages/PerfilPage.tsx                                                         | Monta a Minha evolução                                                                                              |
| pages/IndiquePage.tsx                                                        | Indique e ganhe: foto das três, pontos da regra indicacao, Seu link com Copiar, Mandar no WhatsApp, Suas indicações |
| components/TopoPerfil.tsx                                                    | Topo centrado com Assinante desde                                                                                   |
| components/MenuPerfil.tsx                                                    | Menu em lista; Minhas medidas e Instalar o app abrem janela (JanelaInstalar.tsx)                                    |
| components/LinkIndicacao.tsx, ListaIndicacoes.tsx, hooks/useLinkIndicacao.ts | campo do link, lista das indicações e o link pessoal                                                                |
| components/Topo.tsx                                                          | Foto ou inicial, nome, apelido e "Dia 12 · Semana 2"; exporta Avatar                                                |
| components/Resumo.tsx                                                        | Variação de peso e cintura, pontos no mês; embaixo dias seguidos, aulas e desafios                                  |
| components/Evolucao.tsx                                                      | Minha evolução: abas por medida, GraficoLinha, ListaMedidas, Registrar medidas                                      |
| components/JanelaMedida.tsx                                                  | Data, peso, cintura, quadril, braço, coxa (vírgula enquanto digita) e foto opcional                                 |
| components/Indicar.tsx                                                       | Cartão de indicação (Desafios e Minha conta), com as mesmas peças da Indique e ganhe                                |
| components/Configuracoes.tsx                                                 | Aparecer no ranking (chave), Editar apelido e foto, Trocar senha, painel (admin) e Sair                             |
| components/Cancelamento.tsx                                                  | Cancelar inscrição (Configurações): até 7 dias estorna tudo; depois o plano segue e não renova (decisão 0006)       |
| components/Historico.tsx                                                     | Histórico de pontos de 10 em 10 (25, 50, 100)                                                                       |
| api/*.ts                                                                     | perfil (apelido, foto, ranking, senha), medidas, indicações e histórico                                             |
| schemas/                                                                     | medida (ao menos uma, limites do banco), apelido e senha                                                            |

Medidas e foto de perfil ficam no espaço privado evolucao, na pasta da aluna; só ela e as profissionais veem. Peso e medidas nunca entram em ranking.
Exporta (index.ts): PerfilPage, ContaPage, IndiquePage, Indicar, ChamadaIndicar (Início, leva a /app/perfil/indique).
