// Sala do Meet da live: cria (restrita) se ainda não existe e põe equipe e convidadas como membros.
import { acessoPor, adicionarMembro, ajustarSala, criarSala } from '../_shared/google.ts'
import { servico } from '../_shared/servico.ts'

type Destino = { email: string; papel: string }

async function salaDaLive(live: string, acesso: string) {
  const { data: s } = await servico
    .from('lives_salas')
    .select('link_url, google_sala')
    .eq('live_id', live)
    .maybeSingle<{ link_url: string | null; google_sala: string | null }>()
  if (s?.link_url && s.google_sala) {
    await ajustarSala(acesso, s.google_sala)
    return { link: s.link_url, sala: s.google_sala }
  }
  const nova = await criarSala(acesso)
  const { error } = await servico
    .from('lives_salas')
    .upsert({ live_id: live, link_url: nova.meetingUri, google_sala: nova.name })
  if (error) throw new Error(error.message)
  return { link: nova.meetingUri, sala: nova.name }
}

/** Garante a sala e os membros (equipe como coanfitriã). Devolve o link ou o erro da função. */
export async function prepararSala(live: string): Promise<[Record<string, unknown>, number]> {
  const { data: l } = await servico.from('lives').select('id').eq('id', live).maybeSingle()
  if (!l) return [{ ok: false, erro: 'sem_live' }, 404]
  const { data: c } = await servico
    .from('conexao_google')
    .select('refresh_token')
    .maybeSingle<{ refresh_token: string }>()
  if (!c) return [{ ok: false, erro: 'sem_conexao' }, 409]
  const acesso = await acessoPor(c.refresh_token)
  const { link, sala } = await salaDaLive(live, acesso)
  const { data: destinos, error } = await servico.rpc('destinos_da_live', { p_live: live })
  if (error) throw new Error(error.message)
  for (const d of (destinos ?? []) as Destino[]) {
    if (d.papel === 'aluna') continue
    await adicionarMembro(acesso, sala, d.email, d.papel === 'equipe')
  }
  return [{ ok: true, link }, 200]
}
