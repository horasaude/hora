// Tratamento da notificação, sem Deno nem banco, para testar no Vitest.
import { assinaturaValida } from '../_shared/pagamento/assinatura.ts'

type Corpo = { type?: string; topic?: string; data?: { id?: string | number } }

export type Processar = (tipo: string, id: string) => Promise<string>

const resposta = (corpo: unknown, status = 200) =>
  new Response(JSON.stringify(corpo), { status, headers: { 'Content-Type': 'application/json' } })

/** Sem assinatura válida: 401 e nada mais. Com ela, processa pelo tipo e pelo id da notificação. */
export async function tratar(
  req: Request,
  segredo: string,
  processar: Processar,
): Promise<Response> {
  if (req.method !== 'POST') return resposta({ ok: false }, 405)
  const url = new URL(req.url)
  const corpo = ((await req.json().catch(() => null)) ?? {}) as Corpo
  const dataId =
    url.searchParams.get('data.id') ?? (corpo.data?.id != null ? String(corpo.data.id) : null)
  const valida = await assinaturaValida({
    xSignature: req.headers.get('x-signature'),
    xRequestId: req.headers.get('x-request-id'),
    dataId,
    segredo,
  })
  if (!valida) return resposta({ ok: false }, 401)
  const tipo = corpo.type ?? url.searchParams.get('type') ?? corpo.topic ?? ''
  if (!dataId || !/^[A-Za-z0-9-]{1,80}$/.test(dataId)) return resposta({ ok: true, ignorado: true })
  try {
    return resposta({ ok: true, resultado: await processar(tipo, dataId) })
  } catch (e) {
    console.error('pagamento-webhook', tipo, dataId, e instanceof Error ? e.message : e)
    return resposta({ ok: false }, 500)
  }
}
