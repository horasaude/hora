# Backup do banco

O GitHub Actions (`.github/workflows/backup.yml`) roda todo dia às 3h de Brasília e também pelo botão "Run workflow" em Actions > Backup diário.

1. Copia o banco de produção (esquemas public, auth e storage) com `pg_dump`.
2. Restaura a cópia num Postgres limpo e confere a contagem de perfis, pedidos e lançamentos de pontos. Se não bater, o workflow falha e o GitHub avisa por e-mail.
3. Criptografa com AES-256 (senha no secret `BACKUP_SENHA`) e guarda como artefato por 30 dias.

Os arquivos de fotos e materiais (Storage) não entram: ficam no Supabase. O que entra é o banco, incluindo a lista de arquivos.

## Configurar (uma vez)

No GitHub do repositório: Settings > Secrets and variables > Actions > New repository secret.

- `SUPABASE_DB_URL`: no Supabase, Project Settings > Database > Connection string > Session pooler (troque `[YOUR-PASSWORD]` pela senha do banco).
- `BACKUP_SENHA`: uma senha longa só para os backups. Guarde num gerenciador de senhas; sem ela o backup não abre.

## Restaurar

1. Em Actions > Backup diário, abra o dia desejado e baixe o artefato `backup-AAAA-MM-DD`.
2. Descriptografar: `gpg --decrypt ora-AAAA-MM-DD.dump.gpg > ora.dump` (pede a `BACKUP_SENHA`).
3. Restaurar num projeto Supabase novo: `pg_restore --no-owner --no-privileges -d "URL_DO_PROJETO_NOVO" ora.dump`.
4. Conferir perfis, pedidos e pontos, e só então apontar o site para o projeto novo (VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY na Vercel).
