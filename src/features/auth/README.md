# feature: auth

Login com e-mail e senha (Supabase Auth) e proteção de rotas.

| Arquivo                      | Faz                                                    |
| ---------------------------- | ------------------------------------------------------ |
| pages/LoginPage.tsx          | Tela /entrar                                           |
| components/FormLogin.tsx     | Formulário com validação Zod                           |
| components/RotaProtegida.tsx | Redireciona para /entrar sem sessão                    |
| hooks/useSessao.ts           | Sessão atual e mudanças de login                       |
| hooks/useLogin.ts            | Mutação de login e redirecionamento                    |
| hooks/usePapel.ts            | Papel da usuária (aluna ou admin)                      |
| hooks/useNome.ts             | Nome da usuária logada                                 |
| hooks/useMeuPerfil.ts        | Perfil: nome, apelido, consentimento, início do acesso |
| hooks/useSair.ts             | Sair da conta e voltar para /entrar                    |
| api/auth.api.ts              | Chamadas ao Supabase Auth                              |
| schemas/login.schema.ts      | Validação do formulário                                |
| textos.ts                    | Frases da tela                                         |

Exporta (index.ts): LoginPage, RotaProtegida, useSessao, usePapel, useNome, useMeuPerfil, useSair.
