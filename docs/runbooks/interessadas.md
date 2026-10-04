# Publicar o cadastro de interessadas

Rodar nesta ordem, na pasta do projeto. O push na main vai por último: se a página publicar antes da função existir, o formulário dá erro.

1. Conferir o projeto ligado (tem que ser zijtjwhvnhfarmfscmnr):
   `cat supabase/.temp/project-ref`
2. Ver o que vai subir e aplicar a migração:
   `supabase db push --dry-run` e depois `npm run db:push`
3. Liberar a origem da página:
   `supabase secrets set ORIGENS_PERMITIDAS=https://hora-snowy.vercel.app`
   (com domínio próprio, separar por vírgula: `https://hora-snowy.vercel.app,https://dominio.com.br`)
4. Publicar a função (sem Docker):
   `supabase functions deploy cadastrar-interessada --no-verify-jwt --use-api`
5. Atualizar os tipos: `npm run gen:types`
6. `git push`

Conferir: abrir hora-snowy.vercel.app, cadastrar um teste e ver a linha em Table Editor > interessadas. Apagar a linha de teste ali mesmo.

## Página nova sem contrato (2026-10-05)

Ordem: `supabase functions deploy cadastrar-interessada --no-verify-jwt --use-api`, depois `npm run db:push` (remove as colunas de contrato), `npm run gen:types` e `git push`. Entre a função e a migração há alguns segundos em que um cadastro falharia; a página nova redireciona para o pagamento mesmo assim.
