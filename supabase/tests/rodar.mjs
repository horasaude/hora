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
]
let falhas = 0
for (const suite of suites) falhas += await suite()
process.exit(falhas ? 1 : 0)
