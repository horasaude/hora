# Pontos e indicações (painel)

Página /app/admin/pontos, com abas por ?aba= (regras, historico, fotos, indicacoes) e quatro cartões de resumo (rpc painel_pontos).

| Arquivo                                                    | Faz                                                                                             |
| ---------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| PontosPage.tsx                                             | cartões, abas                                                                                   |
| components/AbaRegras.tsx, RegraJanela.tsx, Interruptor.tsx | tabela de regras com ligar e desligar; editar pontos e limite na Janela (vale dali para frente) |
| components/RegraCampos.tsx, DarPontosJanela.tsx            | Nova ação (nome, pontos, limite) e Dar pontos para as alunas marcadas, só em ações próprias     |
| components/AbaHistorico.tsx, AjusteJanela.tsx              | histórico com filtros aluna, ação e mês; Lançar ajuste com motivo obrigatório                   |
| components/AbaFotos.tsx, FotoJanela.tsx                    | grade de fotos de treino (link assinado); foto aberta grande, Invalidar foto estorna os pontos  |
| components/AbaIndicacoes.tsx                               | indicações com Aguardando garantia, Confirmada, Cancelada                                       |
| api/pontos.api.ts, hooks/usePontos.ts                      | consultas e mutações                                                                            |
| textos.ts                                                  | copy, nomes das ações, linkIndicacao(codigo)                                                    |

Regras no banco (migração 20261007180000_pontos_indicacoes): pontos só por conceder_pontos, histórico imutável (correção e estorno são novos lançamentos), dia contado no fuso de Brasília. Indicação: o código fica em perfis.codigo_indicacao; o link é a página de vendas com ?indicacao=CODIGO, guardado 30 dias no navegador (src/lib/indicacao.ts). O pedido do Mercado Pago ainda vai chamar registrar_indicacao e cancelar_indicacao no reembolso.
