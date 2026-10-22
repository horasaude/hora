# feature: lives

Lives da aluna (/app/lives) e o cartão de live do dia no Início. No celular, o título Comunidade e o seletor Lives | Fórum | Ranking vêm da moldura (src/app/NavegacaoAluna.tsx, Segmento de src/components/ui); o título Lives só aparece no computador.

| Arquivo                    | Faz                                                                                                                                                                        |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| pages/LivesPage.tsx        | Próxima live em destaque, outras agendadas e gravações em lista                                                                                                            |
| components/ProximaLive.tsx | Foto da profissional com dia e hora em coral; embaixo verde ORA: tema, Com Nome · Google Meet, data, contagem, Entrar · +pontos da regra, agenda (.ics) e sino do lembrete |
| components/BotaoEntrar.tsx | "Entrar na live" (dourado) só de 30 min antes até o fim; fora disso, o horário (no destaque, o botão apagado)                                                              |
| components/Player.tsx      | Janela com o vídeo (VideoIncorporado: no Drive tapa o abrir em outra janela) e a descrição da live                                                                         |
| components/Gravacoes.tsx   | Gravações em lista: miniatura (capa do painel ou foto da profissional) com play, tema, profissional e data; Player.tsx abre o vídeo                                        |
| components/LiveHoje.tsx    | Início: um aviso só (card dourado da live de hoje com Entrar, ou faixa ocre da próxima live)                                                                               |
| api/lives.api.ts           | lives publicadas, lembretes, presenças e entrar_live                                                                                                                       |

Pontos: entrar_live confere a janela no banco, registra a presença e dá os pontos da regra "Entrar na live" uma vez por live. Gravação não pontua.
Agenda: .ics gerado no navegador (src/lib/ics.ts), com alarme 1 hora antes.

Lembrete ("Me lembrar"): por enquanto só dentro do app (o cartão da live aparece no Início no dia). Falta para ir além:

- notificação push: o PWA não tem push configurado (precisa de chaves VAPID, inscrição do navegador e uma Edge Function que envie);
- e-mail 1 hora antes: não existe envio de e-mail próprio (o e-mail padrão do Supabase só entrega para a equipe); o envio já existe (SMTP do Google Workspace em _shared/email); falta uma rotina no cron que leia lives_lembretes.

Sala do Meet: o painel cria sozinha ao salvar a live (admin/api/meet.api.ts, Edge Function google-meet), restrita, com a equipe (coanfitriã) e as convidadas como membros. A aluna não lê o link: "Entrar" chama a Edge Function live-entrar, que passa por entrar_live (janela e pontos), põe a aluna como membro e devolve o link. Repassado, o link cai no "Pedir para participar".

Gravação: a sala nasce gravando sozinha (artifactConfig do Meet; a gravação vai para o Drive da conta conectada). A Edge Function gravacao-live (cron a cada 10 min, gravacoes_pendentes) acha o vídeo depois que a live acaba, libera para quem tem o link e grava em lives.gravacao_url; a live aparece em Gravações. Sala criada por outra conta (lives_salas.conta) é trocada ao reconectar ou salvar.

Convite na agenda: ao publicar (e ao mudar tema, horário ou duração, ou tirar do ar), equipe, convidadas e alunas com acesso recebem por e-mail o convite .ics, com a atualização ou o cancelamento (Edge Function convites-live, chamada pelo cron).
