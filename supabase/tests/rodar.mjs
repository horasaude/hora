// npm run db:test: roda cada suíte num banco próprio e falha se qualquer uma falhar.
import { testarConteudo } from './conteudo.test.mjs'
import { testarInteressadas } from './interessadas.test.mjs'
import { testarPerfis } from './perfis.test.mjs'

const suites = [testarPerfis, testarInteressadas, testarConteudo]
let falhas = 0
for (const suite of suites) falhas += await suite()
process.exit(falhas ? 1 : 0)
