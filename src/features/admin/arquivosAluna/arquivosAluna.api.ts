import { supabase } from '@/lib/supabase'
import type { Tables } from '@/types/database'
import { ok } from '../api/conteudo.api'

export type ArquivoAluna = Tables<'arquivos_aluna'>
const ESPACO = 'arquivos_aluna'

export async function listarArquivosAluna(perfil: string): Promise<ArquivoAluna[]> {
  return ok(
    await supabase
      .from('arquivos_aluna')
      .select('*')
      .eq('perfil_id', perfil)
      .order('created_at', { ascending: false }),
  )
}

export async function registrarArquivo(d: {
  perfil: string
  nome: string
  caminho: string
  tipo: 'pdf' | 'imagem' | 'word'
  tamanho: number
}): Promise<void> {
  ok(
    await supabase.from('arquivos_aluna').insert({
      perfil_id: d.perfil,
      nome: d.nome,
      caminho: d.caminho,
      tipo: d.tipo,
      tamanho: d.tamanho,
    }),
  )
}

/** Tira o arquivo do espaço e da lista. */
export async function removerArquivoAluna(a: ArquivoAluna): Promise<void> {
  await supabase.storage.from(ESPACO).remove([a.caminho])
  ok(await supabase.from('arquivos_aluna').delete().eq('id', a.id))
}

export async function linkDoArquivo(caminho: string): Promise<string | null> {
  const { data } = await supabase.storage.from(ESPACO).createSignedUrl(caminho, 300)
  return data?.signedUrl ?? null
}
