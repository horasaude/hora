// Volta do Google depois que a profissional autoriza a conta da ORA: guarda o refresh token
// e devolve para as Lives do painel com ?google=ok ou ?google=erro.
import { trocarCodigo, validarEstado } from '../_shared/google.ts'
import { servico, SITE } from '../_shared/servico.ts'
import { prepararSala } from '../google-meet/sala.ts'

/** Motivo da falha (sem código nem token): vai para o log e para o endereço de volta. */
let motivo = ''
const falhou = (m: string) => ((motivo = m), console.error('google-retorno:', m), false)

const voltar = (resultado: 'ok' | 'erro') =>
  Response.redirect(
    `${SITE}/app/admin/lives?google=${resultado}${motivo ? `&motivo=${encodeURIComponent(motivo)}` : ''}`,
    302,
  )

async function conectar(url: URL): Promise<boolean> {
  const codigo = url.searchParams.get('code')
  const negado = url.searchParams.get('error')
  if (negado) return falhou(`google recusou: ${negado}`)
  const perfil = await validarEstado(
    url.searchParams.get('state') ?? '',
    Deno.env.get('GOOGLE_CLIENT_SECRET') ?? '',
  )
  if (!codigo) return falhou('sem código')
  if (!perfil) return falhou('estado inválido ou vencido (mais de 15 minutos)')
  const { data: p } = await servico
    .from('perfis')
    .select('papel')
    .eq('id', perfil)
    .single<{ papel: string }>()
  if (p?.papel !== 'admin') return falhou('perfil não é admin')
  const { refresh, conta } = await trocarCodigo(codigo)
  if (!refresh) return falhou('google não mandou refresh token')
  const { error } = await servico
    .from('conexao_google')
    .upsert({ id: 1, conta, refresh_token: refresh, conectado_em: new Date().toISOString() })
  if (error) return falhou(`banco: ${error.message}`)
  await salasNovas()
  return true
}

/** Depois de conectar (ou trocar de conta), as lives que ainda vão acontecer ganham sala na conta nova, gravando. */
async function salasNovas() {
  const { data } = await servico
    .from('lives')
    .select('id')
    .eq('publicado', true)
    .gt('data', new Date().toISOString())
  for (const l of data ?? []) {
    try {
      await prepararSala(l.id)
    } catch (e) {
      console.error('google-retorno sala', l.id, e instanceof Error ? e.message : e)
    }
  }
}

Deno.serve(async (req) => {
  if (req.method !== 'GET') return new Response(null, { status: 405 })
  motivo = ''
  try {
    return voltar((await conectar(new URL(req.url))) ? 'ok' : 'erro')
  } catch (e) {
    falhou(e instanceof Error ? e.message : String(e))
    return voltar('erro')
  }
})
