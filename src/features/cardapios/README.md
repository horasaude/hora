# feature: cardapios

Cardápios e receitas da aluna (/app/cardapios, /app/cardapios/:id, /app/cardapios/:id/compras, /app/cardapios/receitas/:id).

| Arquivo                       | Faz                                                                                                       |
| ----------------------------- | --------------------------------------------------------------------------------------------------------- |
| pages/CardapiosPage.tsx       | Abas sublinhadas Meu cardápio e Receitas (?aba=receitas)                                                  |
| components/ListaCardapios.tsx | Cardápios publicados do tema dela (antes do tema, todos, com aviso)                                       |
| pages/CardapioPage.tsx        | Refeições em ordem de horário, total do dia, Lista de compras                                             |
| components/RefeicaoCartao.tsx | Horário, itens em medida caseira e gramas, Ver substituições, totais, Registrar refeição, link da receita |
| pages/ListaComprasPage.tsx    | 3, 7 ou 14 dias, por categoria, marcar item (salvo por aluna e cardápio), WhatsApp e Imprimir             |
| components/ListaReceitas.tsx  | Busca, filtro por refeição e tema, só favoritas                                                           |
| pages/ReceitaPage.tsx         | Ingredientes, preparo numerado, rendimento, nutrição por porção, favoritar                                |
| api/_.ts, hooks/_.ts          | cardápios (RLS: só publicados), ingredientes das receitas, marcados, receitas e favoritas                 |

Formato do cardápio em src/domain/formatoCardapio.ts (o mesmo do painel); lista em src/domain/listaCompras.ts; nutrição em src/domain/nutricao.ts. "Registrar refeição" usa RegistrarRefeicao da feature checkin (mesma regra de pontos).
Cardápio hoje tem um dia só (o painel monta um dia); as abas de dia da semana entram quando o painel tiver cardápio de vários dias.
Exporta (index.ts): CardapiosPage, CardapioPage, ListaComprasPage, ReceitaPage.
