# Tarefas

Marque [x] ao concluir (o comando /fim faz isso). A próxima tarefa é a primeira não marcada.

## Sprint 0: fundação (até 04/10, ajustado para 06 a 08/10)

- [x] Estrutura do projeto, lint, testes, CI, docs
- [x] Criar repositório privado no GitHub e fazer o primeiro push
- [x] Criar projeto Supabase (um só, decisão em ARQUITETURA)
- [x] Conectar a Vercel ao repositório e configurar variáveis
- [x] Testes de banco em PGlite (db:test) e migração aplicada com db push
- [x] Configurar Site URL e Redirect URL do Auth no Supabase (hora-snowy.vercel.app; link vale 24 h)
- [x] Tela de erro quando falta variável de ambiente (hoje fica em branco)
- [x] Backup diário com teste de restauração (GitHub Actions; falta pôr SUPABASE_DB_URL e BACKUP_SENHA nos secrets)

## Página de vendas (prioridade, antes da Sprint 1)

Venda inicial por links do Mercado Pago; o checkout integrado da Sprint 2 substitui os links sem refazer a página.

- [x] Rotas e página de vendas com textos provisórios ("/" pública, "/app" da aluna, preços por data, lazy loading, PWA, meta tags)
- [x] Cadastro de interessadas
- [x] Página de vendas refeita: popup de compra, links do Mercado Pago, /obrigada, termos e privacidade (sem aceite de contrato)
- [x] Checkout próprio (visual) em /checkout, popup leva até ele
- [x] Ligar o pagamento no checkout: Payment Brick do Mercado Pago + criar-pedido (em modo de teste; trocar as chaves quando chegar a conta das clientes)
- [ ] Conteúdo das clientes: fotos, frases, números de autoridade, depoimentos, prêmios, data de lançamento, revisão jurídica dos termos

## Sprint 1: painel e área base (até 11/10)

- [x] Tabelas temas, etapas, aulas, lives, avisos com RLS
- [x] Painel admin: CRUD de temas, etapas e aulas (na aula, escolha simples "Liberada na compra" = dia 1 ou "Depois de 7 dias" = dia 8, com opção de outro dia)
- [x] Painel admin: lives e avisos
- [x] Primeiro acesso com consentimento e apelido
- [x] Início, trilha base e aula, com liberação por dia
- [x] Check-in de verdade, sequência de dias e ranking com dados do banco
- [x] Desafios da aluna (lista, desafio aberto, encerrados) e Perfil completo (evolução, indicação, configurações, histórico)
- [x] Parte 2 da aluna: trilha por tema e etapas (dia de calendário, Comece por aqui, escolha no dia 8, 80% e 30 dias), cardápios, receitas, lista de compras e lives
- [x] Lembrete da live por push 1 hora antes (e-mail fica para quando o Resend estiver ligado)
- [x] Sala do Meet restrita (membros: equipe, convidadas e a aluna ao entrar pelo ORA), várias profissionais, convidadas e convite .ics na agenda
- [ ] Assinar o Google Workspace Business Standard em domínio próprio e reconectar a conta em Lives
- [ ] Cardápio de vários dias no painel e abas por dia na aluna
- [x] Apelido único no ranking (índice no banco, sem diferença de maiúscula)
- [x] Painel completo: menu de 11 módulos, cardápios, desafios e prêmios, alunas, configurações
- [x] Loja (painel e aluna)
- [ ] Completar a Active Life no painel (logo, cupom, WhatsApp ou site) e cadastrar os produtos
- [ ] Ligar Financeiro quando as funções da aluna e o pagamento existirem
- [ ] Textos da página de vendas que citam "24/10" e "R$ 300" são fixos: ligar à configuração se a data ou o preço mudarem

## Sprint 2: pagamento e contrato (até 16/10)

