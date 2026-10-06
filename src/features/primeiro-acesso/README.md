# feature: primeiro-acesso

Aparece só na primeira vez que a aluna entra (perfil sem apelido ou sem consentimento_saude_em): boas-vindas com a logo do ORA, apelido do ranking e aceite do uso dos dados de saúde. Uma coisa por tela, botão "Continuar" grande embaixo.

| Arquivo                          | Faz                                                                      |
| -------------------------------- | ------------------------------------------------------------------------ |
| components/PrimeiroAcesso.tsx    | Os três passos                                                           |
| components/Moldura.tsx           | Marcador de passos, conteúdo e botão Continuar                           |
| schemas/apelido.ts               | Apelido: 2 a 20 caracteres, letras, números, . _ -                       |
| api/primeiroAcesso.api.ts        | Grava apelido e consentimento_saude_em (só colunas liberadas pelo grant) |
| hooks/useSalvarPrimeiroAcesso.ts | Mutação; recarrega ['meu-perfil']                                        |
| textos.ts                        | Copy                                                                     |

Exporta (index.ts): PrimeiroAcesso (usado pelo LayoutAluna em src/app).
