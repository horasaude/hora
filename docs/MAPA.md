# Mapa do projeto

Fonte única de "onde está cada coisa". Atualizado ao fim de cada tarefa (/fim).
Última atualização: página de vendas refeita (popup de compra, Mercado Pago, obrigada, termos e privacidade).

## Rotas

| Rota         | Página          | Feature | Acesso  | Carga                    |
| ------------ | --------------- | ------- | ------- | ------------------------ |
| /            | VendasPage      | vendas  | público | pacote inicial           |
| /obrigada    | ObrigadaPage    | vendas  | público | pacote inicial           |
| /termos      | TermosPage      | vendas  | público | pacote inicial           |
| /privacidade | PrivacidadePage | vendas  | público | pacote inicial           |
| /entrar      | LoginPage       | auth    | público | lazy (com ComProvedores) |
| /app         | InicioPage      | inicio  | logada  | lazy (AreaAluna + PWA)   |
| \*           | vai para /      |         |         |                          |

## Features (src/features)

| Feature | O que faz                                                         | Exporta                                               |
| ------- | ----------------------------------------------------------------- | ----------------------------------------------------- |
| auth    | login, sessão, rota protegida                                     | LoginPage, RotaProtegida, useSessao                   |
| inicio  | tela inicial da aluna (placeholder)                               | InicioPage                                            |
| vendas  | página de vendas, popup de compra, obrigada, termos e privacidade | VendasPage, ObrigadaPage, TermosPage, PrivacidadePage |

## Regras de negócio (src/domain)

| Arquivo   | Regra                                                                                   |
| --------- | --------------------------------------------------------------------------------------- |
| oferta.ts | oferta do ORA válida até 24/10/2026 23h59 de Brasília                                   |
| precos.ts | preços vigentes (oferta ou cheio), âncora riscada, desconto da oferta, contagem, PLANOS |

## Utilitários (src/lib)

| Arquivo        | Faz                                        |
| -------------- | ------------------------------------------ |
| supabase.ts    | cliente Supabase tipado                    |
| pwa.ts         | registra o service worker (/app/)          |
| pwaAntigo.ts   | remove o service worker antigo de escopo / |
| env.ts         | valida variáveis de ambiente               |
| datas.ts       | dia e datas no fuso de Brasília            |
| moeda.ts       | centavos para reais                        |
| telefone.ts    | máscara de telefone e só dígitos           |
| utm.ts         | lê UTMs da URL e guarda na sessão          |
| whatsapp.ts    | link wa.me a partir do número com DDD      |
| navegacao.ts   | sai do site (link de pagamento)            |
| queryClient.ts | configuração do TanStack Query             |

## Componentes compartilhados (src/components)

| Componente   | Onde          |
| ------------ | ------------- |
| Botao, Campo | components/ui |

## Banco (supabase)

| Objeto                    | Tipo                                            | Migração                                                                    |
| ------------------------- | ----------------------------------------------- | --------------------------------------------------------------------------- |
| perfis                    | tabela (RLS)                                    | 20261004000000_criar_perfis                                                 |
| papel                     | enum (aluna, admin)                             | 20261004000000_criar_perfis                                                 |
| eh_admin()                | função                                          | 20261004000000_criar_perfis                                                 |
| criar_perfil_novo_usuario | trigger em auth.users                           | 20261004000000_criar_perfis                                                 |
| interessadas              | tabela (RLS, admin lê), sem colunas de contrato | 20261004120000_criar_interessadas, 20261005090000_interessadas_sem_contrato |

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
