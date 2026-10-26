# Histórico

Entradas mais novas no topo. Cada entrada: data, branch, o que foi feito, arquivos principais, pendências.

## 2026-10-26 · main · Cupom de desconto

- Painel, Configurações > Cupons de desconto: criar e editar cupom (código, % de 1 a 90 ou valor em reais, formas de pagamento, limite de usos, válido até, ligado), ligar e desligar na lista, usos contados pelos pedidos pagos (CuponsDetalhe, CupomJanela, CupomCampos, schemas/cupomForm.ts, api/cupons.api.ts).
- Checkout: campo Cupom de desconto abaixo do plano (aceita ?cupom=CODIGO no link); o valor dos planos já muda com ele. Pix e parcelado: desconto no total; mensal: em cada mensalidade; nunca abaixo de R$ 5 (src/domain/cupom.ts, CampoCupom, useCupom, api/cupom.api.ts).
- Servidor: criar-pedido confere o cupom em consultar_cupom e se a pessoa já pagou com ele (um por CPF e por e-mail, erro cupom_usado) e calcula o valor (regras.ts aplicarCupom); pedido guarda cupom_id e desconto_centavos. Migração 20261102240000_cupons (tabela cupons com RLS só admin, consultar_cupom para o visitante, usos()). O limite conta pagos mais pagamentos em andamento dos últimos 40 minutos.

## 2026-10-22 · main · Barra de baixo presa no celular

- No iPhone (app instalado) a barra de baixo, com position fixed, subia para o meio da tela ao puxar o fim da página. No celular o layout da aluna virou coluna com altura da tela: o conteúdo rola numa área própria e a barra fica embaixo sem fixed (src/app/LayoutAluna.tsx, NavegacaoAluna.tsx). Ranking: faixa da posição dela com bottom-4.

## 2026-10-22 · main · Cardápio impresso no modelo dos guias da ORA

- CardapioImpresso (cardapios): A4 com a logo e "GUIAS DE BEM-ESTAR / tema" no topo de cada página, chapéu ALIMENTAÇÃO, título grande verde, refeições com "Opção I, II..." (principal e substitutas), observação, e "Receitas para a semana" com ingredientes e preparo das receitas usadas; rodapé "ORA · Um momento para estar presente." e número da página pelo @page. Usado pela aluna (botão PDF sem PDF da nutricionista) e pelo Gerar PDF do painel. Conferido imprimindo uma página de exemplo no Chrome headless.

## 2026-10-22 · main · Cardápio e treino existentes no tema; excluir cardápio

- Painel, dentro do tema: "+ Adicionar cardápio" e "+ Adicionar treino" abrem a lista dos que já existem (busca, tema de cada um) com Adicionar e, no rodapé, Criar novo. Sem tema, o item passa a ser deste tema; de outro tema, ganha uma cópia em rascunho aqui (api/usarExistente.api.ts, components/AdicionarExistente.tsx, JanelasDoTema.tsx).
- Lista de Cardápios com Excluir em dois toques (apaga o PDF se nenhum outro plano usa).

## 2026-10-22 · main · Receitas e materiais dentro do tema; setas de voltar

- Receitas e materiais da nutricionista ganharam tema (migração 20261102140000_receitas_materiais_por_tema); no painel, a receita escolhe o tema nas pílulas (no lugar dos objetivos) e o material num campo Tema. Aluna: aba Receitas ao lado de Cardápio e materiais da nutricionista na aba Materiais do tema, só do próprio tema. Saiu o link "Ver receitas e materiais da nutricionista" e a página /app/cardapios (redireciona para a trilha).
- Seta de voltar também no carregando, erro e não encontrado: tema, aula, cardápio, lista de compras, receita, desafio, treinos e execução do treino; Seu dia com seta no computador.

## 2026-10-22 · main · Cobrança rigorosa da mensalidade

- Edge Function cobranca-diaria (pg_cron de hora em hora): às 8h de Brasília confere no Asaas todas as assinaturas vivas pelo mesmo caminho do webhook (mensal, exportada de pagamento-webhook/processar.ts), sem depender do aviso; das 8h às 20h manda a régua (lembrete no 3º dia, véspera no 6º com a data da pausa, acesso pausado no 7º), uma vez por atraso (avisos_cobranca).
- Webhook guarda a fatura em aberto (assinaturas.fatura_url) e limpa ao pagar. Lista de cobranças da assinatura com limit=100.
- Aluna: Início mostra "mensalidade em aberto" com Pagar agora; pausada vê "acesso pausado por falta de pagamento" com Pagar agora no Início e na Trilha (minha_pendencia). Painel: cartões Mensalidade em atraso e Acesso pausado e etiqueta na aluna (painel_alunas.cobranca).
- Migração 20261102120000_regua_cobranca; testes regua_cobranca.test.mjs e _shared/email/cobranca.test.ts.
- Conferência diária também passa Pix e parcelado aprovados nos últimos 60 dias pelo caminho do webhook (avulsa), para pegar estorno ou chargeback com aviso perdido. Migração 20261102130000_conferir_avulsas. Achado: compra real estornada no Asaas manteve o acesso (causa em investigação).

## 2026-10-22 · main · Vídeo sem baixar e descrição da live

- VideoIncorporado (src/components/ui): todos os players (aula, Comece por aqui, treino, gravação da live) passam por ele; no Drive, tampa invisível no botão de abrir em outra janela. gravacao-live marca o arquivo com copyRequiresWriterPermission (sem baixar, imprimir ou copiar) antes de liberar por link.
- Descrição da live: migração 20261102110000_descricao_live (lives.descricao até 2000), campo no painel, aparece no player da gravação.

## 2026-10-22 · main · Lives gravadas e postadas sozinhas

- Sala do Meet criada já gravando (artifactConfig.recordingConfig.autoRecordingGeneration ON; sem aceitar, cai para restrita sem gravar). Escopos novos meetings.space.settings e drive: precisa reconectar a conta Google.
- Edge Function gravacao-live (cron a cada 10 min só quando há pendente): acha a gravação da reunião no Drive, libera por link e grava lives.gravacao_url. Migração 20261102100000_gravacao_automatica (lives_salas.conta, gravacoes_pendentes, cron). Testes gravacao_live.test.mjs e _shared/gravacao.test.ts.
- Reconectar troca as salas das lives futuras para a conta nova. _shared/google.ts dividido em google.ts (OAuth) e meet.ts (salas).
- Pendências: projeto do Google Cloud interno no Workspace, reconectar com hora.adm@, gravação ligada e compartilhamento externo do Drive no admin; testar numa live curta.

## 2026-10-22 · main · PDF do cardápio

