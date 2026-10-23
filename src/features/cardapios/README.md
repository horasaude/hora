# feature: cardapios

Cardápios e receitas da aluna (/app/cardapios, /app/cardapios/:id, /app/cardapios/:id/compras, /app/cardapios/receitas/:id).

| Arquivo                       | Faz                                                                                                                                                                                                                  |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| components/ListaCardapios.tsx | Planos alimentares em cartões. Com temaId (aba Cardápio do tema): os planos do tema, "Escolha seu plano" quando há mais de um. Sem temaId: todos, separados por tema (planosPorTema.ts)                              |
| pages/CardapioPage.tsx        | Topo com voltar (TopoVoltar) e nome, refeições em cartões por horário, total do dia, Lista de compras e PDF                                                                                                          |
| components/AcoesCardapio.tsx  | Lista de compras e PDF lado a lado; com PDF enviado pela nutricionista (cardapios.pdf_path, bucket cardapios) o botão abre ele, senão abre a impressão com a versão limpa do cardápio (area-impressao)               |
| components/IconeRefeicao.tsx  | Ícone colorido da refeição pelo nome (café dourado, almoço verde, lanche coral, jantar lilás)                                                                                                                        |
| components/RefeicaoCartao.tsx | Ícone, nome, horário à direita, um alimento por linha (somam) com quantidade à direita e o "ou" na mesma linha, observação, "N opções de troca" em coral (abre as refeições substitutas), totais, Registrar refeição |
| pages/ListaComprasPage.tsx    | 3, 7 ou 14 dias, por categoria, marcar item (salvo por aluna e cardápio), WhatsApp e Imprimir                                                                                                                        |
| components/ListaReceitas.tsx  | Busca, filtro por refeição e tema, só favoritas                                                                                                                                                                      |
| pages/ReceitaPage.tsx         | Ingredientes, preparo numerado, rendimento, nutrição por porção, favoritar                                                                                                                                           |
| api/_.ts, hooks/_.ts          | cardápios (RLS: só publicados), ingredientes das receitas, marcados, receitas e favoritas                                                                                                                            |

Formato do cardápio em src/domain/formatoCardapio.ts (o mesmo do painel); lista em src/domain/listaCompras.ts; nutrição em src/domain/nutricao.ts. "Registrar refeição" usa RegistrarRefeicao da feature checkin (mesma regra de pontos).
Cardápio hoje tem um dia só (o painel monta um dia); as abas de dia da semana entram quando o painel tiver cardápio de vários dias.
Vários planos por tema (desde 2026-10-21): cada cardápio tem tema_id e objetivo (nome do plano, ex.: Emagrecimento, Hipertrofia, Vegetariano); o cartão mostra objetivo, título, kcal do dia (modelo calculado) e quantas refeições, e abre o CardapioPage.
Exporta (index.ts): CardapioPage, ListaComprasPage, ReceitaPage, ListaCardapios, ListaReceitas, ListaMateriais, useMateriais.

Receitas e materiais da nutricionista têm tema (receitas.tema_id, materiais_nutricao.tema_id) e só aparecem dentro dele: abas Receitas e Materiais da página do tema. /app/cardapios redireciona para /app/trilha.
