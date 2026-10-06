# Tarefas

Marque [x] ao concluir (o comando /fim faz isso). A próxima tarefa é a primeira não marcada.

## Sprint 0: fundação (até 04/10, ajustado para 06 a 08/10)

- [x] Estrutura do projeto, lint, testes, CI, docs
- [x] Criar repositório privado no GitHub e fazer o primeiro push
- [x] Criar projeto Supabase (um só, decisão em ARQUITETURA)
- [x] Conectar a Vercel ao repositório e configurar variáveis
- [x] Testes de banco em PGlite (db:test) e migração aplicada com db push
- [ ] Configurar Site URL e Redirect URL do Auth no Supabase (hora-snowy.vercel.app)
- [ ] Tela de erro quando falta variável de ambiente (hoje fica em branco)
- [ ] Backup diário e keep-alive (GitHub Actions)

## Página de vendas (prioridade, antes da Sprint 1)

Venda inicial por links do Mercado Pago; o checkout integrado da Sprint 2 substitui os links sem refazer a página.

- [x] Rotas e página de vendas com textos provisórios ("/" pública, "/app" da aluna, preços por data, lazy loading, PWA, meta tags)
- [x] Cadastro de interessadas
- [x] Página de vendas refeita: popup de compra, links do Mercado Pago, /obrigada, termos e privacidade (sem aceite de contrato)
- [x] Checkout próprio (visual) em /checkout, popup leva até ele
- [ ] Ligar o pagamento no checkout: Payment Brick do Mercado Pago + criar-pedido (depende da conta da cliente)
- [ ] Conteúdo das clientes: fotos, frases, números de autoridade, depoimentos, prêmios, data de lançamento, revisão jurídica dos termos

## Sprint 1: painel e área base (até 11/10)

- [x] Tabelas temas, etapas, aulas, lives, avisos com RLS
- [x] Painel admin: CRUD de temas, etapas e aulas (na aula, escolha simples "Liberada na compra" = dia 1 ou "Depois de 7 dias" = dia 8, com opção de outro dia)
- [x] Painel admin: lives e avisos
- [x] Primeiro acesso com consentimento e apelido
- [x] Início, trilha base e aula, com liberação por dia
- [ ] Check-in de verdade (hoje o cartão do Início é só visual), sequência de dias e ranking com dados do banco
- [ ] Apelido único no ranking (hoje não há trava no banco)
- [x] Painel completo: menu de 11 módulos, cardápios, desafios e prêmios, alunas, configurações
- [ ] Ligar Pontos e indicações, Fórum, Financeiro e Loja quando as funções da aluna e o pagamento existirem
- [ ] Textos da página de vendas que citam "24/10" e "R$ 300" são fixos: ligar à configuração se a data ou o preço mudarem

## Sprint 2: pagamento e contrato (até 16/10)

- [ ] Planos, pedidos, pagamentos, eventos_webhook, contratos, aceites, assinaturas
- [ ] Edge Function criar-pedido (Pix, parcelado, recorrente)
- [ ] Edge Function mp-webhook idempotente e criação de acesso (pagamento aprovado grava perfis.acesso_inicio_em = momento da confirmação e acesso_fim_em pelo plano)
- [ ] tem_acesso_ativo() e RLS de conteúdo
- [ ] E-mails (boas-vindas e contrato), reembolso, tela de obrigado

## Sprint 3: engajamento base (até 18/10)

- [ ] Check-in de hábitos com foto (compressão e storage privado)
- [ ] Check-in de foto da refeição: +5 pontos, no máximo 1 por dia
- [x] regras_pontos, lancamentos_pontos, conceder_pontos() (painel de pontos e indicações pronto)
- [ ] Aplicar 20261007180000_pontos_indicacoes, publicar limpar-fotos e criar segredo do cron (CRON_SEGREDO e vault cron_segredo)
- [ ] Tela de check-in da aluna chamando fazer_checkin (foto no bucket checkins)
- [ ] Pedido do Mercado Pago registra indicação (indicacaoGuardada) e cancela no reembolso
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
- [ ] Níveis da aluna (por pontos acumulados)
- [ ] Lives gravadas: gravação disponível na área da aluna depois do ao vivo
- [ ] Indicação, fórum geral, gráfico de evolução

## Sprint 5: extras (novembro)

- [ ] Loja Active Life, botões de consulta e MFIT, relatórios

- [x] Plano alimentar no painel: cardápios, refeições, receitas, alimentos (TACO)
- [ ] Tela da aluna para cardápios e receitas publicados (banco já pronto)
