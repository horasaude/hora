# feature: evolucao

Minha evolução da aluna: registro de medidas (peso, cintura, quadril, braço, coxa, data e foto opcional), gráfico de linha e lista. Usada no Perfil e no "Comece por aqui" da Trilha (medidas iniciais).

| Arquivo                            | Faz                                                                        |
| ---------------------------------- | -------------------------------------------------------------------------- |
| components/Evolucao.tsx            | Cartão com abas por medida, gráfico, lista (comLista) e Registrar          |
| components/AntesEDepois.tsx        | Foto mais antiga e mais nova das medidas; o que faltar vira Adicionar foto |
| components/JanelaMinhasMedidas.tsx | Janela com todos os registros e Registrar medidas                          |
| hooks/useVariacao.ts               | Variação de peso e cintura (registro mais novo menos o mais antigo)        |
| components/JanelaMedida.tsx        | Janela de novo registro (vírgula enquanto digita, foto)                    |
| components/GraficoLinha.tsx        | Linha simples da evolução                                                  |
| components/ListaMedidas.tsx        | Registros com foto e Apagar com confirmação                                |
| api/medidas.api.ts                 | medidas da aluna e fotos no espaço privado evolucao                        |
| schemas/medida.schema.ts           | Ao menos uma medida, limites do banco, data até hoje                       |

Só a aluna e as profissionais veem. Peso e medidas nunca entram em ranking.
Exporta (index.ts): Evolucao, JanelaMedida, useMedidas, AntesEDepois, JanelaMinhasMedidas, useVariacao.
