# feature: forum

Fórum da aluna: /app/forum (lista com busca, categoria e Minhas dúvidas), /app/forum/:duvidaId (conversa) e a seção Dúvidas desta aula dentro da aula. Tudo vem do banco por funções (forum_listar e as outras forum_*), que mostram a aluna só pelo apelido.

| Arquivo                                                   | Faz                                                                                                  |
| --------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| pages/ForumPage.tsx                                       | fórum geral, filtros, cartões, Ver mais, regras na primeira entrada                                  |
| pages/DuvidaPage.tsx                                      | conversa inteira e resposta; marca a resposta como vista                                             |
| components/Duvida.tsx                                     | cabeçalho (apelido, categoria, aula, data), cartão da lista e Conversa                               |
| components/Resposta.tsx                                   | resposta; a das profissionais em destaque com foto, nome, título e Resposta útil; curtir e denunciar |
| components/EnviarDuvida.tsx                               | botão e janela de texto e categoria, com o aviso das 72 horas                                        |
| components/Responder.tsx, Denunciar.tsx, RegrasJanela.tsx | responder na tela, denunciar com motivo opcional, regras com Entendi                                 |
| components/DuvidasDaAula.tsx                              | seção embaixo do vídeo da aula                                                                       |
| components/AvisoRespondida.tsx                            | aviso no Início: Sua dúvida foi respondida                                                           |
| api/forum.api.ts, hooks/useForum.ts                       | chamadas e consultas                                                                                 |

Categorias, especialidades e o prazo (verde, dourado com menos de 12 h, coral vencido) em src/domain/forum.ts. Pontos: enviar dúvida 5 (até 2 por dia), útil 10, pelo motor de pontos; ocultar a dúvida estorna. No celular a barra segue com 5 ícones e o fórum entra pelo Início e pela aula; no computador está no menu.
Exporta (index.ts): ForumPage, DuvidaPage, DuvidasDaAula, AvisoRespondida, Conversa, Responder, buscarDuvida.
