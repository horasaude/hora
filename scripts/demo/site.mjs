// Site estático do build de demonstração, com /__entrar para entrar como uma conta de teste.
import { existsSync, readFileSync, statSync } from 'node:fs'
import { extname, join } from 'node:path'

const TIPOS = {
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.html': 'text/html',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.webmanifest': 'application/manifest+json',
}

function sessao(aluna) {
  return {
    access_token: `demo:${aluna.id}`,
    token_type: 'bearer',
    expires_in: 999999,
    expires_at: Math.floor(Date.now() / 1000) + 999999,
    refresh_token: 'demo',
    user: { id: aluna.id, aud: 'authenticated', role: 'authenticated', email: aluna.email },
  }
}

/** App estático; /__entrar?aluna=40&ir=/app entra como a aluna de demonstração. */
export function criarSite(DIST, ALUNAS) {
  return (req, res) => app(req, res, DIST, ALUNAS)
}

function app(req, res, DIST, ALUNAS) {
  const url = new URL(req.url, 'http://x')
  if (url.pathname === '/__entrar') {
    const aluna = ALUNAS[url.searchParams.get('aluna') ?? '40'] ?? ALUNAS[40]
    res.writeHead(200, { 'content-type': 'text/html' })
    return res.end(
      `<script>localStorage.clear();localStorage.setItem('sb-127-auth-token', ${JSON.stringify(JSON.stringify(sessao(aluna)))});location.replace(${JSON.stringify(url.searchParams.get('ir') ?? '/app')})</script>`,
    )
  }
  if (url.pathname === '/sw.js') return res.writeHead(404).end()
  let arquivo = join(DIST, url.pathname)
  if (!arquivo.startsWith(DIST) || !existsSync(arquivo) || statSync(arquivo).isDirectory())
    arquivo = join(DIST, 'index.html')
  res.writeHead(200, { 'content-type': TIPOS[extname(arquivo)] ?? 'application/octet-stream' })
  res.end(readFileSync(arquivo))
}
