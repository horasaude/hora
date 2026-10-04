# Tarefas

Marque [x] ao concluir (o comando /fim faz isso). A próxima tarefa é a primeira não marcada.

## Sprint 0: fundação (até 04/10, ajustado para 06 a 08/10)

- [x] Estrutura do projeto, lint, testes, CI, docs
- [ ] Criar repositório privado no GitHub e fazer o primeiro push
- [ ] Criar projetos Supabase hora-staging e hora-prod
- [ ] Conectar a Vercel ao repositório e configurar variáveis (Production = prod, Preview = staging)
- [ ] Rodar Supabase local, aplicar migração e passar no db:test
- [ ] Backup diário e keep-alive (GitHub Actions)

## Sprint 1: painel e área base (até 11/10)

- [ ] Tabelas temas, etapas, aulas, lives, avisos com RLS
- [ ] Painel admin: CRUD de temas, etapas e aulas
- [ ] Painel admin: lives e avisos
- [ ] Primeiro acesso com consentimento e apelido
- [ ] Início, trilha base e aula, com liberação por dia

## Sprint 2: pagamento e contrato (até 16/10)

- [ ] Planos, pedidos, pagamentos, eventos_webhook, contratos, aceites, assinaturas
- [ ] Edge Function criar-pedido (Pix, parcelado, recorrente)
- [ ] Edge Function mp-webhook idempotente e criação de acesso
- [ ] tem_acesso_ativo() e RLS de conteúdo
- [ ] E-mails (boas-vindas e contrato), reembolso, tela de obrigado

## Sprint 3: engajamento base (até 18/10)

- [ ] Check-in de hábitos com foto (compressão e storage privado)
- [ ] regras_pontos, lancamentos_pontos, conceder_pontos()
- [ ] Fórum na aula
- [ ] Medidas e consentimento
- [ ] PWA instalável e notificação

## Testes e go-live (19 a 23/10)

- [ ] Roteiro manual com as três, e2e dos fluxos de compra
- [ ] Restauração de backup testada
- [ ] Checklist de go-live

## Sprint 4: temas e gamificação (25 a 31/10)

- [ ] Escolha de tema e etapas com regra 80% + 30 dias
- [ ] Cardápios, desafios editáveis, ranking mensal e anual
- [ ] Indicação, fórum geral, gráfico de evolução

## Sprint 5: extras (novembro)

- [ ] Loja Active Life, botões de consulta e MFIT, relatórios
