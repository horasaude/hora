// npm run db:test: roda cada suíte num banco próprio e falha se qualquer uma falhar.
import { testarConteudo } from './conteudo.test.mjs'
import { testarOrdem } from './ordem.test.mjs'
import { testarInteressadas } from './interessadas.test.mjs'
import { testarPerfis } from './perfis.test.mjs'
import { testarTrilha } from './trilha.test.mjs'
import { testarPainel } from './painel.test.mjs'
import { testarPlano } from './plano.test.mjs'
import { testarPontos } from './pontos.test.mjs'
import { testarForum } from './forum.test.mjs'
import { testarEquipe } from './equipe.test.mjs'
import { testarLoja } from './loja.test.mjs'
import { testarEngajamento } from './engajamento.test.mjs'
import { testarCardapiosLives } from './cardapios_lives.test.mjs'
import { testarMateriais } from './materiais.test.mjs'
import { testarPagamentos } from './pagamentos.test.mjs'
import { testarAssinaturas } from './assinaturas.test.mjs'
import { testarAulaAssistida } from './aula_assistida.test.mjs'
import { testarTreinos } from './treinos.test.mjs'
import { testarPublicarTipo } from './publicar_tipo.test.mjs'
import { testarAnamnese } from './anamnese.test.mjs'
import { testarArquivosAluna } from './arquivos_aluna.test.mjs'
import { testarLembreteAgua } from './lembrete_agua.test.mjs'
import { testarConexaoGoogle } from './conexao_google.test.mjs'
import { testarLinkAcesso } from './link_acesso.test.mjs'
import { testarCancelamento } from './cancelamento.test.mjs'
import { testarLivesSala } from './lives_sala.test.mjs'
import { testarLiberacao } from './liberacao.test.mjs'
import { testarMateriaisNutricao } from './materiais_nutricao.test.mjs'
import { testarPendencias } from './pendencias.test.mjs'
import { testarCardapioPdf } from './cardapio_pdf.test.mjs'
import { testarGravacaoLive } from './gravacao_live.test.mjs'
import { testarReguaCobranca } from './regua_cobranca.test.mjs'

const suites = [
  testarPerfis,
  testarInteressadas,
  testarConteudo,
  testarOrdem,
  testarTrilha,
  testarPainel,
  testarPlano,
  testarPontos,
  testarForum,
  testarEquipe,
  testarLoja,
  testarEngajamento,
  testarCardapiosLives,
  testarCardapioPdf,
  testarLivesSala,
  testarGravacaoLive,
  testarMateriais,
  testarLiberacao,
  testarMateriaisNutricao,
  testarPendencias,
  testarPagamentos,
  testarCancelamento,
  testarAssinaturas,
  testarReguaCobranca,
  testarAulaAssistida,
  testarTreinos,
  testarPublicarTipo,
  testarAnamnese,
  testarArquivosAluna,
  testarLembreteAgua,
  testarConexaoGoogle,
  testarLinkAcesso,
]
let falhas = 0
for (const suite of suites) falhas += await suite()
process.exit(falhas ? 1 : 0)
