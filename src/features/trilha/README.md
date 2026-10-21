# feature: trilha

Regra desde 2026-10-20: temas em sequência pela data de assinatura (Detox no dia 1 por 7 dias; depois cada tema abre quando acabam os dias do anterior, temas.dias_liberado). Sem escolha de tema nem etapas. O banco decide (trilha_aluna, tema_aberto, aula_liberada); a página Comece por aqui (pages/TrilhaPage.tsx, components/ListaTemas.tsx) lista os temas e a página do tema (pages/TemaPage.tsx: voltar com o nome, capa, cartão de progresso) tem as abas Aulas, Cardápio (cardapios: ListaCardapios), Treinos (treinos: TreinosDoTema), Desafio (desafios: DesafiosDoTema) e Materiais (materiais-aula com "tema:<id>").

# feature: trilha

Trilha da aluna (/app/trilha) e aula (/app/trilha/aula/:id; o endereço antigo /app/aula/:id redireciona), seguindo docs/referencias/app-aluna.png.

Fluxo: dias 1 a 7 preparação (uma aula por dia) e "Comece por aqui"; no dia 8 a escolha do tema (modal ao abrir o app e seletor na própria Trilha até escolher); depois as etapas do tema em abas (Arrancada, Constância, Para Sempre).

| Arquivo                         | Faz                                                                                                                                                                                  |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| pages/TrilhaPage.tsx            | "Comece por aqui" com a etiqueta "Dia N", uma linha curta, primeiros passos (ComeceAqui) e a lista de temas                                                                          |
| pages/AulaPage.tsx              | Voltar, vídeo, cabeçalho, Concluir e Próxima lado a lado, dica do check automático (YouTube), descrição, materiais e dúvidas; no computador as aulas ficam à direita                 |
| components/ListaTemas.tsx       | Cartões dos temas: capa 16:9 com o nome, cadeado se fechado e faixa com "X de Y aulas · N dias" e Aberto, ou "Abre em N dias"/"Abre no dia N" e Em breve                             |
| components/AbasTema.tsx         | Abas coloridas do tema com ícone (abasDoTema.ts: ids e cores); no celular rolam para o lado                                                                                          |
| components/TopoVoltar.tsx       | Botão redondo de voltar com o título do tema (TopoVoltar) ou o texto "Voltar para o tema" (LinkVoltar); ícones em IconesTrilha.tsx                                                   |
| components/CabecalhoAula.tsx    | Etiqueta verde "Tema · Aula N", título e "Com a profissional · N min"                                                                                                                |
| components/ComeceAqui.tsx       | Vídeo e texto do painel e os 5 passos (PassosComece, JanelasComece); completo, vira link pequeno                                                                                     |
| components/EscolhaTema.tsx      | 5 cartões com ícone, cor e frase do painel; confirmar no segundo passo                                                                                                               |
| components/EscolhaAoAbrir.tsx   | Modal do dia 8 sem tema (fechar adia só nesta visita)                                                                                                                                |
| components/MeuTema.tsx          | Perfil > Meu tema: trocar com aviso de que a etapa recomeça no novo tema                                                                                                             |
| components/Etapas.tsx           | Abas com cadeado, etapa fechada com as duas metas em barras, aviso de conquista dourado                                                                                              |
| components/CartaoAula.tsx       | Miniatura 16:9 (42%) com play ou cadeado, "Aula N", título e bolinha (check quando concluída); a próxima aula com borda verde e sombra                                               |
| components/Concluir.tsx         | Tag verde Aula concluída com "+10 pontos"; o botão Concluir aula só em aula sem vídeo do YouTube (Drive, Vimeo, sem vídeo)                                                           |
| components/VideoYoutube.tsx     | Vídeo do YouTube pela API de iframe (src/lib/youtube.ts); hooks/useAssistir soma só o tempo assistido (src/domain/assistido.ts), guarda em aulas_progresso e conclui sozinho com 90% |
| hooks/useConclusao.ts           | Conclusão pelo botão ou pelo vídeo, pedida uma vez só (os pontos saem uma vez, pelo banco)                                                                                           |
| components/Temas.tsx, corDoTema | Ícone, tag e cor de cada tema pela chave fixa                                                                                                                                        |
| api/trilha.api.ts               | trilha_aluna, aula liberada, concluir, escolher_tema                                                                                                                                 |
| api/comece.api.ts               | comece_aqui, passos feitos (medidas e foto contam pelos registros), regras de pontos                                                                                                 |

Regras em src/domain/trilha.ts (condicoesDaEtapa, etapaAtual, aulasEmAndamento) e src/domain/dia.ts. O banco é quem libera: trilha_aluna abre a próxima etapa quando as metas fecham (atualizar_etapas) e a RLS de aulas usa aula_liberada.
Exporta (index.ts): TrilhaPage, AulaPage, useTrilha, EscolhaAoAbrir, MeuTema, TagTema.

Pré-visualização (painel > Ver como aluna): pages/PreviaPage.tsx com FaixaPrevia; o contexto em previa.ts troca useTrilha por trilha_previa (dia e tema no endereço) e esconde Concluir e dúvidas; o vídeo toca sem gravar progresso nem conclusão. Materiais da aula em components/MateriaisDaAula.tsx pela Edge Function materiais-aula.
