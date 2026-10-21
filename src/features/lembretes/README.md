# feature: lembretes

Pedidos da equipe para a aluna: a profissional toca em Lembrar na ficha (painel > Alunas, "O que ela já fez") e a aluna vê no Início o cartão "A equipe pediu" com o botão Fazer; se ativou as notificações, também chega no celular (Edge Function lembrar-aluna).

| Arquivo                        | Faz                                                         |
| ------------------------------ | ----------------------------------------------------------- |
| components/PedidosDaEquipe.tsx | Cartão no Início; some quando ela faz a tarefa              |
| api/lembretes.api.ts           | meus_lembretes(): pedidos ainda pendentes (o banco confere) |

Banco (migração 20261101130000_pendencias_aluna): pendencias_de (anamnese publicada, 5 passos do Comece por aqui, tema a partir do dia 8, nível e local do treino), pendencias_aluna (equipe), lembrar_aluna (equipe; um pedido por item a cada 12 horas), tabela lembretes_aluna.
Exporta (index.ts): PedidosDaEquipe.