- [x] Pedidos, eventos_pagamento e assinaturas (contratos e aceites seguem pendentes)
- [x] Edge Function criar-pedido (Pix, parcelado, recorrente)
- [x] Edge Function pagamento-webhook idempotente e criação de acesso (pagamento aprovado grava perfis.acesso_inicio_em = momento da confirmação e acesso_fim_em pelo plano)
- [x] tem_acesso_ativo() e RLS de conteúdo (com suspensão por inadimplência)
- [x] E-mails de boas-vindas, lembrete do Pix e cobrança recusada; reembolso; /obrigada com status real
- [x] Mercado Pago da cliente ligado em modo teste (webhook, chaves TEST-); Pix e parcelado testados ponta a ponta
- [x] Pagamento trocado para o Asaas (decisão 0005); Mercado Pago abandonado
- [x] Cartão digitado no próprio checkout, parcelado de 1x a 12x
- [x] Asaas sandbox: Pix, parcelado 12x, mensal (1ª cobrança) e estorno testados ponta a ponta (2026-10-19)
- [x] Asaas confirmou que a conta de produção aceita cobrança e assinatura com cartão pela API
- [x] Cancelamento pela plataforma: até 7 dias estorno automático; depois só não renova; lista no painel (decisão 0006)
- [ ] Convite de renovação por e-mail ao fim dos 12 meses (Pix, parcelado e mensal; sem cobrança automática; pula quem pediu para não renovar). Primeiro vencimento em 10/2027
- [ ] Asaas: conta de produção da cliente, chave pelo ligar-asaas.sh e uma compra real de valor baixo com estorno
- [ ] SMTP do Resend no Auth do Supabase e modelo supabase/templates/nova-senha.html (sem isso, Esqueci minha senha só entrega para a equipe)
- [ ] Pixel da Meta (Purchase só com aprovado) quando o pixel existir

## Sprint 3: engajamento base (até 18/10)

- [x] Check-in de hábitos com foto (compressão e storage privado)
- [x] Check-in de foto da refeição: +5 pontos, no máximo 1 por dia
- [x] regras_pontos, lancamentos_pontos, conceder_pontos() (painel de pontos e indicações pronto)
- [x] Aplicar 20261007180000_pontos_indicacoes, publicar limpar-fotos e criar segredo do cron (CRON_SEGREDO e vault cron_segredo)
- [x] Tela de check-in da aluna chamando fazer_checkin (foto no bucket checkins)
- [x] Pedido do Mercado Pago registra indicação (indicacaoGuardada) e cancela no reembolso
- [x] Fórum na aula e fórum geral, com fila e denúncias no painel
- [x] Tela Equipe para convidar profissionais
- [x] Convidar Ana, Clara e Laís pela tela Equipe; cada uma coloca a foto em Meu perfil no Fórum
- [x] Medidas e consentimento
- [x] PWA instalável e notificação (água e live)

## Testes e go-live (19 a 23/10)

- [ ] Roteiro manual com as três, e2e dos fluxos de compra
- [ ] Restauração de backup testada
- [ ] Checklist de go-live

## Sprint 4: temas e gamificação (25 a 31/10)

- [x] Escolha de tema e etapas com regra 80% + 30 dias
- [x] Cardápios, desafios editáveis, ranking mensal e anual
- [ ] Níveis da aluna (por pontos acumulados)
- [x] Lives gravadas: gravação disponível na área da aluna depois do ao vivo
- [x] Indicação, fórum geral, gráfico de evolução

## Sprint 5: extras (novembro)

- [ ] Loja Active Life, botões de consulta e MFIT, relatórios

- [x] Plano alimentar no painel: cardápios, refeições, receitas, alimentos (TACO)
- [x] Tela da aluna para cardápios e receitas publicados (banco já pronto)

## Treinos

- [x] Módulo de Treinos no painel e na aluna (2026-10-15)
- [ ] Laís completar vídeos, fotos e instruções dos 30 exercícios e montar os treinos e modelos reais

## Saúde (Dra. Clara), logo depois do lançamento de 24/10

- [ ] Menu "Saúde" no painel: anamnese com área (saúde, treino, nutrição), materiais da médica ligados ao tema e respostas no cartão da aluna
- [ ] Parte "Saúde" dentro do tema (painel) e aba "Saúde" no tema da aluna, com as orientações da Dra. Clara
- [ ] Antes de fazer: confirmar quem vê as respostas da anamnese de saúde (só a Dra. Clara ou as três sócias; dado sensível pela LGPD)
