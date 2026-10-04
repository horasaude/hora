# HORA

Plataforma da comunidade HORA. React + Vite + TypeScript + Supabase.

## Rodar localmente

Pré-requisitos: Node 20 ou mais, Docker (para o Supabase local) e Supabase CLI.

```bash
npm install
npm run db:start          # sobe o Supabase local e mostra a URL e a anon key
cp .env.example .env.local  # cole a URL e a anon key
npm run db:reset          # aplica migrações e seed
npm run gen:types         # gera os tipos do banco
npm run dev
```

## Comandos

| Comando         | Faz                              |
| --------------- | -------------------------------- |
| npm run check   | typecheck, lint e testes         |
| npm run build   | build de produção                |
| npm run db:test | testes de RLS e funções do banco |

## Onde está cada coisa

Veja docs/MAPA.md. Histórico em docs/HISTORICO.md. Fila de trabalho em docs/TAREFAS.md.
