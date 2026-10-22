# feature: auth

Login com e-mail e senha (Supabase Auth) e proteção de rotas.

| Arquivo                      | Faz                                                                                                  |
| ---------------------------- | ---------------------------------------------------------------------------------------------------- |
| pages/LoginPage.tsx          | Tela /entrar: boas-vindas em cima (celular) ou à esquerda (computador) e o formulário                |
| components/BoasVindas.tsx    | Foto das três profissionais com degradê para o verde ORA, logo clara, título, subtítulo e os 4 chips |
| components/FormLogin.tsx     | Formulário com validação Zod                                                                         |
| components/RotaProtegida.tsx | Redireciona para /entrar sem sessão                                                                  |
| hooks/useSessao.ts           | Sessão atual e mudanças de login                                                                     |
| hooks/useLogin.ts            | Mutação de login e redirecionamento                                                                  |
| hooks/usePapel.ts            | Papel da usuária (aluna ou admin)                                                                    |
| hooks/useNome.ts             | Nome da usuária logada                                                                               |
| hooks/useMeuPerfil.ts        | Perfil: nome, apelido, consentimento, início do acesso                                               |
| hooks/useSair.ts             | Sair da conta e voltar para /entrar                                                                  |
| api/auth.api.ts              | Chamadas ao Supabase Auth                                                                            |
| schemas/login.schema.ts      | Validação do formulário                                                                              |
| textos.ts                    | Frases da tela                                                                                       |

Exporta (index.ts): LoginPage, RotaProtegida, useSessao, usePapel, useNome, useMeuPerfil, useSair, useRegistrarAcesso.

## Esqueci minha senha

Na tela de entrar, "Esqueci minha senha" abre components/FormEsqueci.tsx, que chama pedirNovaSenha (supabase.auth.resetPasswordForEmail, volta para /definir-senha). A resposta é a mesma com ou sem conta; só o excesso de pedidos (429) vira aviso.

O e-mail sai pelo Auth do Supabase. Sem SMTP próprio, o Supabase só entrega para a equipe do projeto (2 por hora) e não deixa trocar o modelo. Com o Google Workspace: Authentication > Emails > SMTP Settings (smtp.gmail.com, porta 465, usuário = caixa do Workspace, senha = senha de app dessa caixa, remetente = a mesma caixa ou um alias dela) e aplicar o modelo em português de supabase/templates/nova-senha.html (assunto "Crie uma nova senha no ORA").