- Editor do cardápio no painel ganhou o bloco "PDF do cardápio" (enviar, trocar, remover). Aluna: o botão PDF abre o PDF da nutricionista quando existe; sem PDF continua a impressão. Migração 20261102090000_cardapio_pdf (colunas pdf_path e pdf_nome, bucket privado cardapios) e teste supabase/tests/cardapio_pdf.test.mjs.
- Pendências: montar as refeições automaticamente a partir do PDF (precisa de um PDF de exemplo e decidir IA ou leitor fixo).

## 2026-10-22 · main · E-mails pelo Google Workspace

- Envio dos e-mails das Edge Functions (boas-vindas, lembrete do Pix, cancelamento, convite de live) trocado do Resend para o SMTP do Google (smtp.gmail.com, 465, nodemailer). Secrets novos SMTP_USUARIO e SMTP_SENHA (senha de app); RESEND_API_KEY sai.
- Feito no mesmo dia: caixa contato@comunidadeora.com.br com senha de app, secrets gravados, funções publicadas e testadas, SMTP do Auth do Supabase no Google (nova senha testada, chega em português), SPF e DKIM do Google no Registro.br, RESEND_API_KEY apagada. Senha errada no SMTP faz o Google bloquear por um tempo (454 4.7.0 Too many login attempts).

## 2026-10-21 · main · Refeição como no Dietbox, vários planos e tipos de treino por tema

- Seta do cardápio e do desafio volta para o tema (não pelo histórico; quem passava pela lista de compras voltava para ela).
- Editor de refeição do painel igual ao Dietbox (conferido na conta da nutricionista, sem salvar nada lá): "Alimentos selecionados" em tabela com macros, quantidade e total; Adicionar alimento sempre soma uma linha; substitutos ("ou") só dentro de Editar alimento; refeição substituta no rodapé do bloco. Formato do jsonb sem mudança. Aluna vê o "ou" na mesma linha.
- Vários planos alimentares por tema: aluna escolhe na aba Cardápio do tema ("Escolha seu plano"); painel agrupa por tema e pede objetivo do plano. Migração 20261101190000_varios_planos_por_tema (o gatilho deixava todos com o nome do tema).
- Treinos: tipos de treino (rotinas) por tema em cartões, com "Para você" para nível e local dela; dentro, a semana em lista com todos os exercícios e os aeróbicos; painel com "Tipos de treino" agrupados por tema, seção Aeróbicos com Adicionar aeróbico e pílulas Musculação | Aeróbico. Migração 20261101180000_treinos_tipos_aerobico (mesmo dia aceita musculação e aeróbico).
- Pendências: observação na refeição substituta (precisa de campo no jsonb); trocar medida caseira ao editar a linha.

## 2026-10-21 · main · Aula: check automático com o vídeo em tela cheia no celular

- No banco, a aula 2 da aluna de teste tinha só [109,112] de 119 s contados (e o mesmo padrão em outras contas): em tela cheia no celular o navegador espaça as leituras do player, e a regra recusava avanço maior que 3 s entre leituras (tratava como pulo). Só contava quando a tela cheia fechava, no fim.
- Agora o avanço do vídeo é comparado com o tempo do relógio entre as leituras (até 2x, mais 1 s; nunca menos que 3 s): assistir em sequência conta mesmo com leituras espaçadas, e pulo para a frente continua não contando. O fim do vídeo (estado terminou) também registra o último trecho.
- O progresso que chega do banco soma aos trechos já contados na tela, em vez de substituir.
- buscarProgresso, aulaConcluida e o contador do perfil filtram pela própria conta (a equipe lê as de todas e, vendo como aluna, misturava).
- Conferido num teste local com o VideoYoutube real: trocar de aula sem recarregar continua ligando o player e contando o tempo.

## 2026-10-21 · main · Área da aluna no layout do protótipo da apresentação

- A dona aprovou o protótipo da apresentação do evento (~/ora-apresentacao, publicado à parte) e pediu o app igual: disposição, ordem e interações do protótipo; fonte Arial e botões do sistema (login segue Playfair + Montserrat).
- Login com foto das três, título e chips (BoasVindas). Início: topo com dia da jornada, pontos e posição, Pedido da equipe, Seu dia (4 bolinhas), Continue de onde parou, Desafio do mês com prêmio, Próxima live. Tela nova Seu dia (/app/dia) com hábitos, copos de água e Venci o dia. Anamnese com barrinhas e opções em cartão.
- Comece por aqui com Dia N e faixa Aberto/Em breve; tema com progresso acima das abas; aula com etiqueta Tema · Aula N e "Com profissional · min".
- Cardápio com refeições em cartão, trocas e PDF (impressão); treino em ficha com exercícios; desafio com o prêmio em destaque, calendário e Fiz hoje.
- Comunidade com seletor Lives | Fórum | Ranking no celular (ui/Segmento); live em cartão grande; fórum com resposta da equipe no cartão; ranking com pódio e Como ganhar pontos; loja com faixa da parceira; perfil com números, antes e depois e menu; Indique e ganhe em /app/perfil/indique.
- Pendências: cardápio de vários dias (pílulas só aparecem com mais de um dia); treino não guarda a profissional (mostra a Laís); /app/dia não acende item do menu; CartaoRankingInicio sem uso.

## 2026-10-21 · main · Capa do tema com o nome escrito; aula com a imagem do vídeo

- Cartão do tema: "Tema N" e o nome escritos na capa (foto com sombra embaixo; sem foto, a capa automática com o ícone à direita); cadeado no canto.
- Aula sem miniatura enviada usa a imagem do próprio vídeo do YouTube (i.ytimg.com hqdefault), que o banco só manda quando a aula está liberada (aulas_do_tema.miniatura; migração 20261101160000_miniatura_do_video.sql).

## 2026-10-21 · main · Prévia simula check e barra; player pede 1080p

- Os testes da equipe eram pela prévia (/app/previa), que não grava; agora a prévia marca a aula assistida (90%) só na tela, guardado na sessionStorage da aba, e a barra do tema anda; nada vai para o banco.
- Os 11 vídeos do Detox têm até 1080p no YouTube; o player passa a pedir hd1080 (vq na URL e setPlaybackQualityRange/setPlaybackQuality ao começar a tocar; se o YouTube ignorar, fica no automático).

## 2026-10-21 · main · Abas coloridas, bolinha de concluída e pré-visualização clara

- Abas do tema com cor própria quando escolhidas (Aulas verde, Cardápio coral, Treinos dourado, Desafio lilás, Materiais rosa); Abas aceita tom por opção; TomBrilho ganhou lilas e rosa.
- Cada aula liberada tem uma bolinha à direita: vazia, e com check verde quando concluída (automática ao assistir 90%).
- O "não marcou" de 21/10 era a pré-visualização (Conteúdo > Ver como aluna), que por regra não grava nada; o botão virou "Pré-visualizar (não grava)" e a faixa explica.

