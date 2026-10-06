# Mapa do projeto

Fonte única de "onde está cada coisa". Atualizado ao fim de cada tarefa (/fim).
Última atualização: pontos e indicações em src/features/admin/pontos (regras, histórico, fotos de treino, indicações) e participantes do desafio.

## Rotas

| Rota                        | Página                                                  | Feature                       | Acesso      | Carga                    |
| --------------------------- | ------------------------------------------------------- | ----------------------------- | ----------- | ------------------------ |
| /                           | VendasPage                                              | vendas                        | público     | pacote inicial           |
| /obrigada                   | ObrigadaPage                                            | vendas                        | público     | pacote inicial           |
| /termos                     | TermosPage                                              | vendas                        | público     | pacote inicial           |
| /privacidade                | PrivacidadePage                                         | vendas                        | público     | pacote inicial           |
| /checkout                   | CheckoutPage                                            | checkout                      | público     | lazy                     |
| /entrar                     | LoginPage                                               | auth                          | público     | lazy (com ComProvedores) |
| /app                        | InicioPage (dentro do LayoutAluna, com primeiro acesso) | inicio                        | logada      | lazy (AreaAluna + PWA)   |
| /app/trilha                 | TrilhaPage                                              | trilha                        | logada      | lazy                     |
| /app/aula/:id               | AulaPage                                                | trilha                        | logada      | lazy                     |
| /app/desafios, /app/ranking | EmBrevePage (src/app)                                   |                               | logada      | lazy                     |
| /app/perfil                 | PerfilPage                                              | perfil                        | logada      | lazy                     |
| /app/admin/...              | painel (conteúdo, lives, avisos)                        | admin                         | papel admin | lazy (admin, 25 KB)      |
| checkout                    | checkout próprio (resumo, dados, pagamento, lateral)    | CheckoutPage, salvarInscricao |
| \*                          | vai para /                                              |                               |             |                          |

## Features (src/features)

| Feature | O que faz                                                                                                                                 | Exporta                                                                       |
| ------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| admin   | painel das profissionais: temas, etapas, aulas, lives, avisos; plano alimentar em admin/plano e pontos em admin/pontos (READMEs próprios) | PainelLayout, ConteudoPage, LivesPage, AvisosPage                             |
| auth    | login, sessão, rota protegida, perfil logado                                                                                              | LoginPage, RotaProtegida, useSessao, usePapel, useNome, useMeuPerfil, useSair |
| inicio  | tela inicial da aluna (placeholder)                                                                                                       | InicioPage                                                                    |
| vendas  | página de vendas, popup de compra, obrigada, termos e privacidade                                                                         | VendasPage, ObrigadaPage, TermosPage, PrivacidadePage                         |

## Referências visuais (docs/referencias)

Padrão visual oficial a partir de 2026-10-06: estilo-aluna (área da aluna) e estilo-painel (painel das profissionais). Os .html têm os valores exatos de tamanho, cor e brilho; os .png mostram o resultado. Eles substituem estilo-brilho e as cores das referências antigas. O layout das telas continua seguindo painel-apresentado.png e app-aluna.png.

| Arquivo                               | Vale para                                                      | Onde está no código                                              |
| ------------------------------------- | -------------------------------------------------------------- | ---------------------------------------------------------------- |
| estilo-aluna.png, estilo-aluna.html   | área da aluna: fundo e menu brancos, item ativo em vidro verde | LayoutAluna, NavegacaoAluna, inicio, trilha, primeiro-acesso     |
| estilo-painel.png, estilo-painel.html | painel: menu verde escuro, resumo em tons suaves, tabela       | admin (PainelLayout, MenuLateral, Quadro, Tabela, CartaoDetalhe) |
| painel-apresentado.png, app-aluna.png | layout das telas (organização, não cores)                      | admin e área da aluna                                            |
| estilo-brilho.png, estilo-brilho.html | substituída pelas duas acima (fica só como histórico)          | -                                                                |

Componentes do estilo (toda tela nova usa estes): BotaoBrilho, LinkBrilho, EtiquetaBrilho (11 px), BarraProgresso (dourada, 8 px, com o que falta embaixo), Cartao, classeBrilho(tom, tamanho, pilula) em src/components/ui; classes .brilho e .brilho-* em src/styles/index.css. Botões em pílula com 13 px, brilho suave só em cima. Tons: verde (concluído, publicado, item ativo), dourado (criar algo novo, rascunho, lives, sequência, prêmios, progresso), coral (treino, tirar do ar, encerrar, alerta), escuro (editar, salvar, play), cinza (cancelar, ainda não feito).

## Regras de negócio (src/domain)

| Arquivo     | Regra                                                                                   |
| ----------- | --------------------------------------------------------------------------------------- |
| cpf.ts      | CPF válido pelos dígitos verificadores                                                  |
| trilha.ts   | aula de hoje, tema e etapa atuais, progresso, semana do acesso, quando cada aula abre   |
| saudacao.ts | Bom dia, Boa tarde ou Boa noite pela hora de Brasília                                   |
| oferta.ts   | oferta do ORA válida até 24/10/2026 23h59 de Brasília                                   |
| precos.ts   | preços vigentes (oferta ou cheio), âncora riscada, desconto da oferta, contagem, PLANOS |

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

