// Sala do Meet da live: cria (restrita) se ainda não existe e põe equipe e convidadas como membros.
import { acessoPor } from '../_shared/google.ts'
import { adicionarMembro, ajustarSala, criarSala } from '../_shared/meet.ts'
import { servico } from '../_shared/servico.ts'

type Destino = { email: string; papel: string }

/** Sala da live na conta conectada; sala de outra conta (antes de reconectar) é trocada por uma nova. */
async function salaDaLive(live: string, acesso: string, conta: string) {
  const { data: s } = await servico
    .from('lives_salas')
    .select('link_url, google_sala, conta')
    .eq('live_id', live)
    .maybeSingle<{ link_url: string | null; google_sala: string | null; conta: string | null }>()
  if (s?.link_url && s.google_sala && s.conta === conta) {
    await ajustarSala(acesso, s.google_sala)
    return { link: s.link_url, sala: s.google_sala }
  }
  const nova = await criarSala(acesso)
  const { error } = await servico
    .from('lives_salas')
    .upsert({ live_id: live, link_url: nova.meetingUri, google_sala: nova.name, conta })
  if (error) throw new Error(error.message)
  return { link: nova.meetingUri, sala: nova.name }
}

/** Garante a sala e os membros (equipe como coanfitriã). Devolve o link ou o erro da função. */
export async function prepararSala(live: string): Promise<[Record<string, unknown>, number]> {
  const { data: l } = await servico.from('lives').select('id').eq('id', live).maybeSingle()
  if (!l) return [{ ok: false, erro: 'sem_live' }, 404]
  const { data: c } = await servico
    .from('conexao_google')
    .select('refresh_token, conta')
    .maybeSingle<{ refresh_token: string; conta: string }>()
  if (!c) return [{ ok: false, erro: 'sem_conexao' }, 409]
  const acesso = await acessoPor(c.refresh_token)
  const { link, sala } = await salaDaLive(live, acesso, c.conta)
  const { data: destinos, error } = await servico.rpc('destinos_da_live', { p_live: live })
  if (error) throw new Error(error.message)
  for (const d of (destinos ?? []) as Destino[]) {
    if (d.papel === 'aluna') continue
    try {
      await adicionarMembro(acesso, sala, d.email, d.papel === 'equipe')
    } catch (e) {
      console.error('google-meet membro', d.papel, e instanceof Error ? e.message : e)
    }
  }
  return [{ ok: true, link }, 200]
}
