# supabase

| Pasta       | Conteúdo                                                                     |
| ----------- | ---------------------------------------------------------------------------- |
| migrations/ | Uma migração por assunto, em ordem. Nunca edite uma já aplicada: crie outra. |
| tests/      | Testes de RLS e funções em PGlite, sem Docker (npm run db:test)              |
| functions/  | Edge Functions (uma pasta por função; comum em _shared)                      |
| seed.sql    | Dados de desenvolvimento                                                     |

Tabelas atuais: perfis. Funções: eh_admin(), criar_perfil_novo_usuario() (trigger).
