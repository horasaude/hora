# feature: loja

Loja da aluna: /app/loja (faixa do parceiro, filtro por categoria, grade de 3 colunas no computador e 2 no celular, destaques primeiro) e /app/loja/:produtoId (foto grande, preços, descrição, cupom com Copiar cupom e Comprar com desconto, que abre o parceiro em nova aba e registra o clique). O banco só entrega produto publicado de parceiro ativo; as fotos vêm do espaço privado loja por link assinado.

| Arquivo                                                                    | Faz                                                         |
| -------------------------------------------------------------------------- | ----------------------------------------------------------- |
| pages/LojaPage.tsx, pages/ProdutoPage.tsx                                  | vitrine e produto aberto                                    |
| components/Faixa.tsx, CartaoProduto.tsx, Precos.tsx, Cupom.tsx, Estado.tsx | faixa, cartão, preços com etiqueta dourada, cupom e estados |
| api/loja.api.ts, hooks/useLoja.ts                                          | vitrine com links das fotos, registrar clique               |

Desconto, preço final e ordem da vitrine em src/domain/loja.ts. No computador a Loja está no menu; no celular a barra segue com 5 ícones e a Loja entra pelo Início.
