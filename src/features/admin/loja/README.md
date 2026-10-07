# Loja (painel)

/app/admin/loja, abas por ?aba= (produtos, parceiros); /app/admin/loja/:produtoId abre o produto no cartão da direita com os cliques por semana.

| Arquivo                                                                                      | Faz                                                                                        |
| -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| LojaPage.tsx                                                                                 | resumo (publicados, parceiros ativos, cliques no mês, mais clicado), abas e janelas        |
| components/AbaProdutos.tsx, CliquesSemana.tsx, Miniatura.tsx                                 | tabela com miniatura e o produto aberto com barras de cliques das últimas 8 semanas        |
| components/AbaParceiros.tsx                                                                  | parceiros com logo, cupom geral, contato, produtos e ativo                                 |
| components/ProdutoJanela.tsx, CamposPreco.tsx, ParceiroJanela.tsx, CampoFoto.tsx, Campos.tsx | cadastro em janela grande; foto comprimida no navegador antes de subir (src/lib/imagem.ts) |
| formulario.ts                                                                                | valores iniciais, validação e preço final (desconto em % ou preço final)                   |
| api/loja.api.ts, hooks/useLoja.ts                                                            | consultas, links assinados e salvar                                                        |
