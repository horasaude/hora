// Excluir tema e aula do Conteúdo: apaga também os arquivos guardados (materiais e capa).
import { supabase } from '@/lib/supabase'
import { ok } from './conteudo.api'

/** O tema ainda tem treinos ligados (o banco não deixa apagar o tema por baixo deles). */
export class TemaComTreinos extends Error {}

const arquivos = (lista: { tipo: string; caminho: string }[]) =>
  lista.filter((m) => m.tipo !== 'link').map((m) => m.caminho)

async function limpar(espaco: string, caminhos: (string | null)[]) {
  const lista = caminhos.filter((c): c is string => Boolean(c))
  if (lista.length) await supabase.storage.from(espaco).remove(lista)
}

export async function excluirAula(id: string) {
  const materiais = ok(
    await supabase.from('aula_materiais').select('tipo, caminho').eq('aula_id', id),
  )
  const aula: { capa_path: string | null } = ok(
    await supabase.from('aulas').select('capa_path').eq('id', id).single(),
  )
  ok(await supabase.from('aulas').delete().eq('id', id))
  await limpar('materiais', arquivos(materiais))
  await limpar('capas', [aula.capa_path])
}

/** Apaga o tema com as aulas e os materiais dele; cardápios e desafios ficam sem tema. */
export async function excluirTema(id: string) {
  const etapas = ok(await supabase.from('etapas').select('id').eq('tema_id', id)).map((e) => e.id)
  const aulas = etapas.length
    ? ok(await supabase.from('aulas').select('id, capa_path').in('etapa_id', etapas))
    : []
  const ids = aulas.map((a) => a.id)
  const deAulas = ids.length
    ? ok(await supabase.from('aula_materiais').select('tipo, caminho').in('aula_id', ids))
    : []
  const doTema = ok(await supabase.from('tema_materiais').select('tipo, caminho').eq('tema_id', id))
  const tema: { capa_path: string | null } = ok(
    await supabase.from('temas').select('capa_path').eq('id', id).single(),
  )
  const { error } = await supabase.from('temas').delete().eq('id', id)
  if (error?.code === '23001' || error?.code === '23503') throw new TemaComTreinos()
  if (error) throw error
  await limpar('materiais', [...arquivos(deAulas), ...arquivos(doTema)])
  await limpar('capas', [tema.capa_path, ...aulas.map((a) => a.capa_path)])
}

/** Apaga a live (sala, convidadas, presenças e lembretes vão junto) e a capa; pontos já dados ficam. */
export async function excluirLive(id: string) {
  const live: { capa_path: string | null } = ok(
    await supabase.from('lives').select('capa_path').eq('id', id).single(),
  )
  ok(await supabase.from('lives').delete().eq('id', id))
  await limpar('materiais', [live.capa_path])
}
