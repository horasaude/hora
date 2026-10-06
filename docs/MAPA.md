# Mapa do projeto

Fonte única de "onde está cada coisa". Atualizado ao fim de cada tarefa (/fim).
Última atualização: referências visuais em docs/referencias.

## Rotas

| Rota           | Página                                               | Feature                       | Acesso      | Carga                    |
| -------------- | ---------------------------------------------------- | ----------------------------- | ----------- | ------------------------ |
| /              | VendasPage                                           | vendas                        | público     | pacote inicial           |
| /obrigada      | ObrigadaPage                                         | vendas                        | público     | pacote inicial           |
| /termos        | TermosPage                                           | vendas                        | público     | pacote inicial           |
| /privacidade   | PrivacidadePage                                      | vendas                        | público     | pacote inicial           |
| /checkout      | CheckoutPage                                         | checkout                      | público     | lazy                     |
| /entrar        | LoginPage                                            | auth                          | público     | lazy (com ComProvedores) |
| /app           | InicioPage                                           | inicio                        | logada      | lazy (AreaAluna + PWA)   |
| /app/admin/... | painel (conteúdo, lives, avisos)                     | admin                         | papel admin | lazy (admin, 25 KB)      |
| checkout       | checkout próprio (resumo, dados, pagamento, lateral) | CheckoutPage, salvarInscricao |
| \*             | vai para /                                           |                               |             |                          |

## Features (src/features)

| Feature | O que faz                                                         | Exporta                                                |
| ------- | ----------------------------------------------------------------- | ------------------------------------------------------ |
| admin   | painel das profissionais: temas, etapas, aulas, lives, avisos     | PainelLayout, ConteudoPage, LivesPage, AvisosPage      |
| auth    | login, sessão, rota protegida                                     | LoginPage, RotaProtegida, useSessao, usePapel, useNome |
| inicio  | tela inicial da aluna (placeholder)                               | InicioPage                                             |
| vendas  | página de vendas, popup de compra, obrigada, termos e privacidade | VendasPage, ObrigadaPage, TermosPage, PrivacidadePage  |

## Referências visuais (docs/referencias)

Telas apresentadas às clientes. Toda tela nova ou refeita segue a referência dela: mesmo layout, cores e componentes. Não inventar outro visual.

| Arquivo                | Vale para                             | Onde já foi aplicada                         |
| ---------------------- | ------------------------------------- | -------------------------------------------- |
| painel-apresentado.png | painel das profissionais (/app/admin) | feature admin (PainelLayout, Quadro, Tabela) |
| app-aluna.png          | área da aluna (/app)                  | ainda não aplicada                           |

## Regras de negócio (src/domain)

| Arquivo   | Regra                                                                                   |
| --------- | --------------------------------------------------------------------------------------- |
| cpf.ts    | CPF válido pelos dígitos verificadores                                                  |
| oferta.ts | oferta do ORA válida até 24/10/2026 23h59 de Brasília                                   |
| precos.ts | preços vigentes (oferta ou cheio), âncora riscada, desconto da oferta, contagem, PLANOS |

## Utilitários (src/lib)

| Arquivo        | Faz                                                |
| -------------- | -------------------------------------------------- |
| supabase.ts    | cliente Supabase tipado                            |
| pwa.ts         | registra o service worker (/app/)                  |
| pwaAntigo.ts   | remove o service worker antigo de escopo /         |
| env.ts         | valida variáveis de ambiente                       |
| datas.ts       | dia e datas no fuso de Brasília                    |
| moeda.ts       | centavos para reais                                |
| telefone.ts    | máscara de telefone e só dígitos                   |
| utm.ts         | lê UTMs da URL e guarda na sessão                  |
| whatsapp.ts    | link wa.me a partir do número com DDD              |
| cpf.ts         | máscara de CPF enquanto digita                     |
| video.ts       | link de prévia (YouTube, Vimeo, Google Drive)      |
| datas.ts (+)   | campo datetime-local em Brasília e data/hora curta |
| navegacao.ts   | sai do site (link de pagamento)                    |
| queryClient.ts | configuração do TanStack Query                     |

## Componentes compartilhados (src/components)

| Componente   | Onde          |
| ------------ | ------------- |
| Botao, Campo | components/ui |

## Banco (supabase)

| Objeto                         | Tipo                                                                                        | Migração                                                                    |
| ------------------------------ | ------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| perfis                         | tabela (RLS)                                                                                | 20261004000000_criar_perfis                                                 |
| papel                          | enum (aluna, admin)                                                                         | 20261004000000_criar_perfis                                                 |
| eh_admin()                     | função                                                                                      | 20261004000000_criar_perfis                                                 |
| criar_perfil_novo_usuario      | trigger em auth.users                                                                       | 20261004000000_criar_perfis                                                 |
| interessadas                   | tabela (RLS, admin lê), sem colunas de contrato                                             | 20261004120000_criar_interessadas, 20261005090000_interessadas_sem_contrato |
| perfis.acesso_inicio_em/fim_em | colunas (início na confirmação do pagamento, com hora; só service role ou admin pelo banco) | 20261006120000_conteudo, 20261006150000_acesso_por_hora                     |
| hoje_brasilia()                | função (data de hoje em Brasília)                                                           | 20261006120000_conteudo                                                     |
| tem_acesso_ativo()             | função (acesso dentro do período)                                                           | 20261006120000_conteudo                                                     |
| dia_de_acesso()                | função (dia 1 = confirmação; muda a cada 24 h exatas)                                       | 20261006150000_acesso_por_hora                                              |
| mover_tema/etapa/aula()        | funções (reordenar; só admin; etapas com ordem única adiável)                               | 20261006180000_ordem_conteudo                                               |
| temas, etapas                  | tabelas (RLS: admin escreve; aluna com acesso lê publicados)                                | 20261006120000_conteudo                                                     |
| aulas                          | tabela (RLS: aluna lê publicadas com dia_liberacao <= dia_de_acesso)                        | 20261006120000_conteudo                                                     |
| lives, avisos                  | tabelas (RLS: aluna lê publicadas; aviso só depois de publicar_em)                          | 20261006120000_conteudo                                                     |

## Edge Functions

| Função                | Faz                                                     | JWT       |
| --------------------- | ------------------------------------------------------- | --------- |
| cadastrar-interessada | valida e grava interessada (honeypot, origem permitida) | desligado |
| \_shared/cors.ts      | CORS pela lista ORIGENS_PERMITIDAS                      |           |

## Infraestrutura

| Item            | Onde                                                       |
| --------------- | ---------------------------------------------------------- |
| CI              | .github/workflows/ci.yml                                   |
| Deploy          | Vercel (vercel.json), time hora3, hora-snowy.vercel.app    |
| Banco           | Supabase zijtjwhvnhfarmfscmnr (sa-east-1), um projeto só   |
| Testes de banco | supabase/tests (harness.mjs em PGlite, rodar.mjs)          |
| Git             | github.com/horasaude/hora, chave SSH própria (~/.ssh/hora) |
| PWA             | vite.config.ts (VitePWA), escopo /app/, decisão 0003       |
| Meta tags       | index.html, imagem public/og-hora.png                      |
