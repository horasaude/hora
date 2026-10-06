# admin/plano: plano alimentar

Grupo "Plano alimentar" do menu do painel, no modelo do Dietbox: Cardápios, Refeições, Receitas e Alimentos (rotas /app/admin/plano/*).

| Parte                                      | Faz                                                                                                                                                                                     |
| ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| pages/AlimentosPage.tsx                    | Abas Meus alimentos e TACO, busca sem acento (palavra por palavra), paginação 10/25/50/100, menu de três pontinhos                                                                      |
| components/AlimentoJanela.tsx              | Cadastro de alimento próprio: valores por 100 g e medidas caseiras (RPC salvar_alimento)                                                                                                |
| pages/ReceitasPage.tsx, ReceitaPage.tsx    | Lista com busca e tag; receita em página inteira: foto (bucket privado receitas, link assinado), editor de texto, porções, tags, cálculo pelos alimentos                                |
| pages/RefeicoesPage.tsx                    | Refeições modelo com tipo e kcal; janela com Salvar e continuar e Salvar e fechar                                                                                                       |
| components/EscolherItem.tsx                | Adicionar alimento: Todas, TACO, Meus alimentos, Receitas; medida caseira e quantidade; opção "ou"                                                                                      |
| pages/CardapiosPage.tsx, CardapioPage.tsx  | Lista com busca e objetivo; editor em página inteira: refeições em blocos, substituições, resumo de nutrientes fixo, lista de compras, visualizar como aluna, PDF (impressão), publicar |
| cardapioForm.ts, receitaForm.ts, opcoes.ts | Estado das páginas e montagem das opções de item                                                                                                                                        |
| schemas/plano.ts                           | Formato do jsonb de refeições e lista de compras; formulário de alimento                                                                                                                |

Regras de cálculo em src/domain/nutricao.ts e src/domain/listaCompras.ts. TACO 4ª edição (NEPA/Unicamp, planilha oficial) importada pela migração 20261007150000_plano_alimentar, só leitura: NA, Tr e * viraram vazio; quatro carboidratos oficiais levemente negativos foram mantidos e contam como zero no cálculo. Alimento da TACO não tem medida caseira; para usar medida, duplicar para Meus alimentos.