## 2026-10-21 · main · Aula: player novo a cada aula (check, progresso e qualidade)

- Ao ir para a próxima aula, o React reaproveitava a página e o iframe do YouTube só trocava de vídeo: a API perdia a ligação (sem contar tempo, sem conclusão automática, progresso parado) e o player ficava na qualidade baixa do começo; o "pedido" de concluir também ficava preso da aula anterior. Agora AulaPage remonta por aula (key) e o vídeo também. Vídeo voltou para a coluna da esquerda, com as aulas ao lado.

## 2026-10-21 · main · Aulas sem "Dia", progresso do tema e vídeo maior

- Cartão da aula e lista lateral mostram só "Aula N" (o dia não vale mais na sequência de temas).
- Aba Aulas do tema: barra "X de Y aulas concluídas · Z%"; cartão do tema aberto mostra a barra quando já tem aula concluída. A aula concluída continua com o check verde.
- Página da aula: vídeo na largura toda, acima das colunas (o YouTube escolhe a qualidade pelo tamanho do player); "Voltar para o tema". Conferido: os vídeos do Detox têm até 1080p no YouTube; o player começa baixo e sobe conforme a internet.

## 2026-10-21 · main · Excluir tema e aula no Conteúdo

- Cartão do tema: Excluir tema (dois toques); apaga as aulas e os materiais dele e limpa os arquivos e capas do espaço; cardápios e desafios ficam sem tema. Tema com treinos é barrado (treinos.tema_id é restrict) com aviso para excluir ou mudar os treinos antes.
- Janela da aula: Excluir aula à esquerda do rodapé (dois toques), com os arquivos e a miniatura.
- admin/api/excluir.api.ts, components/BotaoExcluir.tsx, textos/excluir.ts; teste de banco em liberacao.test.mjs.

## 2026-10-21 · main · Sala do Meet com Gmail comum

- "Criar sala no Meet" dava erro: o Google responde 403 "updateAccessType is not available to the user" porque sala restrita é só do Workspace e a conta conectada é Gmail. criarSala tenta a restrita e, nessa recusa, cria a sala comum; ajustarSala ignora a mesma recusa; membro que o Google não aceitar não derruba a criação (só registra). Com o Workspace conectado, a restrição volta a valer sozinha.
- Logs das Edge Functions agora saem pela API nova: GET /v1/projects/{ref}/analytics/endpoints/logs com sql em `logs` (event_message), sem logs.all nem tabelas por fonte.

## 2026-10-21 · main · Adicionar alimento mostra todos os alimentos

- A janela de adicionar alimento (refeição e receita) mostrava só os 30 primeiros em ordem alfabética. Agora carrega em levas de 60 ao rolar a lista (useInfiniteQuery em Resultados.tsx, buscarAlimentosParaEscolha com range), até os 597 da TACO e os próprios; a busca continua filtrando. Receitas aparecem primeiro em "Todas".

## 2026-10-20 · main · Capa automática dos temas

- Tema sem imagem ganha capa montada sozinha (CapaAutomatica): cor do tema (escolhida no painel ou pela chave), dois círculos claros e o ícone grande; vale para cartões dos temas, topo da página do tema e miniaturas das aulas. Detox ganhou ícone de gota. Tema novo já nasce com capa; imagem enviada no painel substitui.

## 2026-10-20 · main · Temas em sequência pela data de assinatura; tudo do tema dentro do tema

- Regra nova (migração 20261101150000_temas_em_sequencia.sql): sem escolha de tema e sem etapas. Os temas abrem em sequência pela data de assinatura: o primeiro (Detox, antiga Preparação) no dia 1 por 7 dias, os seguintes conforme temas.dias_liberado (padrão 30); a ordem é a do painel (arrastar). Tema aberto continua aberto. Ao abrir, aulas, cardápios, treinos, desafio e materiais do tema aparecem juntos (tema_aberto, inicio_do_tema, aula_liberada, trilha_aluna/trilha_previa com temas[]).
- Cada tema tem uma etapa interna só (etapa_do_tema); cardapios.tema_id (o objetivo segue o tema), desafios.tema_id com janela pessoal (janela_desafio: dias do tema de cada aluna), tema_materiais (salvar_materiais_tema; Edge Function materiais-aula aceita "tema:<id>").
- Aluna: menu com Início, Comece aqui, Comunidade (Lives, Fórum, Ranking), Loja e Perfil; Cardápios, Treinos e Desafios saíram do menu. Comece por aqui mostra os primeiros passos e os temas (cartões com capa, aberto, "Abre em N dias" ou Em breve); a página do tema (/app/trilha/tema/:id) tem abas Aulas, Cardápio, Treinos, Desafio e Materiais.
- Painel: tabela de temas com "Abre para a aluna" (Dia X · N dias); editar tema tem os dias; novo tema pede os dias e entra no fim; o cartão do tema reúne Aulas, Cardápios, Treinos, Desafio e Materiais com os botões de criar já dentro do tema. A aula pede só o tema. Desafio pode ser de um tema (sem datas) ou geral.
- Testes de banco reescritos para a regra nova (trilha, conteúdo, materiais, cardápios, treinos, pendências, aula assistida, liberação).

## 2026-10-20 · main · Trilha no visual de área de membros (capas, módulos, miniaturas) e tampa no YouTube

- Tema e aula ganham capa (temas.capa_path, aulas.capa_path; espaço público capas, só imagem até 5 MB; migração 20261101140000_capas_trilha.sql). Painel: "Capa do tema" na janela de editar tema e "Miniatura da aula" na janela da aula.
- Aluna: capa grande do tema no topo (CapaTema; sem imagem, verde ORA com o ícone), etapas como módulos que abrem e fecham com "x de y concluídas" (ModulosEtapas, a atual aberta), aulas em cartões com miniatura, "Aula N · Dia X", duração, cadeado ou Em breve (CartaoAula). Escolha de tema mostra a capa. Na aula, os arquivos foram para a coluna da direita no computador.
- Vídeo continua no YouTube (Panda achado caro): tampa transparente por cima do título e do "Assista no YouTube" antes do play e do logo durante (VideoYoutube), iv_load_policy=3. Não impede quem souber pegar o link pelo navegador.
- Sem chat de IA na aula (o fórum já cobre as dúvidas).

## 2026-10-20 · main · Ficha da aluna: o que ela já fez e Lembrar

- Painel > Alunas, ficha: "O que ela já fez" com a anamnese (Feito, Começou, Falta), os 5 passos do Comece por aqui, o tema (do dia 8) e nível e local do treino; no que falta, Lembrar (admin/pendencias). As respostas da anamnese continuam logo abaixo.
- Lembrar: Edge Function lembrar-aluna (banco lembrar_aluna confere equipe e pendência, um por item a cada 12 h) e push no celular se ela ativou; a aluna vê "A equipe pediu" no Início (feature lembretes), que some quando faz.
- Migração 20261101130000_pendencias_aluna.sql; testes supabase/tests/pendencias.test.mjs.

