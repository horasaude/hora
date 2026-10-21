# feature: avaliacoes

Avaliações da aluna (/app/avaliacoes e /app/avaliacoes/:anamneseId): anamneses publicadas no painel (admin/treinos, aba Anamnese).

| Arquivo                                    | Faz                                                                                                                                      |
| ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| pages/AvaliacoesPage.tsx                   | Para responder (com o quanto já respondeu) e Respondidas                                                                                 |
| pages/AnamnesePage.tsx, hooks/useResponder | Uma pergunta por vez, barra de progresso, obrigatória trava o Avançar; guarda a cada Avançar e envia na última; enviada fica só para ler |
| components/CampoResposta.tsx               | Texto livre, Sim ou Não, ou uma das opções                                                                                               |
| components/AvisoAnamnese.tsx               | Aviso no Início e em Treinos enquanto houver anamnese sem enviar                                                                         |
| components/ArquivosDaEquipe.tsx            | Minha evolução: arquivos que a equipe mandou só para ela (espaço arquivos_aluna, link de 5 minutos), com Baixar                          |
| api/avaliacoes.api.ts                      | anamneses publicadas e anamnese_respostas dela (RLS: só a dona e a equipe leem; edita até enviar)                                        |

Regras em src/domain/anamnese.ts. Exporta (index.ts): AvaliacoesPage, AnamnesePage, AvisoAnamnese, CartaoAvaliacoes, ArquivosDaEquipe.
