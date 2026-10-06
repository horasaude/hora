// Apaga as fotos de check-in com mais de 90 dias (o arquivo no Storage e o caminho no banco).
// Os pontos ficam: o check-in continua, só sem a foto. Chamada uma vez por dia pelo pg_cron,
// com o cabeçalho x-cron-segredo igual ao segredo CRON_SEGREDO das Edge Functions.
import { createClient } from '@supabase/supabase-js'

const DIAS = 90
const LOTE = 500

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  { auth: { persistSession: false, autoRefreshToken: false } },
)

function responder(corpo: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(corpo), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

Deno.serve(async (req) => {
  const segredo = Deno.env.get('CRON_SEGREDO') ?? ''
  if (req.method !== 'POST' || !segredo || req.headers.get('x-cron-segredo') !== segredo) {
    return responder({ ok: false }, 401)
  }
  const limite = new Date(Date.now() - DIAS * 86_400_000).toISOString()
  const { data, error } = await supabase
    .from('checkins')
    .select('id, foto_path')
    .not('foto_path', 'is', null)
    .lt('created_at', limite)
    .limit(LOTE)
  if (error) return responder({ ok: false }, 500)
  const linhas = (data ?? []) as { id: string; foto_path: string }[]
  if (linhas.length === 0) return responder({ ok: true, apagadas: 0 })
  const removidas = await supabase.storage.from('checkins').remove(linhas.map((l) => l.foto_path))
  if (removidas.error) return responder({ ok: false }, 500)
  const marcadas = await supabase.rpc('marcar_fotos_apagadas', { p_ids: linhas.map((l) => l.id) })
  if (marcadas.error) return responder({ ok: false }, 500)
  return responder({ ok: true, apagadas: linhas.length })
})
