# Mapa do projeto

Fonte única de "onde está cada coisa". Atualizado ao fim de cada tarefa (/fim).
Última atualização: Sprint 0, estrutura inicial.

## Rotas

| Rota    | Página     | Feature | Acesso  |
| ------- | ---------- | ------- | ------- |
| /entrar | LoginPage  | auth    | público |
| /       | InicioPage | inicio  | logada  |

## Features (src/features)

| Feature | O que faz                           | Exporta                             |
| ------- | ----------------------------------- | ----------------------------------- |
| auth    | login, sessão, rota protegida       | LoginPage, RotaProtegida, useSessao |
| inicio  | tela inicial da aluna (placeholder) | InicioPage                          |

## Regras de negócio (src/domain)

| Arquivo   | Regra                                                 |
| --------- | ----------------------------------------------------- |
| oferta.ts | oferta do ORA válida até 24/10/2026 23h59 de Brasília |

## Utilitários (src/lib)

| Arquivo        | Faz                             |
| -------------- | ------------------------------- |
| supabase.ts    | cliente Supabase tipado         |
| env.ts         | valida variáveis de ambiente    |
| datas.ts       | dia e datas no fuso de Brasília |
| moeda.ts       | centavos para reais             |
| queryClient.ts | configuração do TanStack Query  |

## Componentes compartilhados (src/components)

| Componente   | Onde          |
| ------------ | ------------- |
| Botao, Campo | components/ui |

## Banco (supabase)

| Objeto                    | Tipo                  | Migração                    |
| ------------------------- | --------------------- | --------------------------- |
| perfis                    | tabela (RLS)          | 20261006000000_criar_perfis |
| papel                     | enum (aluna, admin)   | 20261006000000_criar_perfis |
| eh_admin()                | função                | 20261006000000_criar_perfis |
| criar_perfil_novo_usuario | trigger em auth.users | 20261006000000_criar_perfis |

## Edge Functions

Nenhuma ainda.

## Infraestrutura

| Item   | Onde                     |
| ------ | ------------------------ |
| CI     | .github/workflows/ci.yml |
| Deploy | Vercel (vercel.json)     |
| PWA    | vite.config.ts (VitePWA) |
