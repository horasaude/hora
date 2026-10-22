// PDF do cardápio no bucket privado cardapios (só PDF, até 20 MB).
import { supabase } from '@/lib/supabase'

const ESPACO = 'cardapios'

/** Envia o PDF com nome novo e devolve o caminho no bucket. */
export async function enviarPdfCardapio(arquivo: File): Promise<string> {
  const caminho = `${crypto.randomUUID()}.pdf`
  const { error } = await supabase.storage
    .from(ESPACO)
    .upload(caminho, arquivo, { contentType: 'application/pdf' })
  if (error) throw error
  return caminho
}

export async function linkPdfCardapio(caminho: string): Promise<string | null> {
  const { data } = await supabase.storage.from(ESPACO).createSignedUrl(caminho, 3600)
  return data?.signedUrl ?? null
}
