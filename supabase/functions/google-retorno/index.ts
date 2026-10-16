// Volta do Google depois que a profissional autoriza a conta da ORA: guarda o refresh token
// e devolve para as Lives do painel com ?google=ok ou ?google=erro.
import { trocarCodigo, validarEstado } from '../_shared/google.ts'
import { servico, SITE } from '../_shared/servico.ts'

const voltar = (resultado: 'ok' | 'erro') =>
  Response.redirect(`${SITE}/app/admin/lives?google=${resultado}`, 302)

async function conectar(url: URL): Promise<boolean> {
  const codigo = url.searchParams.get('code')
  const perfil = await validarEstado(
    url.searchParams.get('state') ?? '',
    Deno.env.get('GOOGLE_CLIENT_SECRET') ?? '',
  )
  if (!codigo || !perfil) return false
  const { data: p } = await servico
    .from('perfis')
    .select('papel')
    .eq('id', perfil)
    .single<{ papel: string }>()
  if (p?.papel !== 'admin') return false
  const { refresh, conta } = await trocarCodigo(codigo)
  if (!refresh) return false
  const { error } = await servico
    .from('conexao_google')
    .upsert({ id: 1, conta, refresh_token: refresh, conectado_em: new Date().toISOString() })
  return !error
}

Deno.serve(async (req) => {
  if (req.method !== 'GET') return new Response(null, { status: 405 })
  try {
    return voltar((await conectar(new URL(req.url))) ? 'ok' : 'erro')
  } catch (e) {
    console.error('google-retorno', e instanceof Error ? e.message : e)
    return voltar('erro')
  }
})
