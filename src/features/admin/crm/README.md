# admin/crm: Membros

Item "Membros" do menu do painel (CRM). Pílulas no topo (AbasCrm): Painel (/app/admin/membros), Alunas (/alunas), Financeiro (/financeiro) e Cancelamentos (/cancelamentos); o menu marca Membros em qualquer uma delas.

| Parte                                 | Faz                                                                                                                                                                                            |
| ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CrmPainelPage.tsx                     | Inscritas, fazendo o processo (entrou nos últimos 3 dias), atenção (3 a 6), paradas (7 ou mais), sem acesso; financeiro do mês, mensalidade em atraso, pausadas, estornadas; lista das paradas |
| FinanceiroPage.tsx, financeiro.api.ts | Vendido no mês e no total, por forma de pagamento, e a lista das vendas (pedidos aprovados, estornados, cancelados ou contestados)                                                             |

Contas em src/domain/crm.ts (resumoMembros, resumoVendas). Valor é o da compra; na mensal, a primeira cobrança.
