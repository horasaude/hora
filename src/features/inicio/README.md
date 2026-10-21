# feature: inicio

Início da aluna (/app), na ordem do protótipo (ora-apresentacao, tela inicio).

| Arquivo                     | Faz                                                                                                                                                                 |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| pages/InicioPage.tsx        | Topo; pontos; Pedido da equipe (pedidos e anamnese, título some sem nada); avisos; Seu dia (ResumoDoDia do checkin); Continue de onde parou; desafio; live; indicar |
| components/Topo.tsx         | Foto ou inicial com a coroinha, "Dia N da sua jornada", "Oi, Nome" e o sino (leva a Minha conta, onde ficam as notificações)                                        |
| components/CartaoPontos.tsx | Cartão verde: pontos no mês, dias seguidos e posição no ranking; leva ao ranking                                                                                    |
| components/Cartoes.tsx      | Continue de onde parou: próxima aula não concluída do tema do momento, com miniatura, tema e número da aula                                                         |
| components/ProximaLive.tsx  | Próxima live com foto da profissional; com live hoje, o cartão dourado com Entrar (LiveHoje)                                                                        |
| components/Icones.tsx       | Sino, estrela e seta                                                                                                                                                |
| textos.ts                   | Copy                                                                                                                                                                |

No computador, duas colunas: à esquerda pontos, pedidos, avisos, Seu dia e aula; à direita desafio (CartaoDesafioAtivo), live e indicação. Sem acesso ativo, mostra só o aviso de que o acesso começa na confirmação do pagamento.
Exporta (index.ts): InicioPage.
