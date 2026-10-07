// Fotos da aluna em espaço privado: comprime no navegador, sobe na pasta dela e lê por link assinado.
import { comprimirImagem } from './imagem'
import { supabase } from './supabase'

export type EspacoFoto = 'checkins' | 'evolucao'

/** Id da usuária logada (a pasta das fotos dela). */
export async function minhaPasta(): Promise<string> {
  const { data } = await supabase.auth.getUser()
  if (!data.user) throw new Error('sem sessão')
  return data.user.id
}

/** Comprime e sobe a foto em <id>/<prefixo>-<aleatório>; devolve o caminho. */
export async function subirFoto(espaco: EspacoFoto, prefixo: string, arquivo: File) {
  const [pasta, leve] = await Promise.all([minhaPasta(), comprimirImagem(arquivo)])
  const ext = leve.name.split('.').pop() ?? 'jpg'
  const caminho = `${pasta}/${prefixo}-${crypto.randomUUID()}.${ext}`
  const { error } = await supabase.storage
    .from(espaco)
    .upload(caminho, leve, { contentType: leve.type })
  if (error) throw error
  return caminho
}

/** Links assinados (1 h) por caminho; o que não abrir fica de fora. */
export async function linksDasFotos(espaco: EspacoFoto, caminhos: (string | null)[]) {
  const unicos = [...new Set(caminhos.filter((c): c is string => Boolean(c)))]
  if (unicos.length === 0) return new Map<string, string>()
  const { data } = await supabase.storage.from(espaco).createSignedUrls(unicos, 3600)
  return new Map(
    (data ?? []).flatMap((l) => (l.path && l.signedUrl ? [[l.path, l.signedUrl] as const] : [])),
  )
}
