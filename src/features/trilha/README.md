# feature: trilha

Trilha da aluna (/app/trilha) e aula (/app/trilha/aula/:id; o endereço antigo /app/aula/:id redireciona), seguindo docs/referencias/app-aluna.png.

Fluxo: dias 1 a 7 preparação (uma aula por dia) e "Comece por aqui"; no dia 8 a escolha do tema (modal ao abrir o app e seletor na própria Trilha até escolher); depois as etapas do tema em abas (Arrancada, Constância, Para Sempre).

| Arquivo                         | Faz                                                                                                       |
| ------------------------------- | --------------------------------------------------------------------------------------------------------- |
| pages/TrilhaPage.tsx            | Topo, Comece por aqui, preparação, aviso "Escolha libera em X dias", seletor do tema ou as etapas         |
| pages/AulaPage.tsx              | Vídeo grande, descrição, material (PDF), Concluir aula, Próxima aula, aulas da etapa ao lado, dúvidas     |
| components/TopoTrilha.tsx       | Saudação, "Dia X de 365", barra dourada da etapa ("Faltam X aulas e Y dias para abrir ...") e tag do tema |
| components/ComeceAqui.tsx       | Vídeo e texto do painel e os 5 passos (PassosComece, JanelasComece); completo, vira link pequeno          |
| components/EscolhaTema.tsx      | 5 cartões com ícone, cor e frase do painel; confirmar no segundo passo                                    |
| components/EscolhaAoAbrir.tsx   | Modal do dia 8 sem tema (fechar adia só nesta visita)                                                     |
| components/MeuTema.tsx          | Perfil > Meu tema: trocar com aviso de que a etapa recomeça no novo tema                                  |
| components/Etapas.tsx           | Abas com cadeado, etapa fechada com as duas metas em barras, aviso de conquista dourado                   |
| components/CartaoAula.tsx       | Dia, título, duração e estado: liberada, concluída (✓ verde), bloqueada (cadeado e quando libera)         |
| components/Concluir.tsx         | Concluir aula em vidro verde (pontos uma vez só); depois só a tag Aula concluída                          |
| components/Temas.tsx, corDoTema | Ícone, tag e cor de cada tema pela chave fixa                                                             |
| api/trilha.api.ts               | trilha_aluna, aula liberada, concluir, escolher_tema                                                      |
| api/comece.api.ts               | comece_aqui, passos feitos (medidas e foto contam pelos registros), regras de pontos                      |

Regras em src/domain/trilha.ts (condicoesDaEtapa, etapaAtual, aulasEmAndamento) e src/domain/dia.ts. O banco é quem libera: trilha_aluna abre a próxima etapa quando as metas fecham (atualizar_etapas) e a RLS de aulas usa aula_liberada.
Exporta (index.ts): TrilhaPage, AulaPage, useTrilha, EscolhaAoAbrir, MeuTema, TagTema.