## 2026-10-20 · main · PAR-Q na anamnese inicial e aviso no Início

- As 7 perguntas do PAR-Q (modelo do MFIT da Laís) entraram na Anamnese inicial, antes da última pergunta, todas sim ou não e obrigatórias; a anamnese foi publicada (migração 20261101120000_anamnese_parq.sql).
- Início da aluna mostra "Responda sua anamnese" desde o dia 1 enquanto ela não enviar (AvisoAnamnese, que já aparecia em Treinos).
- Conferido em produção: aulas 0, cardápios 0, receitas 0, desafios 0, treinos 0 de 8 publicados, loja 0 de 68, vídeo do Comece por aqui vazio; por isso a área da aluna aparece vazia.

## 2026-10-20 · main · Materiais no plano alimentar (vindos do Dietbox)

- Painel > Plano alimentar > Materiais (/app/admin/plano/materiais): lista, criar e editar (nome e texto), publicar e excluir. Tabela materiais_nutricao (migração 20261101110000_materiais_nutricao.sql) com os 5 materiais do Dietbox já publicados: Chás diuréticos, Lista de frutas, Manejo de ansiedade, Molhos para salada, Monte sua salada.
- Aluna: Cardápios ganha a aba Materiais (?aba=materiais), cartões que abrem e fecham.
- Testes: supabase/tests/materiais_nutricao.test.mjs.

## 2026-10-20 · main · Loja na barra de baixo e X da escolha de treino

- Loja virou a 6ª aba da barra da aluna no celular (saiu de Comunidade); rótulos menores para caber em 360 px.
- Escolha de nível e local do treino: o X agora fecha (volta para o Início); antes não fazia nada.

## 2026-10-20 · main · Sem jejum, Venci o dia automático, excluir ação, conta de desenvolvedora

- Jejum intermitente saiu do quadro da semana e das regras de pontos (migração 20261101100000_venci_automatico_sem_jejum.sql).
- Venci o dia não é mais manual: public.vencer_dia marca sozinho e dá os pontos quando Sono, Hidratar-se, Dieta e Treino do dia estão feitos (chamado por fazer_checkin e registrar_agua); fazer_checkin recusa venci e jejum.
- Pontos e indicações: Excluir ação na janela de editar a regra (dois toques); política de delete só para admin.
- perfis.desenvolvedora (só pelo banco; ligada para admin.teste@exemplo.com): passa entre painel e área da aluna (Ver como aluna no menu do painel, Painel das profissionais em Perfil > Conta).
- Loja da aluna vazia no celular: os 68 produtos da Active Life estão em rascunho; aparece ao publicar no painel.

## 2026-10-20 · main · Liberação de tema e aula, temas por arrastar, arquivos no Comece por aqui

- Tema e aula ganham Liberação para a aluna: Disponível, Em breve (cadeado) ou Liberar em data e hora (temas.bloqueado/libera_em e aulas.bloqueado/libera_em; banco: public.fechado, aula_liberada, aulas_da_etapa e trilha_aluna com em_breve, escolher_tema recusa tema fechado, etapa_pode_avancar não conta aula fechada). Migração 20261101090000_liberacao_conteudo.sql.
- Painel: campo na janela da aula e na de editar tema (CampoLiberacao), etiqueta Em breve ou Libera dd/mm na lista; temas mudam de ordem arrastando a linha (ordenar_temas), as setas continuam para o celular.
- Comece por aqui: arquivos (PDF, Word, imagem) como na aula (comece_materiais, salvar_materiais_comece, pasta comece/ do bucket materiais); a aluna vê pela Edge Function materiais-aula com aula_id "comece".
- Aluna: aula fechada mostra cadeado e Em breve; tema fechado aparece com cadeado e não pode ser escolhido.
- Testes: supabase/tests/liberacao.test.mjs (62), domain/liberacao.test.ts, FormAula e formularios.

## 2026-10-20 · main · Profissional só no painel, Sair no painel

- Conta admin que abre /app vai direto para /app/admin (src/app/LayoutAluna.tsx); só a prévia (/app/previa) continua abrindo na moldura da aluna.
- Removidos os atalhos "Painel das profissionais" (Início e Perfil > Conta) e o "Ir para a área da aluna" do menu do painel, que virou "Sair da conta" (MenuLateral.tsx).
- Para ver como aluna, as profissionais usam uma conta de aluna de teste (apagar no dia 23/10 junto com as outras).

## 2026-10-20 · main · Lives: sala do Meet restrita, várias profissionais, convidadas e convite na agenda

- Migração 20261031110000_lives_sala_restrita.sql: lives.profissionais (várias), lives_convidadas (nome e e-mail, só a equipe lê; salvar_convidadas), lives_salas (link e sala do Meet, só a equipe lê; a aluna não vê mais o link), lives_convites (fila do .ics) com convite_seq (sobe ao publicar, mudar tema/horário/duração ou tirar do ar), destinos_da_live e convites_pendentes; entrar_live lê o link de lives_salas; cron convites-live a cada minuto só quando há pendente. Teste supabase/tests/lives_sala.test.mjs.
- Sala do Meet restrita (accessType RESTRICTED): equipe (coanfitriã) e convidadas viram membros ao salvar a live (google-meet/sala.ts); a aluna vira membro ao clicar em Entrar (Edge Function live-entrar). Link repassado cai no "Pedir para participar". Para entrar direto, a aluna precisa estar logada no Google com o e-mail do cadastro.
- Convite de agenda por e-mail (.ics REQUEST/CANCEL, aviso 1 hora antes) para equipe, convidadas e alunas com acesso, com a atualização e o cancelamento (Edge Function convites-live, _shared/email/conviteLive.ts). O convite leva para Lives no ORA, nunca para a sala.
- Painel: sai o campo de link; a sala é sempre criada sozinha. Profissionais em caixas de marcar e convidadas com nome e e-mail (ParticipantesLive.tsx).
- Pendências: assinar o Google Workspace Business Standard (precisa de domínio próprio; o hora.admin@gmail.com não serve para esse plano) e reconectar com a conta nova; gravação segue manual no YouTube.

## 2026-10-19 · main · Estorno de uma compra não derruba o acesso de outra

- Migração 20261031100000_encerrar_com_outra_compra.sql: encerrar_pedido só encerra o acesso (e cancela a indicação) quando a pessoa não tem outra compra aprovada. Achado no teste do sandbox: o estorno do parcelado tirou o acesso de quem também tinha o mensal e o Pix aprovados. Testes em pagamentos e cancelamento.
- cancelar-inscricao escolhe a compra aprovada mais recente.
- Chaves do Mercado Pago retiradas do Supabase.

