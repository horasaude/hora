// Chrome sem janela controlado pelo protocolo do DevTools (WebSocket nativo do Node), para os prints.
import { spawn } from 'node:child_process'
import { mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const CHROME = process.env.CHROME ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const PORTA = 9333
export const espera = (ms) => new Promise((ok) => setTimeout(ok, ms))

async function enderecoDaPagina() {
  for (let i = 0; i < 50; i++) {
    try {
      const alvos = await (await fetch(`http://127.0.0.1:${PORTA}/json`)).json()
      const pagina = alvos.find((a) => a.type === 'page')
      if (pagina) return pagina.webSocketDebuggerUrl
    } catch {
      // ainda abrindo
    }
    await espera(200)
  }
  throw new Error('o Chrome não abriu')
}

/** Abre o Chrome e devolve { cdp, avaliar, fechar }. */
export async function abrirChrome() {
  const perfil = mkdtempSync(join(tmpdir(), 'ora-demo-chrome-'))
  const processo = spawn(
    CHROME,
    [
      '--headless=new',
      `--remote-debugging-port=${PORTA}`,
      `--user-data-dir=${perfil}`,
      '--hide-scrollbars',
      'about:blank',
    ],
    { stdio: 'ignore' },
  )
  const ws = new WebSocket(await enderecoDaPagina())
  await new Promise((ok) => ws.addEventListener('open', ok))
  let n = 0
  const pendentes = new Map()
  ws.addEventListener('message', (e) => {
    const m = JSON.parse(e.data)
    pendentes.get(m.id)?.(m)
  })
  const cdp = (method, params = {}) =>
    new Promise((ok, falha) => {
      const id = ++n
      pendentes.set(id, (m) =>
        m.error ? falha(new Error(`${method}: ${m.error.message}`)) : ok(m.result),
      )
      ws.send(JSON.stringify({ id, method, params }))
    })
  const avaliar = async (expressao) =>
    (
      await cdp('Runtime.evaluate', {
        expression: expressao,
        awaitPromise: true,
        returnByValue: true,
      })
    ).result?.value
  await cdp('Page.enable')
  await cdp('Runtime.enable')
  return {
    cdp,
    avaliar,
    fechar: () => {
      ws.close()
      processo.kill()
    },
  }
}
