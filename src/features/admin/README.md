# feature: admin

Painel das profissionais em /app/admin, só para papel admin (o banco garante com RLS; a tela só esconde). Visual igual ao apresentado às clientes (docs/referencias/painel-apresentado.png): barra lateral verde fixa no computador (menu com botão no celular), título grande, cartões de resumo coloridos, tabela branca e o item aberto num cartão à direita, sem sair da tela.

Criar e editar sempre abrem a Janela (src/components/ui/Janela.tsx) com os formulários *Form (LiveForm, AvisoForm, CardapioForm, DesafioForm, FormNome, NovoTema, NovaEtapa, FormAula via AulaJanela, configurações via ConfigDetalhe). Em Conteúdo, "+ Nova aula" (vidro verde) abre /app/admin/aulas/nova sem tema; o da etapa já vem com tema e etapa; o cartão da direita só mostra detalhes. /nova e /novo abrem a janela por cima da lista.

Cada endereço de detalhe (/conteudo/:temaId, /aulas/nova, /aulas/:aulaId, /lives/:id, /lives/nova, /avisos/:id, /avisos/novo) abre a mesma tela da lista com o cartão certo à direita. Sem item escolhido, abre o primeiro.

| Arquivo                          | Faz                                                                                                                                                                             |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| components/PainelLayout.tsx      | Moldura, guarda de papel (usePapel), barra lateral e menu do celular                                                                                                            |
| components/MenuLateral.tsx       | Marca, itens com bolinha colorida (ItemMenuLateral de src/components/ui, o mesmo da aluna), "Logada como"                                                                       |
| components/Quadro.tsx            | Título, botão principal, cartões de resumo e divisão tabela/cartão                                                                                                              |
| components/Tabela.tsx            | Tabela, linha que abre o detalhe, etiquetas Publicado/Rascunho                                                                                                                  |
| components/CartaoDetalhe.tsx     | Cartão branco da direita e pares rótulo/valor                                                                                                                                   |
| pages/ConteudoPage.tsx           | Temas: resumo, tabela (ordem), tema novo, tema aberto ou aula                                                                                                                   |
| components/TabelaTemas.tsx       | Tabela de temas com subir e descer                                                                                                                                              |
| components/TemaDetalhe.tsx       | Tema aberto: publicar, editar, etapas e aulas                                                                                                                                   |
| components/EtapaCartao.tsx       | Etapa com as aulas dela e o atalho para nova aula                                                                                                                               |
| components/AulaDetalhe.tsx       | Criar e editar aula (/aulas/nova?etapa=&tema=, /aulas/:id?tema=)                                                                                                                |
| components/FormAula.tsx          | Aula: onde fica (OndeFica: tema e etapa), campos em CamposAula (título, vídeo com prévia, editor da descrição), arquivos, dia; rodapé RodapeAula com Salvar rascunho e Publicar |
| components/NovoTemaEtapa.tsx     | + Novo tema e + Nova etapa no topo de Conteúdo: nome, frase, cor e ordem (etapa escolhe o tema)                                                                                 |
| plano/components/EditorTexto.tsx | Editor simples (negrito e listas; completo: itálico e link), barra em BarraEditor e BarraLink                                                                                   |
| pages/LivesPage.tsx              | Lives: próxima live, agendadas, tabela; LiveDetalhe à direita                                                                                                                   |
| pages/AvisosPage.tsx             | Avisos: ativos, tabela; AvisoDetalhe à direita                                                                                                                                  |
| components/Linha.tsx             | Linha compacta de etapa e aula: abrir, publicar, subir e descer                                                                                                                 |
| components/BotaoPublicar.tsx     | Publicar ou tirar do ar o item aberto                                                                                                                                           |
| components/FormNome.tsx          | Nome e descrição (tema e etapa)                                                                                                                                                 |
| components/FormAgenda.tsx        | Formulário genérico de live e aviso                                                                                                                                             |
| api/conteudo.api.ts              | temas, etapas, aulas, situação das aulas, publicar e mover (RPC)                                                                                                                |
| api/agenda.api.ts                | lives e avisos                                                                                                                                                                  |
| hooks/usePainel.ts               | Consultas e mutações (React Query)                                                                                                                                              |
| schemas/formularios.ts           | zod dos formulários; liberação dia 1 / dia 8 / outro                                                                                                                            |
| textos.ts                        | Toda a copy do painel                                                                                                                                                           |

Reordenar troca duas posições numa função do banco (etapas com ordem única adiável), então nunca fica ordem repetida no meio da troca. Prévia de vídeo: src/lib/video.ts (YouTube, Vimeo, Google Drive). Sem exclusão nesta versão: tirar do ar é o caminho.

Menu na ordem: Conteúdo, Cardápios, Lives, Desafios e prêmios, Pontos e indicações, Fórum, Avisos, Alunas, Financeiro, Loja, Configurações. Status da aluna e situação do desafio em src/domain/painel.ts. Pontos e indicações em pontos/ (README próprio). Desafio aberto mostra participantes com barra dourada (Participantes.tsx, rpc participantes_desafio); prêmio pode ser caixa surpresa. No detalhe da aluna aparece o link de indicação.

Exporta (index.ts): PainelLayout e as páginas de cada módulo (carregadas sob demanda pelo router).
