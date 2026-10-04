# HORA

Plataforma da comunidade HORA. React + Vite + TypeScript + Supabase.

## Rodar localmente

Pré-requisitos: Node 20 ou mais e Supabase CLI (sem Docker; decisão 0002).

```bash
npm install
cp .env.example .env.local  # cole a chave pública do projeto (Supabase > Settings > API Keys)
supabase link --project-ref zijtjwhvnhfarmfscmnr
npm run db:test           # testes de banco em PGlite
npm run dev
```

## Comandos

| Comando         | Faz                                  |
| --------------- | ------------------------------------ |
| npm run check   | typecheck, lint e testes             |
| npm run build   | build de produção                    |
| npm run db:test | testes de RLS e funções do banco     |
| npm run db:push | aplica migrações no projeto Supabase |

## Onde está cada coisa

Veja docs/MAPA.md. Histórico em docs/HISTORICO.md. Fila de trabalho em docs/TAREFAS.md.
