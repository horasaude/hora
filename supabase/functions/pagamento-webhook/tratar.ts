// Tratamento da notificação, sem Deno nem banco, para testar no Vitest.

type Corpo = { event?: string; payment?: { id?: unknown }; subscription?: { id?: unknown } }

/** O que a notificação aponta: só o evento e o id; o resto sempre vem da API do Asaas. */
export type Aviso = { evento: string; tipo: 'cobranca' | 'assinatura'; id: string }

export type Processar = (aviso: Aviso) => Promise<string>

const resposta = (corpo: unknown, status = 200) =>
  new Response(JSON.stringify(corpo), { status, headers: { 'Content-Type': 'application/json' } })

/** Comparação em tempo constante do token do cabeçalho asaas-access-token. */
export function tokenValido(recebido: string | null, esperado: string): boolean {
  if (!recebido || esperado.length < 32 || recebido.length !== esperado.length) return false
  let dif = 0
  for (let i = 0; i < esperado.length; i++) dif |= recebido.charCodeAt(i) ^ esperado.charCodeAt(i)
  return dif === 0
}

const ID = /^[A-Za-z0-9_-]{1,80}$/

function lerAviso(c: Corpo): Aviso | null {
  const evento = typeof c.event === 'string' ? c.event : ''
  const cobranca = String(c.payment?.id ?? '')
  const assinatura = String(c.subscription?.id ?? '')
  if (ID.test(cobranca)) return { evento, tipo: 'cobranca', id: cobranca }
  if (ID.test(assinatura)) return { evento, tipo: 'assinatura', id: assinatura }
  return null
}

/** Sem o token certo: 401 e nada mais. Com ele, processa pelo id; o que não serve responde 200. */
export async function tratar(req: Request, token: string, processar: Processar): Promise<Response> {
  if (req.method !== 'POST') return resposta({ ok: false }, 405)
  if (!tokenValido(req.headers.get('asaas-access-token'), token))
    return resposta({ ok: false }, 401)
  const aviso = lerAviso(((await req.json().catch(() => null)) ?? {}) as Corpo)
  if (!aviso) return resposta({ ok: true, ignorado: true })
  try {
    return resposta({ ok: true, resultado: await processar(aviso) })
  } catch (e) {
    console.error('pagamento-webhook', aviso.evento, aviso.id, e instanceof Error ? e.message : e)
    return resposta({ ok: false }, 500)
  }
}
