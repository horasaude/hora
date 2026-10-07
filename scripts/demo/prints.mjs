// Prints da Parte 2 com os dados de demonstração: computador (1440 px) e celular (390 px).
// Uso: npm run demo:prints   (salva em docs/prints/parte2; fora do public, não entra no build)
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { abrirChrome, espera } from './chrome.mjs'
import { iniciarDemo, PORTA_APP } from './servidor.mjs'

const SAIDA = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'docs', 'prints', 'parte2')
mkdirSync(SAIDA, { recursive: true })

const { db, fechar } = await iniciarDemo()
const um = async (sql) => (await db.query(sql)).rows[0]?.id
const aula =
  await um(`select a.id from aulas a join etapas e on e.id = a.etapa_id join temas t on t.id = e.tema_id
  where t.chave = 'emagrecimento' and e.chave = 'arrancada' order by a.dia_liberacao limit 1`)
const cardapio = await um(`select id from cardapios where objetivo = 'Emagrecimento'`)

const TELAS = [
  ['01-inicio', 40, '/app'],
  ['02-trilhas-temas', 40, '/app/trilha'],
  ['03-aula', 40, `/app/trilha/aula/${aula}`],
  ['04-trilhas-cardapios', 40, '/app/cardapios'],
  ['05-lista-de-compras', 40, `/app/cardapios/${cardapio}/compras`],
  ['06-desafios-ranking', 40, '/app/ranking'],
  ['07-comunidade-lives', 40, '/app/lives'],
  ['08-perfil-minha-evolucao', 40, '/app/perfil'],
  ['09-dia3-trilhas-temas', 3, '/app/trilha'],
  ['10-dia3-cardapio-preparacao', 3, '/app/cardapios'],
]
const TAMANHOS = [
  ['computador', 1440, 900, false],
  ['celular', 390, 844, true],
]

const chrome = await abrirChrome()
try {
  for (const [nomeTam, largura, altura, celular] of TAMANHOS) {
    const tela = (h) =>
      chrome.cdp('Emulation.setDeviceMetricsOverride', {
        width: largura,
        height: h,
        deviceScaleFactor: celular ? 2 : 1,
        mobile: celular,
      })
    for (const [nome, aluna, caminho] of TELAS) {
      await tela(altura)
      await chrome.cdp('Page.navigate', {
        url: `http://127.0.0.1:${PORTA_APP}/__entrar?aluna=${aluna}&ir=${encodeURIComponent(caminho)}`,
      })
      await espera(3500)
      const { cssContentSize } = await chrome.cdp('Page.getLayoutMetrics')
      await tela(Math.max(altura, Math.ceil(cssContentSize.height)))
      await espera(700)
      const { data } = await chrome.cdp('Page.captureScreenshot', { format: 'png' })
      writeFileSync(join(SAIDA, `${nomeTam}-${nome}.png`), Buffer.from(data, 'base64'))
      console.log(`print ${nomeTam}-${nome}`)
    }
  }
} finally {
  chrome.fechar()
  fechar()
}
