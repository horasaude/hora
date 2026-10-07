# Histórico

Entradas mais novas no topo. Cada entrada: data, branch, o que foi feito, arquivos principais, pendências.

## 2026-10-07 · main · Ajustes da área da aluna (logo ORA, live, gravações, cardápios, aula)

- Logo do ORA em todo o sistema (LogoHora aponta para logo-ora.svg e logo-ora-clara.svg), impressão do cardápio e ícones do app (icone.svg, icone-192, icone-512, apple-touch-icon).
- Início: um aviso de live só (card dourado da live de hoje ou faixa ocre #F6EBD3 da próxima, que leva para Lives); saiu a fileira de atalhos do celular.
- Gravações: capa cadastrada no painel (lives.capa_url, migração 20261011120000_capa_da_live) ou foto da profissional em círculo sobre areia com play verde ORA.
- Cardápios: abas internas sublinhadas Meu cardápio e Receitas. Aula concluída sem Desfazer. "Tenho uma dúvida" em terracota e Registrar medidas em verde escuro (dourado só para lives, progresso e prêmios). Barra da etapa: "Faltam X aulas e Y dias para abrir ..." (metaDaEtapa em src/domain/trilha.ts); na última etapa, só a porcentagem.

## 2026-10-06 · main · Navegação em 5 abas, Para Sempre, cardápio de Preparação e demonstração

- Navegação da aluna em 5 abas iguais no celular e no computador (Início, Trilhas, Desafios, Comunidade, Perfil), definidas em src/app/navegacao.ts; no computador a aba ativa abre as suas telas recuadas com bolinha; dentro de cada aba, pílulas no topo (verde ORA ativa, areia com borda fina). Rotas antigas mantidas. Ponto dourado pulsando em Comunidade e em Lives quando há live hoje. Perfil dividido em Minha evolução (/app/perfil) e Minha conta (/app/perfil/conta).
- Terceira etapa agora se chama "Para Sempre" (identificador interno continua manutencao).
- Cardápio de Preparação: opção no painel; pela RLS (objetivo_da_aluna), sem tema a aluna vê só Preparação e, com tema, só o do tema; vazio "Seu cardápio aparece aqui em breve". Migração 20261011090000_preparacao_para_sempre, testes de banco atualizados.
- Demonstração local em scripts/demo (seed, banco em memória com as migrações e a API mínima, prints): npm run demo e npm run demo:prints. Prints em docs/prints/parte2.

## 2026-10-06 · main · Parte 2 da aluna: trilha por tema, cardápios e lives

- Dia da aluna agora é de calendário (Brasília, vira à meia-noite): src/domain/dia.ts e public.dia_atual_de, com testes de virada, dia 1, 7, 8 e 31. Regra trocada no CLAUDE.md (antes eram 24 h exatas).
- Banco (20261010090000_trilha_cardapios_lives; suítes de trilha e de cardápios e lives novas, antigas ajustadas): Preparação e os 5 temas semeados com Arrancada, Constância e Manutenção; etapas_iniciadas; aula_liberada na RLS (aula fechada nunca devolve vídeo); trilha_aluna abre a próxima etapa com 80% e 30 dias; escolher_tema só a partir do dia 8; Comece por aqui; lives com profissional, duração, presença e entrar_live (pontos uma vez, janela no banco); receitas com tempo, refeições e temas; favoritas; lista de compras marcada por aluna.
- Trilha: Dia X de 365, barra dourada e tag do tema; Comece por aqui com vídeo e 5 passos; preparação com cadeado; escolha do tema no dia 8 (modal e seletor); abas das etapas com metas em barras e aviso de conquista; aula com vídeo grande, Concluir aula, Próxima aula, navegação lateral, material e "Tenho uma dúvida"; Perfil > Meu tema.
- Cardápios: lista do tema, refeições por horário com substituições, totais e Registrar refeição; lista de compras de 3, 7 ou 14 dias com marcar, WhatsApp e Imprimir; receitas com filtros, preparo numerado, nutrição por porção e favoritar.
- Lives: próxima live com borda dourada, contagem, .ics, Me lembrar (só no app), Entrar na live na janela; gravações com player; card da live do dia no Início. Painel: Comece por aqui editável, frase do tema, dia de liberação por preparação ou etapa, profissional e duração da live, tempo, refeições e temas da receita. Esqueleto de carregamento nas telas da aluna.
- Pendente: push e e-mail do lembrete da live (ver README de lives); cardápio de vários dias (abas por dia); conteúdo real das aulas, cardápios e lives no painel.

## 2026-10-06 · main · Engajamento da aluna (check-in, desafios, ranking, perfil)

- Banco (20261009090000_engajamento, 51 checagens novas no PGlite; pontos ajustado à nova assinatura): fazer_checkin com tipo e duração do treino, foto obrigatória em treino e refeição, repetido devolve 0; ranking_pontos (mês e ano), meus_desafios, entrar_desafio, checkin_desafio (devolve os pontos), ranking_desafio; tabela medidas e espaço privado evolucao; perfis.avatar_path.
- Início: resumo (pontos no mês, dias seguidos, posição), check-in real dos 5 hábitos com "+5" que sobe e some, foto do treino (câmera no celular, tipo e duração) e da refeição, bolinhas dos 7 dias, ranking real e cartão do desafio ativo com check-in.
- Desafios: abas Do mês e Encerrados, desafio aberto com regras, barra, calendário, check-in por tipo e ranking pelo apelido. Ranking: Mês e Ano, círculos ouro, prata e coral, linha dela em verde fixa no rodapé quando sai da tela, cartão do topo com quanto falta para subir.
- Perfil: topo com dia e semana, resumo, Minha evolução (medidas, gráfico e lista), Indicar uma amiga (copiar, WhatsApp, lista com situação), configurações (apelido e foto, aparecer no ranking, senha, sair) e histórico de pontos paginado. Tela "em breve" removida.
- Arquivos: src/features/checkin, desafios, ranking, perfil; src/domain/engajamento.ts; src/lib/fotos.ts; components/ui (Abas, Estados, Formulario, RodapeSalvar, PontosGanhos).
- Pendente: aplicar a migração no banco (db push) e publicar; tipos escritos à mão até rodar gen:types depois do db push.

## 2026-10-06 · main · Loja completa (painel e aluna)

- Banco (20261008120000_loja, 33 checagens no PGlite): parceiros, produtos e cliques; aluna com acesso vê só produto publicado de parceiro ativo; clique só pela função (1 por minuto por produto); Active Life já cadastrada; fotos e logos no espaço privado loja.
- Painel: resumo (publicados, parceiros ativos, cliques no mês, mais clicado), abas Produtos e Parceiros, cadastro em janela grande com foto comprimida antes de subir, desconto em % ou preço final, cupom do produto, link, Destaque e Publicado; produto aberto mostra os cliques das últimas 8 semanas.
- Aluna: Loja no menu do computador (no celular pelo Início), faixa do parceiro com a frase dos descontos, filtro por categoria em vidro, grade de 3 ou 2 colunas com preço riscado, preço com desconto e etiqueta dourada, produto aberto com Copiar cupom e Comprar com desconto.

## 2026-10-06 · main · Equipe: convidar profissionais

- Configurações > Equipe: lista com e-mail, especialidade, situação (Ativa ou Convite pendente) e último acesso; Convidar profissional, Editar, Gerar link de acesso e Tirar acesso.
- Edge Function convidar-profissional cria a conta com a chave de serviço e devolve um link de uso único para enviar por WhatsApp ou e-mail; a página /definir-senha recebe o link, a profissional cria a senha e entra no painel.
- Migração 20261008090000_equipe (25 checagens no PGlite); validação da função com testes.

## 2026-10-06 · main · Fórum completo (aluna e painel)

- Banco (20261007220000_forum, 52 checagens no PGlite): dúvidas, respostas, curtidas e denúncias; cada dúvida numa aula ou no geral, com categoria e prazo de 72 h; aluna aparece só pelo apelido; tudo pelas funções forum_*. Enviar dúvida dá 5 pontos (até 2 por dia) e útil dá 10, pelo motor de pontos; ocultar estorna.
- Aluna: Dúvidas desta aula embaixo do vídeo (resposta das profissionais em destaque com foto, nome, título e Resposta útil), Enviar dúvida com categoria e aviso das 72 h, fórum geral com busca, categoria e Minhas dúvidas, responder, curtir, denunciar, regras na primeira entrada e aviso no Início quando a dúvida é respondida. Fórum no menu do computador; no celular entra pelo Início e pela aula (a barra segue com 5 ícones).
- Painel: resumo (abertas, perto de vencer, vencidas, respondidas na semana), fila pelo prazo com etiqueta verde, dourada ou coral, filtros de categoria, aula, situação e Para mim, dúvida aberta na tela com Responder, Marcar como útil e Ocultar com motivo, aba Denúncias com Manter e Ocultar, e Meu perfil (nome, especialidade, título e foto).

## 2026-10-06 · main · Ações próprias em Pontos e indicações

- Botão Nova ação na aba Regras: nome, pontos e limite (por dia, uma vez por aluna ou sem limite). No menu da ação, Dar pontos abre a lista de alunas para marcar quem cumpriu; o banco respeita o limite e devolve quantas receberam.
- Migração 20261007200000_acoes_proprias (10 checagens novas no PGlite). Histórico e filtro mostram o nome das ações próprias.
- Corrigido: ligar e desligar regra mandava colunas que o banco não deixa mudar e falhava; agora vão só pontos, limite, ligada e nome.

## 2026-10-06 · main · Pontos e indicações, ajustes em Desafios

- Banco (20261007180000_pontos_indicacoes, 47 checagens no PGlite): regras_pontos com as 10 regras iniciais, lancamentos_pontos imutável (estorno e ajuste são lançamentos novos), checkins com foto em bucket privado, denúncias, indicações com 7 dias de garantia e sem autoindicação por e-mail ou CPF. Pontos de aula concluída e de desafio por gatilho. Cron confirma indicações (03:15) e a Edge Function limpar-fotos apaga fotos com mais de 90 dias (03:30), sem tirar pontos.
- Painel: página Pontos e indicações com cartões e abas Regras, Histórico (filtros e Lançar ajuste), Fotos de treino (foto grande, Invalidar foto estorna) e Indicações. Link de indicação no detalhe da aluna; a página de vendas guarda o código.
- Desafios: pontos por check-in e bônus no mesmo histórico, prêmio caixa surpresa, participantes com barra dourada no desafio aberto.
- Publicado em 06/10: migração aplicada, limpar-fotos no ar (recusa sem senha, respondeu 200 pela rotina), segredo do cron na função e no vault. Pendente: ligar indicação ao pedido do Mercado Pago; telas de check-in da aluna.

## 2026-10-06 · main · Plano alimentar (modelo Dietbox)

- Menu: grupo "Plano alimentar" que abre e fecha, com Cardápios, Refeições, Receitas e Alimentos (src/features/admin/plano, README próprio).
- Alimentos: TACO 4ª edição importada da planilha oficial do NEPA/Unicamp (597 alimentos, só leitura; NA, Tr e * viram vazio), alimentos próprios com medidas caseiras, busca sem acento palavra por palavra, paginação.
- Receitas em página inteira (foto em bucket privado, editor com negrito e listas, HTML limpo por src/lib/html.ts, porções, tags, cálculo por porção). Refeições modelo com "ou" e Salvar e continuar. Cardápios em página inteira com blocos, substituições, resumo de nutrientes (rosca P coral, C dourado, G sálvia), texto livre, lista de compras da semana editável, visualizar como aluna, PDF pela impressão, publicar.
- Migração 20261007150000_plano_alimentar (36 checagens no PGlite). Cálculo em src/domain/nutricao.ts e listaCompras.ts com testes.

## 2026-10-06 · main · Painel com janela de criar e editar

- Janela (src/components/ui/Janela.tsx): 760 px centralizada, fundo escurecido, título, X, conteúdo que rola, Cancelar e Salvar fixos no rodapé; fecha com Esc e clique fora; tela inteira no celular. Testada.
- Criar e editar tema, etapa, aula, cardápio, live, desafio, aviso e configurações abrem a janela, com campos em duas colunas (objetivo e título lado a lado, refeições em duas colunas, preços cheio e oferta lado a lado). O cartão da direita virou só detalhes (cardápio mostra as refeições e a lista de compras; aviso mostra o texto; configurações mostram os valores).
- Conteúdo até 1280 px; lista vazia com mensagem e botão no centro; menu lateral rola com "Logada como" fixo. Conferido em 1440 e 1280 px.

## 2026-10-06 · main · Visual delicado (estilo-aluna e estilo-painel)

- Botões em pílula com 13 px, brilho suave só em cima e sombra leve; etiquetas com 11 px; play da aula com 40 px; barra de progresso de 8 px. Valores exatos de docs/referencias/estilo-aluna.html e estilo-painel.html.
- Painel com as cores da apresentação: menu lateral verde escuro com a logo clara (o arquivo agora é claro de verdade, sem filtro) e bolinha de cor por módulo; resumo em sálvia, menta, areia e rosado; tabela e cartão como na referência; Rascunho dourado; botões por ação (verde escuro editar e salvar, dourado criar, coral tirar do ar e encerrar).
- Área da aluna: fundo e menu brancos, item ativo em vidro verde mais delicado, faixa da live em pílula, títulos com 30 px.
- MAPA e CLAUDE.md: estilo-aluna e estilo-painel são o padrão visual oficial.

## 2026-10-06 · main · Estilo brilho no sistema

- Painel e área da aluna no estilo-brilho (docs/referencias/estilo-brilho.*): fundo branco, cartões brancos lisos com sombra leve, menu lateral branco flutuante com a logo verde e o item ativo em vidro verde; botões, etiquetas, check-in, play e faixa da live em vidro brilhante; o que ainda não foi feito em vidro cinza.
- Componentes reutilizáveis em src/components/ui/Brilho.tsx (BotaoBrilho, LinkBrilho, EtiquetaBrilho, BarraProgresso) e classes .brilho-* em src/styles/index.css, com as cores exatas da referência. Cartao virou branco com sombra.
- Barras douradas com o que falta: etapa da trilha (faltam N aulas), progresso da aluna no painel e andamento do desafio (novo: Dia X de Y · faltam Z dias, regra progressoDesafio em src/domain/painel.ts).
- Login segue com o botão antigo; vendas e checkout sem mudança.

## 2026-10-06 · main · Logo da HORA no sistema

- LogoHora (src/components/ui): SVG de public/ com a proporção travada. Painel: logo clara (140 px) no topo do menu verde e na barra do celular. Área da aluna: barra no topo com a logo verde à esquerda, no computador e no celular. Entrar: logo verde centralizada no lugar da do ORA. Vendas, checkout, ícone e favicon sem mudança.
- Pendente: logo-hora-clara.svg veio verde igual à escura; por ora um filtro deixa a imagem branca no fundo verde. Com o arquivo claro de verdade, tirar o filtro em LogoHora.

## 2026-10-06 · main · Fonte Arial no sistema

- Painel e área da aluna (tudo em /app) em Arial: classe font-sistema na raiz de /app (src/app/AreaAluna.tsx), 16 px e entrelinha relaxada; títulos em Arial negrito verde ORA, um pouco maiores; números do resumo em Arial negrito grande. Sem Playfair no sistema. Página de vendas, checkout e login sem mudança. Regra no CLAUDE.md.

## 2026-10-06 · main · Área da aluna para computador

- Todo o sistema é feito para computador e responsivo para celular (regra no CLAUDE.md). Área da aluna: no computador, barra lateral verde no padrão do painel (HORA em ocre, 5 itens com ícone, logada como) e conteúdo na largura da tela; no celular, barra fixa embaixo com 5 ícones.
- Início em duas colunas, trilha com aulas em grade, aula com vídeo grande e a lateral com título, material e concluir; primeiro acesso num cartão centralizado.

## 2026-10-06 · main · Painel completo

- Menu com 11 módulos na ordem pedida, cada um com bolinha colorida, todos no visual da referência.
- Cardápios por objetivo (6 refeições e lista de compras), publicar e tirar do ar. Desafios e prêmios: período, tipo de check-in (sim ou não, foto, número com unidade e meta por dia), dias para concluir, pontos por dia, bônus, prêmio, todas ou só inscritas; encerrar (dois toques) e vencedoras.
- Alunas só leitura: início, dia, último acesso (perfis.ultimo_acesso_em, gravado ao abrir a área da aluna), status Em dia, Atenção (3 dias), Sumiu (7 dias), progresso nas aulas.
- Configurações: preços cheios e da oferta, janela da oferta e textos de termos e privacidade saem do código para a tabela configuracoes. Página de vendas, checkout e termos leem por fetch simples, com os valores atuais como reserva.
- Pontos e indicações, Fórum, Financeiro e Loja: visual pronto, cartões zerados e "Nenhum registro ainda".
- Migração 20261007120000_painel_completo (45 checagens no PGlite). Tipos escritos à mão até aplicar a migração; depois, regerar com npm run gen:types.

## 2026-10-06 · main · Área da aluna

- Seguindo docs/referencias/app-aluna.png: largura de celular (centralizada no computador), barra fixa com 5 ícones desenhados (Início, Trilha, Desafios, Ranking, Perfil), cartões areia, títulos Playfair verde ORA.
- Primeiro acesso (sem apelido ou sem consentimento): boas-vindas com a logo, apelido do ranking, aceite do uso dos dados de saúde; grava apelido e consentimento_saude_em.
- Início: saudação pela hora de Brasília e inicial, check-in (só visual, valores de exemplo), aula de hoje, próxima live, ranking (exemplo).
- Trilha: tema da aula de hoje (dias 1 a 7: "Comece por aqui · 7 dias de preparação"), etapas em abas, progresso da etapa e semana, aulas concluídas, próxima e fechadas com a data em que abrem. Aula: vídeo, profissional e duração, texto, material, marcar como concluída.
- Migração 20261007090000_trilha_aluna: aulas.duracao_minutos e profissional (campos novos no painel), aulas_concluidas com RLS, minha_trilha() sem link de vídeo. 26 checagens no PGlite. Regras em src/domain/trilha.ts com testes.
- Desafios e Ranking ficam "Chega em breve" nesta etapa. Perfil mostra nome, apelido e sair.

## 2026-10-06 · main · Visual do painel igual à apresentação

- Painel refeito sobre docs/referencias/painel-apresentado.png: barra lateral verde fixa (HORA em ocre, itens com bolinha colorida, item ativo com fundo claro, "Logada como" com o nome da perfis), fundo areia, título em Playfair, cartões de resumo (sálvia, ocre, terracota), tabela branca com cabeçalho em caixa alta pequena e etiquetas Publicado (verde) e Rascunho (ocre).
- Clicar numa linha abre o item num cartão branco à direita, sem sair da tela: tema (publicar, editar, etapas e aulas), aula (formulário com prévia do vídeo), live e aviso (dados, publicar e formulário). Lista vazia: mensagem curta e botão de criar no centro. No celular a barra vira menu aberto por botão.
- Resumos: temas publicados, aulas publicadas e em rascunho; próxima live e lives agendadas; avisos ativos.
- Rotas de detalhe apontam para a página da lista. Nada mudou no banco. useNome novo na feature auth.
- Prints feitos com build local apontando para um servidor falso com dados de exemplo (produção está vazia e nada foi gravado lá).

## 2026-10-06 · main · Painel admin

- /app/admin só para papel admin (usePapel na feature auth; quem não é admin volta para /app). Mobile primeiro, abas fixas embaixo: Conteúdo, Lives, Avisos.
- Conteúdo: temas, etapas e aulas com criar, editar, publicar/tirar do ar e reordenar (botões subir/descer). Aula: prévia do vídeo ao colar o link (src/lib/video.ts: YouTube, Vimeo, Google Drive), material e liberação "Liberada na compra" (dia 1), "Depois de 7 dias" (dia 8) ou outro dia.
- Lives e avisos com datas no horário de Brasília (paraCampoBrasilia/deCampoBrasilia em src/lib/datas.ts).
- Migração 20261006180000_ordem_conteudo (aplicada): mover_tema/etapa/aula só para admin; unique de etapas adiável. 16 checagens novas no PGlite.
- Conta admin de teste criada no banco (admin.teste@exemplo.com); senha só no arquivo local ~/HORA-admin-teste.txt, fora do repositório. Login, papel e RLS conferidos por API.
- Atalho "Painel das profissionais" na tela inicial para admins. Pacote do painel: 25 KB, só carrega em /app/admin.
- Pendente: excluir (por enquanto, tirar do ar); apagar a conta de teste depois dos testes.

## 2026-10-06 · main · Liberação em horas exatas desde a confirmação

- Pedido da dona do projeto: os 7 dias contam a partir da hora da confirmação do pagamento, não por calendário.
- Migração 20261006150000_acesso_por_hora: perfis.acesso_inicio/acesso_fim (data) viram acesso_inicio_em/acesso_fim_em (com hora); tem_acesso_ativo e dia_de_acesso recalculadas (dia N começa após (N-1) x 24 h).
- Teste novo: um minuto antes de completar 7 dias a aula de dia 8 segue fechada; ao completar, libera. 79 checagens no PGlite.
- Aplicada no banco remoto e tipos gerados (perfis só com acesso_inicio_em e acesso_fim_em).

## 2026-10-06 · main · Regra de liberação registrada

- Combinado com a dona do projeto: o acesso começa na aprovação do pagamento; as aulas marcadas como dia 1 liberam na hora e as de dia 8 depois de 7 dias (calendário, Brasília). Registrado no CLAUDE.md e nas tarefas do painel e do mp-webhook.

## 2026-10-06 · main · Tabelas de conteúdo com RLS

- Migração 20261006120000_conteudo: temas, etapas (ordem única por tema), aulas (título, descrição, vídeo, material, dia_liberacao), lives (data, tema, convidada, link, gravação) e avisos (publicar_em); todas com "publicado" e updated_at automático.
- Acesso: perfis.acesso_inicio/acesso_fim (a aluna não altera), hoje_brasilia(), tem_acesso_ativo() e dia_de_acesso() (dia 1 = início, fuso de Brasília). Funções fora do alcance do anônimo.
- RLS: admin escreve e lê tudo; aluna com acesso ativo lê só o publicado (aulas só até o dia de liberação, e com etapa e tema publicados; avisos só depois de publicar_em); sem acesso, acesso futuro ou vencido não vê nada; anônimo não lê nada.
- 44 checagens no PGlite (anônimo, aluna no dia 6, sem acesso, acesso futuro, acesso vencido, admin, validações).
- Aplicada no banco remoto (zijtjwhvnhfarmfscmnr) e tipos gerados; conferido lá: RLS ligada nas 5 tabelas, 2 policies cada, anônimo sem leitura e sem as funções de acesso.
- Pendente: quem preenche acesso_inicio é o pagamento (Sprint 2).

## 2026-10-06 · main · FAQ do acesso, termos no checkout e novas tarefas

- FAQ "Quando recebo o acesso?": usuário e senha assim que o pagamento é confirmado; boas-vindas e 7 dias de preparação; no 8º dia a escolha do tema.
- Checkout: "Ao finalizar, você concorda com os Termos de uso e a Política de privacidade" em letra pequena abaixo de "Finalizar compra", com links, sem checkbox (teste novo).
- TAREFAS: check-in de foto da refeição (+5, 1 por dia) na Sprint 3; níveis da aluna e lives gravadas na Sprint 4.

## 2026-10-06 · main · Checkout conferido no celular

- Checkout em 360 e 390 px: nada passa da largura da tela; estados normal, com erros e com aviso de pagamento conferidos por captura.
- "Voltar para a página" com área de toque de 44 px; mensagens de erro do Campo em terracota escuro (contraste AA em texto pequeno).

## 2026-10-06 · main · Vídeo contínuo no iPhone, sem faixa de palavras, chamadas por seção

- VideoFundo volta a um único vídeo que troca de arquivo (no iPhone o vídeo já liberado continua tocando os próximos; os escondidos não tocavam e a troca ficava preta). A primeira imagem do próximo cobre a troca e some no evento playing; prefetch do próximo arquivo (Chrome/Android).
- Sai a faixa de palavras passando (Esteira).
- Cada seção com chamada própria no botão para os planos (Secao cta, textos por seção); teste garante que nenhuma se repete.

## 2026-10-06 · main · Títulos em Playfair Display

- Italiana sai; títulos em Playfair Display 500 (escolha entre quatro opções comparadas lado a lado). Nenhum título passa da largura de 360 px. Decisão 0004 e CLAUDE.md atualizados.

## 2026-10-06 · main · Vídeo sem engasgo e respiro no celular

- VideoFundo mantém montados o vídeo atual, o próximo (carregando escondido) e o anterior; a troca é um esmaecimento de 0,7 s, sem piscar a imagem parada. Força o "mudo" que o iPhone exige e, se o navegador recusar tocar sozinho (economia de bateria), tenta de novo no primeiro toque. Com "Reduzir movimento" ligado continua só a imagem.
- Celular: margem lateral de 24 px e mais respiro nas seções, topo com a logo afastada da borda, checkout com mais margem. Computador sem mudança.

## 2026-10-06 · main · Vídeos em cortes curtos e botão em cada seção

- Vídeo de fundo: corrida, academia (6326781/32239227), salada e refeição (9034023/8171533), cada um no máximo 6 s (TAKE_SEGUNDOS). Sai o yoga na piscina. Teste garante a ordem e que vários avisos de tempo não pulam clipes.
- Botão "Quero entrar na HORA" no fim de cada seção levando a #preco (Secao, exceto a de planos: semBotao).

## 2026-10-06 · main · Oferta só no dia do evento (24/10)

- Regra nova (pedido da dona do projeto): R$ 300 OFF + 1 mês grátis só em 24/10/2026, 00h00 a 23h59 de Brasília. src/domain/oferta.ts ganhou INICIO_OFERTA_ORA e estadoOferta (antes, durante, depois); precos.ts troca tempoRestanteOferta por contagemOferta (conta até começar ou até acabar).
- Página: antes do dia mostra preço cheio e o aviso "Só no dia 24/10, no evento ORA" com contagem "Começa em"; no dia, preços da oferta, riscado, +1 mês grátis e "Termina em"; depois, preço cheio sem aviso. useEstadoOferta vira sozinho nas duas viradas. Nova pergunta "Quando vale a oferta do ORA?".
- Checkout segue a mesma regra (selo e mês grátis só no dia). Termos e CLAUDE.md atualizados.
- Tema "Seus exames estão em dia?" removido (a médica não avalia exames): agora "Mais energia no dia a dia" no app e no cartão da Dra. Clara.

## 2026-10-06 · main · App colorido e revisão no celular

- App na página colorido com a família ORA (terracota, sálvia, ocre, verde; tons suaves novos em index.css), mapa em components/app/cores.ts; selos alternando as cores.
- Checkout: véu do vídeo mais claro (tinta 40%) com sombra no texto, banner mais alto; selos da oferta sem sombra e sem quebrar linha.
- Revisão no celular (360 px, página inteira quadro a quadro): celular do app passava da tela pequena e cortava o texto ao lado; corrigido. Nenhuma página passa da largura da tela.

## 2026-10-06 · main · Página mais moderna: app por dentro, barra fixa e esteira

- Referências: nutrium.com/pt-br/employees e o documento do app (artifact "Proposta", nome antigo Constância, agora ORA).
- "Por dentro do app" (components/app): protótipo de celular com as telas Hoje (hábitos marcáveis somam pontos), Plano (cardápio com substituições e treino), Desafios, Ranking (pontos, nunca peso) e Eu; troca de tela sozinha a cada 5 s até a pessoa tocar; selos de pontos flutuando. Dados de exemplo em textos/app.ts.
- Barra de topo translúcida com logo e "Ver planos", aparece depois do vídeo. Esteira de palavras passando (Nutrição, Saúde, Movimento, Comunidade, Constância).
- Profissionais no estilo Nutrium: círculo atrás da foto e cartão do app flutuando em cada uma.
- revelar.ts dispara com qualquer pixel visível (threshold 0).

## 2026-10-06 · main · Vídeos de saúde, movimento e página mais cheia

- Vídeos de fundo: corrida (7884055/7884028), salada (6162045/8802441) e yoga (8045825/8045817). Saem autocuidado de rosto e torrada. VideoFundo foi para src/components/shared e também roda atrás do banner do checkout.
- Movimento: src/lib/revelar.ts (blocos sobem e aparecem ao rolar, cartões em sequência), entrada animada do topo, botões sobem levemente no hover. Nada disso com "reduzir movimento".
- Menos vazio: números viram faixa compacta abaixo do vídeo; "Você já tentou" e perguntas em duas colunas no computador; "O que você recebe" em duas colunas; respiro das seções menor.

## 2026-10-05 · main · Mês grátis em destaque e checkout com a marca

- Oferta: "Compre 12 meses e ganhe 1 mês grátis" vira o título do aviso; selo "+1 mês grátis" nos três planos; "12 meses + 1 mês grátis" no lugar de "13 meses de acesso".
- Checkout: logo ORA no resumo (no lugar da foto) e banner do programa (creme, "A" de marca d'água, Comunidade HORA, oferta + 1 mês grátis).

## 2026-10-05 · main · Checkout próprio (visual, pagamento desligado)

- Opção 1 escolhida: checkout próprio no formato do Hotmart, na identidade do ORA (feature checkout, rota /checkout, lazy, 10 KB).
- Popup grava o lead, guarda nome, e-mail, WhatsApp e plano na sessão do navegador (nunca na URL) e leva a /checkout, que chega preenchido.
- Checkout: banner com foto e oferta, resumo e troca de plano, dados pessoais com CPF (máscara e dígitos verificadores em src/domain/cpf.ts), forma de pagamento conforme o plano com quadro #pagamento-mp, lateral com incluído, garantia, WhatsApp e compra segura.
- Saem os links VITE_MP_LINK_* (env, tipos, .env.example). Campo (ui) passa a deixar o erro fora do rótulo, com aria-describedby.
- Pendente: conta Mercado Pago da cliente; Payment Brick no #pagamento-mp e Edge Function criar-pedido (Sprint 2). Até lá "Finalizar compra" só avisa que o pagamento será liberado em breve.

## 2026-10-05 · main · Popup de inscrição

- Popup só com nome, e-mail e WhatsApp (placeholders "Digite seu nome", "Digite seu melhor e-mail", "Digite seu DDD + WhatsApp"; rótulos para leitor de tela), título "Preencha os dados abaixo e garanta a sua inscrição", resumo do plano escolhido no cartão e botão "Fazer minha inscrição".
- O plano vem do cartão; o botão do topo rola até os planos.
- Campo (components/ui) ganhou rotuloOculto. Teste do popup pré-carrega o formulário (evita falha por lentidão).
- Pendente: checkout próprio no estilo Hotmart depende da conta Mercado Pago da cliente.

## 2026-10-05 · main · Página sem repetição

- Embaixo dos planos: "Compra 100% segura! Receba seu acesso imediatamente após confirmação do pagamento."
- Saem: CTA final com preços repetidos, "Fidelidade de 12 meses" e "Acesso a tudo desde o primeiro dia" nos cartões (este contradizia as aulas liberadas aos poucos), "Acesso liberado no lançamento" do topo.
- Acesso: FAQ e /obrigada dizem que usuário e senha provisória chegam por e-mail assim que o pagamento é confirmado.
- "Nutricionista, médica nutróloga e educadora física" só no topo; "recorrente" virou "mensal" em toda a página, popup e termos.

## 2026-10-05 · main · Página mais junta e preço com cara de venda

- Espaçamento menor em todas as seções, títulos menores, "Como funciona" e "Para quem é" em cartões, texto em peso normal (mais acolhedor).
- Saem: faixa fixa do topo (botão "Quero" e contagem), seção de prêmios do ranking e a seção grande de garantia.
- Preço: aviso "Oferta ORA: R$ 300 OFF" com contagem e "válida só até 24/10, às 23h59" dentro da seção; três planos lado a lado (à vista, parcelado em destaque, mensal), cada um com o preço normal riscado na oferta e botão próprio que abre o popup com o plano marcado; selo pequeno de garantia de 7 dias embaixo.
- Preços e contagem em Montserrat (o "1" da Italiana parecia "I").

## 2026-10-05 · main · Vídeo de fundo em tela cheia

- Primeira dobra refeita no estilo de carolinastaxbusiness.com: vídeo cobrindo toda a largura também no computador, véu escuro e texto centralizado (antes, no computador, o vídeo ficava num quadro ao lado).
- Versões horizontais do Pexels para tela deitada (8045817, 4360750, 12322630); verticais seguem no celular. A troca acompanha girar o aparelho.

## 2026-10-05 · main · Página de vendas na identidade da Imersão ORA

- Visual trocado para o das capas e do carrossel do Drive: Italiana caixa alta + Montserrat itálico leve (Destaque), fundo creme, verde ora, etiquetas "ORA · 2026" e o "A" da logo como marca d'água (decisão 0004).
- Primeira dobra com vídeo de fundo do Pexels (exercício, alimentação, cuidado) em sequência; quadro vertical no computador; imagem parada para menos movimento ou economia de dados.
- Fotos reais do ensaio (Lightroom): Ana 454, Clara 46, Laís 274 e as três juntas (81 e 155), em public/fotos.
- Laís passa a "educadora física", como nas capas.
- JS da rota /: 345,3 KB (109,2 KB gzip). Vídeos: 1,1 a 1,5 MB cada, só o clipe em exibição é baixado.
- Pendente: nome da fonte original das capas; dúvida sobre quem está nas fotos 460 a 546 do ensaio (macacão verde, consultório).

## 2026-10-05 · main · Página de vendas refeita do zero

- Nova página na ordem pedida: faixa fixa da oferta com contagem, primeira dobra, números, problema, o que é, como funciona, profissionais, depoimentos (some vazio), para quem é, o que recebe com selos BÔNUS, preço ancorado, prêmios, garantia, perguntas, CTA final, rodapé e WhatsApp flutuante. Títulos com uma palavra em Fraunces itálica.
- Compra: todo botão abre um popup (dialog nativo) com forma de pagamento, nome, e-mail e WhatsApp; grava o lead (no máximo 4 s, sem travar a venda) e vai para o link do Mercado Pago do plano. Linha de Termos e Privacidade, sem checkbox. Páginas /obrigada, /termos e /privacidade.
- Contrato fora da página: migração 20261005090000 remove aceitou_termos_em e versao_termos; função aceita o corpo antigo e ignora esses campos. termos.ts removido.
- Preços: ancoraCentavos, DESCONTO_OFERTA_CENTAVOS e precosPara; o 13º mês some depois da oferta; bônus da loja parceira atrás de flag desligada.
- JS da rota /: 340,9 KB (107,9 KB gzip), antes 326 KB; o aumento é a copy. Formulário, React Hook Form e zod só no pedaço do popup.
- Pendente: publicar (função, migração, tipos, push); variáveis VITE_MP_LINK_* e VITE_WHATSAPP_NUMERO na Vercel; retorno dos links para /obrigada; conteúdo das clientes (TAREFAS).

## 2026-10-04 · main · Cadastro de interessadas

- Tabela interessadas com RLS: nada para visitante e aluna, leitura só para admin (eh_admin()), gravação só pela service role; checagens de formato no banco e 13 testes em PGlite.
- Edge Function cadastrar-interessada: valida com zod (validar.ts, testado no vitest), honeypot no campo "site", origem liberada por ORIGENS_PERMITIDAS, responde só { ok }. verify_jwt desligado (formulário público).
- Na página, os cartões de preço viram a escolha do plano num formulário (React Hook Form + zod, carregado sob demanda) com nome, e-mail, WhatsApp com máscara e aceite do contrato. UTMs da URL ficam na sessão e vão junto.
- Ao gravar, o formulário devolve o plano escolhido e mostra a próxima etapa (botão de pagamento ainda desativado, tarefa 3). A tela rola e o foco vai para a confirmação, que fica acima depois que o formulário some.
- Arquivos: migração 20261004120000_criar_interessadas, supabase/functions/cadastrar-interessada, _shared/cors.ts, src/features/vendas (Cadastro, EscolhaPlano, opcoes, useCadastro, api, schemas), src/lib/telefone.ts, src/lib/utm.ts, src/domain/termos.ts.
- Pendente: aplicar migração e publicar a função no remoto (comandos em docs/runbooks/interessadas.md); página /contrato e versão final (hoje 2026-10-04-provisorio); política de privacidade; limite de envios por IP se aparecer spam.

## 2026-10-04 · main · Página de vendas, parte 1: rotas e layout

- "/" virou a página de vendas pública (feature vendas, textos provisórios em textos.ts); login segue em /entrar e a área da aluna foi para /app.
- Preços em src/domain/precos.ts: oferta do ORA (12x 198, 12x 215, 1.997 no Pix, 13 meses) até FIM_OFERTA_ORA, cheios depois, com contagem regressiva; testes de domínio e da tela.
- Login, área da aluna, Supabase e React Query carregam sob demanda: JS inicial de 671 KB (196 KB gzip) para 324 KB (103 KB gzip).
- PWA com escopo /app/ e registro só dentro de /app (decisão 0003); service worker antigo de escopo / é removido. Meta tags e imagem de compartilhamento.
- Pendente: fotos das três profissionais, copy final, logo em SVG, botões de pagamento (tarefa 3), páginas de termos e privacidade.

## 2026-10-04 · feat/tela-entrada · Tela de entrada com a logo

- Login mostra a logo ORA (public/logo-ora.png, fundo transparente) e o título "Chegou a sua HORA de começar", com e-mail e senha embaixo.
- Arquivos: src/features/auth/pages/LoginPage.tsx, src/features/auth/textos.ts, public/logo-ora.png.
- Pendente: logo em SVG ou maior resolução; confirmar se existe logo própria da HORA.

## 2026-10-04 · chore/banco-pglite · Infraestrutura conectada (Sprint 0, parte 2)

- GitHub: repositório horasaude/hora, main enviada com chave SSH própria (core.sshCommand do repo), sem mexer no login do gh.
- Banco: testes passam a rodar em PGlite (supabase/tests/harness.mjs), sem Docker; 9 checagens de perfis. Supabase CLI só para o remoto (decisão 0002).
- Migração renomeada para 20261004000000_criar_perfis, sem comentários, e aplicada com db push no projeto zijtjwhvnhfarmfscmnr. seed.sql vazio; teste pgTAP removido.
- Um projeto Supabase só (sem staging), por decisão da dona do projeto. Vercel no time hora3 com VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY do tipo Config; login abre em hora-snowy.vercel.app.
- Arquivos: supabase/tests/*, package.json, ci.yml, CLAUDE.md, README.md, ARQUITETURA, MAPA, TAREFAS, decisão 0002.
- Pendente: Site URL do Auth, tela de erro de configuração, backup e keep-alive, aviso de __dirname no vitest.config.ts.

## 2026-10-06 · main · Estrutura inicial (Sprint 0, parte 1)

- Projeto React + Vite + TypeScript com Tailwind, TanStack Query, React Router, Zod, React Hook Form e PWA.
- Lint (oxlint) com limite de linhas, sem any e fronteira entre features; Prettier; Husky com lint-staged.
- Feature auth (login e rota protegida) e feature inicio (placeholder).
- Supabase: migração de perfis com RLS, eh_admin() e trigger de criação de perfil; teste pgTAP.
- CI no GitHub Actions; vercel.json com rotas e cabeçalhos de segurança.
- Documentação: CLAUDE.md, MAPA, HISTORICO, TAREFAS, ARQUITETURA, decisão 0001; comandos /inicio, /tarefa, /fim, /revisar, /arrumar.
- Pendente: criar projetos Supabase (staging e produção), conectar GitHub e Vercel, configurar variáveis.
