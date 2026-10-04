# feature: vendas

Página de vendas pública (rota /), feita para tráfego pago no celular. Não importa Supabase nem nada da área da aluna: o login e o app carregam sob demanda.

| Arquivo                 | Faz                                                          |
| ----------------------- | ------------------------------------------------------------ |
| pages/VendasPage.tsx    | Monta as seções na ordem da página                           |
| components/Topo.tsx     | Logo, promessa e botão para os preços                        |
| components/Conteudo.tsx | O que é a HORA, as três profissionais e como funciona        |
| components/Precos.tsx   | Preços vigentes (src/domain/precos.ts) e contagem regressiva |
| components/Final.tsx    | Garantia e fidelidade, perguntas frequentes e rodapé         |
| components/Secao.tsx    | Moldura das seções e botão em forma de link                  |
| hooks/useAgora.ts       | Hora atual a cada segundo                                    |
| textos.ts               | Toda a copy da página (provisória). Trocar texto é só aqui   |

Preços: até FIM_OFERTA_ORA vale a condição do ORA (13 meses de acesso); depois, os preços cheios entram sozinhos, sem deploy.
Pagamento: o botão fica desativado até a tarefa 3 (links do Mercado Pago). Fotos das profissionais: hoje mostram as iniciais.

Exporta (index.ts): VendasPage.
