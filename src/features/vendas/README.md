# feature: vendas

Página de vendas pública (rota /), feita para tráfego pago no celular. Estrutura no estilo da Comunidade Subido de Tráfego, visual no estilo PAIN, nas cores do ORA. Não importa Supabase nem nada da área da aluna.

| Arquivo                          | Faz                                                                    |
| -------------------------------- | ---------------------------------------------------------------------- |
| pages/VendasPage.tsx             | Monta os blocos na ordem da página e guarda as UTMs                    |
| pages/ObrigadaPage.tsx           | /obrigada, para onde o Mercado Pago devolve depois do pagamento        |
| pages/DocumentoPage.tsx          | /termos e /privacidade (textos em textos/legal.ts)                     |
| components/Faixa.tsx             | Faixa fixa da oferta com contagem; some no fim da oferta               |
| components/Abertura.tsx          | Primeira dobra, números de prova e o problema                          |
| components/Produto.tsx           | O que é a HORA e como funciona                                         |
| components/Pessoas.tsx           | As três profissionais (iniciais até chegar a foto) e depoimentos       |
| components/Oferta.tsx            | Para quem é e tudo o que recebe (selos BÔNUS)                          |
| components/Preco.tsx             | Preço ancorado; troca sozinho no fim da oferta                         |
| components/Confianca.tsx         | Prêmios do ranking, garantia e perguntas (acordeão)                    |
| components/Fechamento.tsx        | CTA final e rodapé                                                     |
| components/WhatsAppFlutuante.tsx | Botão flutuante; some sem VITE_WHATSAPP_NUMERO                         |
| components/Destaque.tsx          | `*palavra*` no texto vira serifa itálica colorida                      |
| components/Secao.tsx             | Moldura dos blocos (branco, areia ou verde)                            |
| components/BotaoCompra.tsx       | Todo botão de compra: abre o popup                                     |
| components/compra/CompraProvider | Popup (`<dialog>` nativo), trava a rolagem, pré-carrega o formulário   |
| components/compra/CompraForm     | Forma de pagamento, nome, e-mail, WhatsApp e a linha de termos (lazy)  |
| hooks/useCompraForm.ts           | Grava o lead e vai para o link do Mercado Pago do plano                |
| hooks/useEmOferta.ts, usePrecos  | Oferta e preços vigentes, trocam sozinhos no fim da oferta             |
| api/registrarLead.ts             | Edge Function cadastrar-interessada; nunca lança, espera no máximo 4 s |
| api/pagamento.ts                 | Links VITE_MP_LINK_PIX, _PARCELADO e _RECORRENTE                       |
| flags.ts                         | LOJA_PARCEIRA_CONFIRMADA (bônus da loja, desligado)                    |
| textos.ts e textos/              | Toda a copy. Itens com TODO(clientes) dependem das três                |

Compra: o lead é gravado antes de sair, mas a venda nunca depende dele. Se a função falhar ou demorar, o redirecionamento acontece do mesmo jeito. Sem link configurado, o popup avisa e oferece o WhatsApp.
Mercado Pago: cada link precisa ter a página de retorno apontando para /obrigada.
Fotos das profissionais: colocar em public/profissionais/ e preencher `foto` em textos/produto.ts.

Exporta (index.ts): VendasPage, ObrigadaPage, TermosPage, PrivacidadePage.
