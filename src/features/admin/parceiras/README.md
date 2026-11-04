# admin/parceiras: Cadastrar parceira

Blogueiras e parceiras com acesso de cortesia, sem pagamento. Botão Cadastrar parceira no topo de Membros > Alunas.

| Arquivo                        | Faz                                                                    |
| ------------------------------ | ---------------------------------------------------------------------- |
| ParceiraJanela.tsx             | nome, e-mail e prazo (1, 3, 6 ou 12 meses); mostra se o e-mail saiu    |
| Parceria.tsx                   | BotaoParceira (abre a janela) e ReenviarEmail (na ficha da parceira)   |
| parceiras.api.ts, useParceiras | chamam a Edge Function cadastrar-parceira (ações cadastrar e reenviar) |

No servidor: a função cria a conta confirmada (ou usa a que já existe), registrar_parceira libera o acesso a partir de agora e grava em parceiras e acessos_liberados, e o e-mail leva o link /acesso/<código>, que não vence até ela criar a senha. Quem já tem acesso pago ou é da equipe é recusado.