## 2026-10-19 · main · Cancelamento pela plataforma

- Decisão 0006. Migração 20261031090000_cancelamento.sql (colunas de cancelamento em pedidos, teste supabase/tests/cancelamento.test.mjs). Edge Function cancelar-inscricao (consultar e cancelar; estorno no Asaas em até 7 dias, senão não renovar; e-mails em _shared/email/cancelamento.ts). Perfil > Minha conta: Cancelamento.tsx. Painel: Cancelamentos (admin/cancelamentos). Termos e privacidade atualizados (cartão passa pelo checkout a caminho do Asaas).
- Testes no sandbox do Asaas: Pix, parcelado 12x, mensal e estorno passaram.
- Pendência: convite de renovação ao fim dos 12 meses.

## 2026-10-19 · main · Cartão digitado no próprio checkout, de 1x a 12x

- A pedido da dona: nada de página do Asaas. DadosCartao.tsx (número, nome, validade, CVV, CEP, número do endereço; parcelas 1x a 12x no parcelado), máscaras em src/lib/cartao.ts (com Luhn e validade). criar-pedido recebe cartao e parcelas, manda creditCard, creditCardHolderInfo e remoteIp ao Asaas; recusa vira erro 'cartao'. Sai pagar_url.
- Pendências: confirmar no sandbox o código de erro de cartão recusado e se a produção aceita cartão pela API sem pedir liberação ao gerente.

## 2026-10-19 · main · Pagamento trocado do Mercado Pago para o Asaas

- Decisão 0005. _shared/asaas.ts (API v3; o prefixo da chave escolhe produção ou sandbox). criar-pedido: cliente no Asaas sem avisos, Pix na tela (/pixQrCode), parcelado (installmentCount 12) e mensal (subscriptions, maxPayments 12) com pagar_url para a página do Asaas. pagamento-webhook: token asaas-access-token, cobrança e assinatura buscadas na API, mesmas funções do banco. lembretes-pagamento lê o status no Asaas.
- Front: sai o Payment Brick, a tela de trocar cartão e o @mercadopago/sdk-js; cartão redireciona. Termos e privacidade citam o Asaas. E-mail de mensalidade recusada leva à cobrança no Asaas.
- Pendências: conta sandbox para testar ponta a ponta (parcelado, mensal com o cartão salvo para a 2ª cobrança, Pix, reembolso); conta de produção da cliente (documento e selfie dela) e o script ligar-asaas.sh com a chave de produção; tirar a aplicação e o webhook do Mercado Pago.

## 2026-10-16 · main · Sala do Meet criada sozinha e e-mail de contato

- Lives: ao salvar uma live sem link, o painel cria a sala no Google Meet pela conta Google da ORA (API do Meet, sala aberta para quem tem o link); live sem link ganha o botão Criar sala no Meet. Conectar a conta: botão Conectar Google Meet no topo de Lives (OAuth uma vez; refresh token em conexao_google, que só o servidor lê; google_conectado() mostra a conta para a profissional).
- Banco 20261029090000_lives_meet (lives.google_evento_id, conexao_google; suíte com 44 checagens). Edge Functions google-meet (conectar e sala, só papel admin) e google-retorno (volta do Google, estado assinado com 15 min). Secrets GOOGLE_CLIENT_ID e GOOGLE_CLIENT_SECRET.
- Termos e privacidade: contato@comunidadeora.com.br (ImprovMX encaminha para comunidadehora@gmail.com; MX e SPF no Registro.br) e WhatsApp de suporte.
- Pendências: assinar o Google Workspace (plano que grava), criar o cliente OAuth no Google Cloud, guardar as chaves e conectar; gravação ainda vai para o YouTube como Não listado e é colada na live.

## 2026-10-15 · main · Mercado Pago ligado em modo teste e compra testada

- Aplicação ORA Comunidade (7717358061804223) na conta da cliente (3715284424), Checkout Transparente com API de Payments; webhook nas abas teste e produção com Pagamentos e Planos e assinaturas. Secrets MP_ACCESS_TOKEN e MP_WEBHOOK_SECRET com as credenciais TEST- da conta da cliente; VITE_MP_PUBLIC_KEY na Vercel e no .env.local.
- Teste com o Payment Brick: só com as credenciais TEST- da conta real e e-mail comum (o Brick não aceita contas de teste para cartão e Pix). Pix gera QR; parcelado aprovado ponta a ponta (acesso criado e e-mail enviado); webhook processa.
- Checkout: parcelado de 1x a 12x (cliente escolhe; total igual), pedido guarda o motivo do erro do Mercado Pago em status_detalhe, trocar de plano tira o aviso de recusa. Webhook responde 200 para recurso que o Mercado Pago não acha (teste do painel).
- Commits saem com o e-mail 337824045+horasaude@users.noreply.github.com (config local): com o e-mail do computador a Vercel recusava o redeploy.
- Pendências: 12x recusado pela conta (10117 installments_removed_by_rule; até 10x passa), cliente vai liberar; parcelamento sem juros na conta; mensal (preapproval) falha no ambiente de teste do Mercado Pago em todas as combinações, validar em produção com cartão de uma das sócias e estorno; trocar para credenciais de produção.

## 2026-10-28 · main · Avisos aparecem para a aluna e menu sem repetição no computador

- Avisos (src/features/avisos): os publicados no painel nunca apareciam na área da aluna; agora o Início mostra no topo os dos últimos 30 dias que ela ainda não fechou (até 3), com Entendi guardado no aparelho.
- Pílulas de seção (Temas, Cardápios, Treinos; Desafio do mês, Ranking; Lives, Fórum, Loja) só no celular; no computador o menu lateral já leva a todas.

## 2026-10-27 · main · Lembrete de água no celular

- Banco (20261027090000_lembrete_agua, suíte com 40 checagens): push_inscricoes (cada aluna cuida das suas) e lembretes_de_agua() só para a service_role (quem tem acesso, ativou e ainda não bateu a meta, com quanto já bebeu); pg_cron lembrete-agua às 9h, 11h, 13h, 15h, 17h e 19h de Brasília.
- Edge Function lembrete-agua (npm:web-push, chaves VAPID nos secrets VAPID_PUBLICA, VAPID_PRIVADA e VAPID_ASSUNTO; inscrição vencida é apagada). Texto em _shared/agua.ts.
- Aluna: Lembrar de beber água no cartão Água de hoje (pede permissão e inscreve o aparelho; src/lib/push.ts); no iPhone só com o ORA instalado na tela de início. public/sw-push.js mostra a notificação e abre o app.
- Testado: função responde pelo pg_cron (0 envios sem inscrição). Falta testar a notificação num celular de verdade.