| Objeto                                                                                                        | Tipo                                                                                                                           | Migração                                                                    |
| ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------- |
| perfis                                                                                                        | tabela (RLS)                                                                                                                   | 20261004000000_criar_perfis                                                 |
| papel                                                                                                         | enum (aluna, admin)                                                                                                            | 20261004000000_criar_perfis                                                 |
| eh_admin()                                                                                                    | função                                                                                                                         | 20261004000000_criar_perfis                                                 |
| criar_perfil_novo_usuario                                                                                     | trigger em auth.users                                                                                                          | 20261004000000_criar_perfis                                                 |
| interessadas                                                                                                  | tabela (RLS, admin lê), sem colunas de contrato                                                                                | 20261004120000_criar_interessadas, 20261005090000_interessadas_sem_contrato |
| perfis.acesso_inicio_em/fim_em                                                                                | colunas (início na confirmação do pagamento, com hora; só service role ou admin pelo banco)                                    | 20261006120000_conteudo, 20261006150000_acesso_por_hora                     |
| hoje_brasilia()                                                                                               | função (data de hoje em Brasília)                                                                                              | 20261006120000_conteudo                                                     |
| tem_acesso_ativo()                                                                                            | função (acesso dentro do período)                                                                                              | 20261006120000_conteudo                                                     |
| dia_de_acesso()                                                                                               | função (dia 1 = confirmação; muda a cada 24 h exatas)                                                                          | 20261006150000_acesso_por_hora                                              |
| mover_tema/etapa/aula()                                                                                       | funções (reordenar; só admin; etapas com ordem única adiável)                                                                  | 20261006180000_ordem_conteudo                                               |
| temas, etapas                                                                                                 | tabelas (RLS: admin escreve; aluna com acesso lê publicados)                                                                   | 20261006120000_conteudo                                                     |
| aulas                                                                                                         | tabela (RLS: aluna lê publicadas com dia_liberacao <= dia_de_acesso); duracao_minutos, profissional                            | 20261006120000_conteudo, 20261007090000_trilha_aluna                        |
| aulas_concluidas                                                                                              | tabela (RLS: aluna marca e desmarca só aula liberada, só as suas)                                                              | 20261007090000_trilha_aluna                                                 |
| cardapios                                                                                                     | tabela (RLS: admin escreve; aluna com acesso lê publicados)                                                                    | 20261007120000_painel_completo                                              |
| regras_pontos, lancamentos_pontos, checkins, denuncias_checkin, indicacoes                                    | tabelas (regras: admin edita pontos, limite e ligado; histórico imutável, correção é novo lançamento; aluna lê só o seu)       | 20261007180000_pontos_indicacoes                                            |
| conceder_pontos(), estornar_lancamento(), fazer_checkin(), invalidar_checkin(), lancar_ajuste()               | funções de pontos (limite por dia no fuso de Brasília, uma vez por referência, sem dobra)                                      | 20261007180000_pontos_indicacoes                                            |
| registrar_indicacao(), cancelar_indicacao(), confirmar_indicacoes(), painel_pontos(), participantes_desafio() | indicação (sem autoindicação por e-mail ou CPF, 150 pontos depois dos 7 dias de garantia, só service_role) e resumos do painel | 20261007180000_pontos_indicacoes                                            |
| bucket checkins, perfis.codigo_indicacao, perfis.cpf, desafios.premio_surpresa                                | fotos privadas na pasta da aluna (apagadas aos 90 dias, pontos ficam); cron 03:15 confirma indicações, 03:30 limpa fotos       | 20261007180000_pontos_indicacoes                                            |
| desafios, desafio_participantes, desafio_checkins                                                             | tabelas (aluna entra e marca só o dia de hoje, no período; admin encerra)                                                      | 20261007120000_painel_completo                                              |
| configuracoes                                                                                                 | linha única: preços, janela da oferta, termos, privacidade (todos leem; admin edita)                                           | 20261007120000_painel_completo                                              |
| painel_alunas(), painel_desafios(), vencedoras_desafio(), alunas_em_desafios_ativos()                         | funções só admin                                                                                                               | 20261007120000_painel_completo                                              |
| registrar_acesso(), perfis.ultimo_acesso_em                                                                   | último acesso da aluna (grava a cada 5 min no máximo)                                                                          | 20261007120000_painel_completo                                              |
| minha_trilha()                                                                                                | função (trilha da aluna com aulas fechadas, sem link de vídeo; só com acesso ativo)                                            | 20261007090000_trilha_aluna                                                 |
| lives, avisos                                                                                                 | tabelas (RLS: aluna lê publicadas; aviso só depois de publicar_em)                                                             | 20261006120000_conteudo                                                     |

## Edge Functions

| Função                | Faz                                                                                | JWT       |
| --------------------- | ---------------------------------------------------------------------------------- | --------- |
| cadastrar-interessada | valida e grava interessada (honeypot, origem permitida)                            | desligado |
| limpar-fotos          | apaga fotos de check-in com mais de 90 dias (chamada pelo cron com x-cron-segredo) | desligado |
| \_shared/cors.ts      | CORS pela lista ORIGENS_PERMITIDAS                                                 |           |

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
