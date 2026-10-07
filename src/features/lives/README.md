# feature: lives

Lives da aluna (/app/lives) e o cartão de live do dia no Início.

| Arquivo                    | Faz                                                                                                    |
| -------------------------- | ------------------------------------------------------------------------------------------------------ |
| pages/LivesPage.tsx        | Próxima live em destaque, outras agendadas e gravações                                                 |
| components/ProximaLive.tsx | Borda dourada, foto e nome da profissional, data, contagem, Adicionar à agenda, Me lembrar             |
| components/BotaoEntrar.tsx | "Entrar na live" (dourado) só de 30 min antes até o fim; fora disso, o horário                         |
| components/Gravacoes.tsx   | Gravações: capa do painel (capa_url) ou foto da profissional em círculo sobre areia com play verde ORA |
| components/LiveHoje.tsx    | Início: live de hoje com a hora e Entrar                                                               |
| api/lives.api.ts           | lives publicadas, lembretes, presenças e entrar_live                                                   |

Pontos: entrar_live confere a janela no banco, registra a presença e dá os pontos da regra "Entrar na live" uma vez por live. Gravação não pontua.
Agenda: .ics gerado no navegador (src/lib/ics.ts), com alarme 1 hora antes.

Lembrete ("Me lembrar"): por enquanto só dentro do app (o cartão da live aparece no Início no dia). Falta para ir além:

- notificação push: o PWA não tem push configurado (precisa de chaves VAPID, inscrição do navegador e uma Edge Function que envie);
- e-mail 1 hora antes: não existe envio de e-mail próprio (o e-mail padrão do Supabase só entrega para a equipe); precisa de um serviço como Resend e uma rotina no cron que leia lives_lembretes.