## 2026-10-26 · main · Pontos visíveis para a aluna, água em ml e indicação em destaque

- Banco: meus_pontos_do_dia() (20261026090000) lista cada regra ligada com pontos, limite e o que ela fez hoje; água em ml (20261026100000): configuracoes.agua_meta_ml (painel), agua_registros e registrar_agua(ml) que soma ou desfaz o copo e, ao bater a meta, marca Água e dá os pontos; fazer_checkin recusa água manual.
- Aluna: cartão Água de hoje (+250 ml, +500 ml, Desfazer, barra até a meta) dentro do quadro da semana; Hidratar-se marca sozinho. Desafios ganhou Seus pontos de hoje (tudo que dá ponto, quanto vale, feito ou não, Fazer) e o Indicar uma amiga; Início ganhou a chamada Indique uma amiga.
- Painel: Pontos e indicações > Regras ganhou Meta de água por dia (500 a 6.000 ml).
- Cardio e Tarefa continuam ligados no painel, mas saíram da lista da aluna (não têm mais onde marcar); vale desligar.

## 2026-10-25 · main · Pódio com troféu e coroinha

- Banco (20261025090000_podio_avatares): fotos de perfil num espaço próprio (avatares; quem tem acesso vê, só a dona envia), separadas das fotos de evolução, que continuam só da dona e da equipe; ranking_pontos devolve avatar_path. Suíte Engajamento com 75 checagens.
- Ranking: Pódio do mês e do ano (2º, 1º e 3º com foto, pontos e degraus ouro, prata e coral) e coroinha (src/components/ui/Coroa e Retrato). A aluna no pódio do mês ganha a coroinha na própria foto no Início e no Perfil.

## 2026-10-23 · main · Check-in da semana no formato da planilha da Laís

- Banco (20261023090000_checkin_semana): checkins aceitam sono, jejum, dieta e venci; regras de pontos novas (5 pontos, uma vez por dia, editáveis no painel). Suíte pontos com 83 checagens.
- Pontos da semana no topo do quadro (lancamentos dos hábitos desde a segunda). Ranking (20261024090000_ranking_ve_a_si): a profissional vê a própria linha e os próprios pontos; para as alunas ela continua fora.
- Início: o cartão virou "Semana NN" com a grade de segunda a domingo e os seis hábitos (Sono, Jejum intermitente, Hidratar-se, Dieta, Treino com foto, Venci o dia?), ícones desenhados no lugar dos da planilha; só o dia de hoje marca; legenda no celular.

## 2026-10-22 · main · Vídeo enviado no exercício

- Espaço treinos aceita MP4, WEBM e MOV até 30 MB (20261022090000_treinos_video). No painel, a mídia do exercício aceita imagem, GIF (5 MB) ou vídeo (30 MB), com prévia em vídeo; a aluna vê o vídeo em loop, sem som (src/domain/arquivos.ts: VIDEOS, ehVideo, extensaoDe).
- Vídeos do MFIT: o MFIT autorizou o uso (atendente, print guardado pela dona). O download pelo navegador foi bloqueado pela segurança do ambiente; o caminho é pedir os arquivos ao MFIT e subir no painel.

## 2026-10-21 · main · Exercícios combinados e treinos trazidos do MFIT

- Banco (20261021090000_exercicios_combinados): treino_exercicios.combinado (vizinhos com o mesmo número se alternam, A e B); regras em src/domain/combinados.ts. Painel: Combinar com o próximo e Tirar da combinação; aluna vê "Combinado A · alterne com ...".
- Importados da conta MFIT da Laís (só leitura, pela Visão do aluno) como rascunho, tema Preparação, local academia: rotinas numéricas Treino APAE (Adaptação, 3 treinos), Treino APAE Junho e Julho (Intermediário, 3) e Treino Maio (Iniciante, 2), 75 exercícios nos treinos, com séries, carga, intervalo e bi-sets.
- 47 exercícios novos na biblioteca (87 no total); 67 com GIF do ExerciseDB conferido um a um. Cardio novo (8 de 10) também com GIF. Vídeos do MFIT não foram copiados (são produção deles).

## 2026-10-20 · main · Aeróbico

- Banco (20261020090000_treinos_aerobico): treinos.categoria (musculacao ou aerobico; salvar_treino grava) e 10 modalidades de cardio na biblioteca (caminhada, corrida, esteira, bike, elíptico, escada, remo, pular corda, dança). Suíte treinos com 62 checagens.
- Painel: Tipo de treino (Musculação ou Aeróbico); no aeróbico os campos viram Blocos, Duração, Intensidade e Pausa entre blocos (contexto Rotulos), e Adicionar exercício já abre filtrado em Cardio. Etiqueta Aeróbico na lista.
- Aluna: Treinos com abas Musculação e Aeróbico (Outros treinos só de musculação); execução mostra "2 blocos de 15 min" e "Intensidade: Moderada".
- Formato montado sem ver o aeróbico do MFIT (vazio na aluna de teste); ajustar se a Laís usar de outro jeito.

## 2026-10-19 · main · Arquivos por aluna

- Banco (20261019090000_arquivos_aluna, suíte com 37 checagens): arquivos_aluna (caminho sempre na pasta da aluna) e espaço privado arquivos_aluna (PDF, Word e imagens até 20 MB). Equipe envia, abre e apaga; a aluna com acesso ativo só lê e baixa os dela.
- Painel: cartão da aluna em Alunas ganhou Arquivos da aluna (Enviar arquivo com progresso, abrir, remover com confirmação) e Anamnese.
- Aluna: Minha evolução mostra Arquivos da equipe com Baixar (link de 5 minutos); some quando não há arquivo.
- O envio real de arquivo não foi testado em produção (a demonstração não tem espaço de arquivos); conferir com um PDF de teste.

## 2026-10-18 · main · Anamnese (Avaliações)

- Banco (20261018090000_anamnese, suíte anamnese com 40 checagens): anamneses (perguntas em jsonb validadas por perguntas_validas: texto, sim ou não, escolha com 2 a 12 opções) e anamnese_respostas (só a dona e a equipe leem; a aluna edita até enviar; a equipe apaga para pedir de novo). Anamnese inicial semeada como rascunho, com 9 perguntas para a equipe revisar antes de publicar.
- Painel: Treinos > Anamnese (lista com perguntas e respondidas, janela com perguntas, tipo, opções, obrigatória e ordem); cartão da aluna em Alunas mostra as respostas e Pedir para responder de novo.
- Aluna (src/features/avaliacoes): /app/avaliacoes (Para responder e Respondidas) e uma pergunta por tela com barra de progresso; guarda a cada Avançar e envia na última. Aviso em Treinos e cartão em Minha conta enquanto houver anamnese sem enviar.

## 2026-10-17 · main · Treinos no jeito do MFIT (lado da profissional)

