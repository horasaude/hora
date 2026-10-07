# Equipe (painel)

/app/admin/configuracoes/equipe, pelo botão Equipe em Configurações. Lista as profissionais (papel admin) com e-mail, especialidade, situação e último acesso.

| Arquivo                               | Faz                                                                                     |
| ------------------------------------- | --------------------------------------------------------------------------------------- |
| EquipePage.tsx                        | resumo, tabela e menu de cada profissional (Editar, Gerar link de acesso, Tirar acesso) |
| components/ProfissionalJanela.tsx     | Convidar profissional (nome, e-mail, especialidade, título) e Editar                    |
| components/LinkAcesso.tsx             | link para enviar à profissional, com Copiar                                             |
| components/TirarAcesso.tsx            | confirma tirar o acesso (a conta volta a aluna sem acesso; não vale para si mesma)      |
| api/equipe.api.ts, hooks/useEquipe.ts | painel_equipe, editar_profissional, remover_profissional e a Edge Function              |

Convite: a Edge Function convidar-profissional confere que quem pede é profissional, cria a conta com a chave de serviço (nunca no site) e devolve um link de uso único. O painel mostra o link para enviar por WhatsApp ou e-mail, porque o e-mail padrão do Supabase não entrega para fora da equipe do projeto. O link abre /definir-senha (auth), onde ela cria a senha e entra no painel. Gerar link de acesso serve para convite vencido ou senha esquecida.
