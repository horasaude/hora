# feature: admin

Painel das profissionais em /app/admin, só para papel admin (o banco garante com RLS; a tela só esconde). Mobile primeiro: abas fixas embaixo (Conteúdo, Lives, Avisos).

| Arquivo                     | Faz                                                                 |
| --------------------------- | ------------------------------------------------------------------- |
| components/PainelLayout.tsx | Moldura, guarda de papel (usePapel da feature auth) e abas          |
| pages/ConteudoPage.tsx      | Temas: criar, publicar, reordenar                                   |
| pages/TemaPage.tsx          | Um tema: editar, etapas (criar, editar, publicar, reordenar)        |
| components/EtapaCartao.tsx  | Etapa com as aulas dela e o atalho para nova aula                   |
| pages/AulaPage.tsx          | Criar e editar aula (/aulas/nova?etapa=&tema=, /aulas/:id?tema=)    |
| components/FormAula.tsx     | Aula: vídeo com prévia, material, liberação (compra, 7 dias, outro) |
| pages/LivesPage.tsx         | Lista e formulário de lives (horário de Brasília)                   |
| pages/AvisosPage.tsx        | Lista e formulário de avisos (aparece a partir de)                  |
| components/Linha.tsx        | Linha de lista: abrir, publicar/tirar do ar, subir e descer         |
| components/FormNome.tsx     | Nome e descrição (tema e etapa)                                     |
| components/FormAgenda.tsx   | Formulário genérico de live e aviso                                 |
| api/conteudo.api.ts         | temas, etapas, aulas, publicar e mover (RPC mover_tema/etapa/aula)  |
| api/agenda.api.ts           | lives e avisos                                                      |
| hooks/usePainel.ts          | Consultas e mutações (React Query)                                  |
| schemas/formularios.ts      | zod dos formulários; liberação dia 1 / dia 8 / outro                |
| textos.ts                   | Toda a copy do painel                                               |

Reordenar troca duas posições numa função do banco (etapas com ordem única adiável), então nunca fica ordem repetida no meio da troca. Prévia de vídeo: src/lib/video.ts (YouTube, Vimeo, Google Drive). Sem exclusão nesta versão: tirar do ar é o caminho.

Exporta (index.ts): PainelLayout e as páginas (carregadas sob demanda pelo router).