- Mapeado o MFIT da Laís (só leitura): fluxo de rotina, treino, exercício e visão do aluno. Sem API pública; ficou fora o faturamento (é do ORA) e a cópia de visual.
- Banco (20261017090000_treinos_rotina_series): nível Adaptação; rotina com tipo (dia da semana ou numérico), objetivo e orientações; rotina_treinos com ordem; treino com orientações; treino_exercicios com series_detalhe (validado por series_validas) e alternativo_id; exercicios_favoritos por profissional. Consultas usam exercicios!exercicio_id (o alternativo deixou a ligação ambígua). Suíte treinos com 56 checagens.
- Painel: série por série (Adicionar série, Replicar séries), Trocar exercício, Exercício alternativo, adicionar vários exercícios de uma vez com Favoritos, rotina numérica com Treino 1, 2, 3 e setas de ordem, objetivo e orientações.
- Aluna: rotina numérica mostra o próximo treino depois do último feito e a lista na ordem; orientações da rotina e do treino; execução série por série com o descanso de cada uma; trocar pelo alternativo.
- Demonstração: rotina numérica, orientações, série por série e alternativo no Treino A.
- Falta ver no MFIT: execução do treino no app da aluna (a aluna de teste não tem rotina), aba Aeróbico, Avaliações (anamnese) e arquivos por aluna.

## 2026-10-16 · main · GIFs nos exercícios

- 27 dos 30 exercícios ganharam GIF animado da biblioteca usada no Bora Treinar (ExerciseDB), copiado para o espaço treinos (exercicios/<id>.gif); conferidos um a um. Sem GIF fiel: Coice de glúteo em quatro apoios, Prancha frontal e Abdominal remador (precisam de vídeo ou imagem da equipe).
- Espaço treinos aceita image/gif (20261016090000_treinos_gif); no painel, a imagem do exercício aceita GIF até 5 MB (validarArquivo uso 'exercicio'); capa da live e materiais continuam sem GIF.
- Aluna: GIF aparece inteiro (quadrado, fundo branco, até 300 px) em vez de cortado em 16:9. Vídeo do exercício continua na frente da imagem.
- GIFs da ExerciseDB vêm em 180 px no plano atual; uso comercial depende do plano contratado (conferir termos).

## 2026-10-15 · main · Módulo de Treinos (painel e aluna)

- Banco (20261015090000_treinos, suíte treinos no PGlite): exercicios (30 básicos sem vídeo para a Laís completar), treinos, treino_exercicios, rotinas, rotina_treinos, treinos_feitos, nível e local na conta. Aluna lê só o publicado do tema dela (Preparação antes do tema); exercícios e fotos só com acesso ativo; treinos_feitos só os dela.
- Painel (src/features/admin/treinos): item Treinos com bolinha coral abaixo de Plano alimentar; pílulas Treinos | Exercícios | Modelos | Publicados; KPIs (publicados, exercícios, concluídos em 7 dias). Montar treino em janela de 760 px: aquecimento e alongamento opcionais, exercícios da biblioteca com séries, repetições ou tempo, carga, descanso e observação; arrastar, duplicar, remover; Salvar rascunho, Publicar e Duplicar treino. Modelos: rotina semanal com o treino de cada dia.
- Aluna (src/features/treinos): menu e pílula Treinos; primeiro acesso com nível e local; Treino de hoje pela rotina; a semana com check; Outros treinos; execução com séries, cronômetro de descanso e bipe opcional; Treino concluído com Registrar com foto (mesmo check-in de Treino, sem pontos em dobro). Minha conta troca nível e local; Minha evolução ganha o calendário Treinos feitos. Ver como aluna tem Ver Treinos, sem gravar.
- Demonstração: treinos, rotina e treinos feitos no seed; API da demo entende contagem, apelido, ordem em relação e upsert. Prints 16 a 20.

## 2026-10-13 · main · Menu lateral da aluna, criação de conteúdo no painel e aula concluída pelo vídeo

- Menu lateral da aluna no computador igual ao do painel: lista simples (Início, Trilhas, Cardápios, Desafios, Ranking, Lives, Fórum, Loja, Minha evolução, Minha conta), mesmo ItemMenuLateral com bolinha de cor (src/components/ui/MenuLateral.tsx), ativo em vidro verde, ponto da live em Lives. Celular e pílulas sem mudança.
- Conteúdo: "+ Nova aula" (vidro verde) no topo, ao lado de Ver como aluna; janela de 760 px começa por Onde fica a aula (tema e etapa; etapa some na Preparação); rodapé Salvar rascunho e Publicar. "+ Novo tema" e "+ Nova etapa" com nome, frase, cor e ordem (temas.cor e etapas.cor; a cor do tema chega à aluna).
- Descrição da aula em editor simples (negrito, itálico, lista, link, quebra de linha), HTML limpo (src/lib/html.ts); texto antigo continua aparecendo com as quebras.
- Arquivos da aula aceitam Word (.doc e .docx, até 20 MB): ícone azul e Baixar para a aluna; PDF terracota; foto em miniatura que amplia. Link assinado e só de aula liberada, como antes.
- Aula com vídeo do YouTube conclui sozinha com 90% realmente assistidos (pular não conta), pela API de iframe; progresso em aulas_progresso para retomar; +10 pontos uma vez só pela regra do banco. Sem vídeo, Drive ou Vimeo: botão Concluir aula. Pré-visualização não grava.
- Migração 20261014090000_painel_aulas_progresso; suíte de banco aula_assistida; prints em docs/prints/parte2 (14-painel-nova-aula, 15-aluna-menu-lateral-lives).

## 2026-10-07 · main · Pagamento pelo Mercado Pago de ponta a ponta (modo de teste)

- Banco (20261013090000_pagamentos): pedidos (id = external_reference), eventos_pagamento (uma linha por notificação, única por tipo, recurso e status), assinaturas (parcelas pagas de 12, inadimplência); só admin lê. Funções só da service_role: aprovar_pedido (12 meses, 13 com a oferta; histórico em acessos_liberados; indicação registrada), encerrar_pedido (reembolso, cancelamento e chargeback encerram na hora e cancelam a indicação), cobranca_assinatura, cancelar_assinatura (até 7 dias é arrependimento), suspender_inadimplentes (cron de hora em hora; tem_acesso_ativo agora olha perfis.acesso_suspenso_em).
- Edge Functions: criar-pedido (preço no servidor pela tabela configuracoes; Pix com 30 min, cartão 12x, assinatura mensal com /preapproval; X-Idempotency-Key = id do pedido), pagamento-webhook (x-signature como no SDK oficial; busca na API; nunca confia no corpo), lembretes-pagamento (Pix não pago em 15 min, cron de 5 em 5 min). E-mails pelo Resend em _shared/email.
- Checkout: Payment Brick em #pagamento-mp (só Pix no à vista, só cartão nos outros), botão vidro verde nosso, Pix com QR, copia e cola, contagem e consulta a cada 5 s; recusa em português pelo motivo. /obrigada mostra a situação real; /checkout/cartao troca o cartão da assinatura.
- Endpoints e campos conferidos no SDK oficial (mercadopago 3.6.1 e sdk-react 1.0.7), porque as páginas da documentação não abriam fora do navegador.
- Pendente: chaves de teste nos secrets; URL do webhook no painel do MP; teste real com cartões de teste; Pixel da Meta não existe no projeto.

