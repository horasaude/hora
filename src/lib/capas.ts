import { supabase } from './supabase'

/** Endereço público da capa de tema ou aula (espaço capas, só imagens). */
export const urlCapa = (caminho: string | null | undefined): string | null =>
  caminho ? supabase.storage.from('capas').getPublicUrl(caminho).data.publicUrl : null