## 2026-10-07 · main · Conteúdo das aulas do painel até a aluna

- Diagnóstico da Trilha vazia: o banco real não tinha nenhuma aula (temas e etapas existiam e estavam publicados) e a conta admin.teste não tinha acesso; criar aula pelo painel funciona (testado pela tela na demonstração).
- Painel: etiqueta por aula (Visível para alunas, ou Não aparece: aula, etapa ou tema em rascunho); publicar aula de etapa ou tema em rascunho pergunta "Publicar tudo" ou "Só a aula". "Ver como aluna" em Conteúdo (/app/previa): trilha_previa com dia de 1 a 365 e tema, faixa ocre de Pré-visualização, só admin e sem gravar nada. "Liberar acesso" na ficha da aluna (liberar_acesso, 12 meses, registra quem e quando em acessos_liberados).
- Vídeo do YouTube como primeiro campo com ajuda e prévia grande (aula, Comece por aqui, gravação da live). Materiais da aula: arrastar e soltar (PDF, JPG, PNG, WEBP, até 20 MB), nome editável, progresso, ordem e remover; espaço privado materiais e tabela aula_materiais; material_url migrado como link. Aluna baixa pela Edge Function materiais-aula (link assinado de 10 minutos, só de aula liberada). Capa da gravação por envio de imagem (até 5 MB, em materiais/capas).
- Nome do app ORA no manifest, título, login, primeiro acesso, mensagens e agenda. Migração 20261012090000_materiais_previa_acesso.
- Pendente: cadastrar as aulas reais no painel; textos da página de vendas e dos termos ainda dizem ORA (decidir com as clientes).

## 2026-10-07 · main · Ajustes da área da aluna (logo ORA, live, gravações, cardápios, aula)

- Logo do ORA em todo o sistema (LogoOra aponta para logo-ora.svg e logo-ora-clara.svg), impressão do cardápio e ícones do app (icone.svg, icone-192, icone-512, apple-touch-icon).
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

## 2026-10-06 · main · Logo da ORA no sistema

- LogoOra (src/components/ui): SVG de public/ com a proporção travada. Painel: logo clara (140 px) no topo do menu verde e na barra do celular. Área da aluna: barra no topo com a logo verde à esquerda, no computador e no celular. Entrar: logo verde centralizada no lugar da do ORA. Vendas, checkout, ícone e favicon sem mudança.
- Pendente: logo-ora-clara.svg veio verde igual à escura; por ora um filtro deixa a imagem branca no fundo verde. Com o arquivo claro de verdade, tirar o filtro em LogoOra.

## 2026-10-06 · main · Fonte Arial no sistema

- Painel e área da aluna (tudo em /app) em Arial: classe font-sistema na raiz de /app (src/app/AreaAluna.tsx), 16 px e entrelinha relaxada; títulos em Arial negrito verde ORA, um pouco maiores; números do resumo em Arial negrito grande. Sem Playfair no sistema. Página de vendas, checkout e login sem mudança. Regra no CLAUDE.md.

## 2026-10-06 · main · Área da aluna para computador

- Todo o sistema é feito para computador e responsivo para celular (regra no CLAUDE.md). Área da aluna: no computador, barra lateral verde no padrão do painel (ORA em ocre, 5 itens com ícone, logada como) e conteúdo na largura da tela; no celular, barra fixa embaixo com 5 ícones.
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

- Painel refeito sobre docs/referencias/painel-apresentado.png: barra lateral verde fixa (ORA em ocre, itens com bolinha colorida, item ativo com fundo claro, "Logada como" com o nome da perfis), fundo areia, título em Playfair, cartões de resumo (sálvia, ocre, terracota), tabela branca com cabeçalho em caixa alta pequena e etiquetas Publicado (verde) e Rascunho (ocre).
- Clicar numa linha abre o item num cartão branco à direita, sem sair da tela: tema (publicar, editar, etapas e aulas), aula (formulário com prévia do vídeo), live e aviso (dados, publicar e formulário). Lista vazia: mensagem curta e botão de criar no centro. No celular a barra vira menu aberto por botão.
- Resumos: temas publicados, aulas publicadas e em rascunho; próxima live e lives agendadas; avisos ativos.
- Rotas de detalhe apontam para a página da lista. Nada mudou no banco. useNome novo na feature auth.
- Prints feitos com build local apontando para um servidor falso com dados de exemplo (produção está vazia e nada foi gravado lá).

## 2026-10-06 · main · Painel admin

- /app/admin só para papel admin (usePapel na feature auth; quem não é admin volta para /app). Mobile primeiro, abas fixas embaixo: Conteúdo, Lives, Avisos.
- Conteúdo: temas, etapas e aulas com criar, editar, publicar/tirar do ar e reordenar (botões subir/descer). Aula: prévia do vídeo ao colar o link (src/lib/video.ts: YouTube, Vimeo, Google Drive), material e liberação "Liberada na compra" (dia 1), "Depois de 7 dias" (dia 8) ou outro dia.
- Lives e avisos com datas no horário de Brasília (paraCampoBrasilia/deCampoBrasilia em src/lib/datas.ts).
- Migração 20261006180000_ordem_conteudo (aplicada): mover_tema/etapa/aula só para admin; unique de etapas adiável. 16 checagens novas no PGlite.
- Conta admin de teste criada no banco (admin.teste@exemplo.com); senha só no arquivo local ~/ORA-admin-teste.txt, fora do repositório. Login, papel e RLS conferidos por API.
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
- Botão "Quero entrar na ORA" no fim de cada seção levando a #preco (Secao, exceto a de planos: semBotao).

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
- Checkout: logo ORA no resumo (no lugar da foto) e banner do programa (creme, "A" de marca d'água, Comunidade ORA, oferta + 1 mês grátis).

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

- Login mostra a logo ORA (public/logo-ora.png, fundo transparente) e o título "Chegou a sua ORA de começar", com e-mail e senha embaixo.
- Arquivos: src/features/auth/pages/LoginPage.tsx, src/features/auth/textos.ts, public/logo-ora.png.
- Pendente: logo em SVG ou maior resolução; confirmar se existe logo própria da ORA.

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
