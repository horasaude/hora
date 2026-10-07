// Arquivos enviados pelo painel: materiais da aula (PDF e imagens até 20 MB) e capa da live (imagem até 5 MB).

export type TipoMaterial = 'pdf' | 'imagem' | 'link'

const MB = 1024 * 1024
export const LIMITE_MATERIAL = 20 * MB
export const LIMITE_CAPA = 5 * MB

const IMAGENS = ['image/jpeg', 'image/png', 'image/webp']
const EXTENSOES: Record<string, string> = {
  pdf: 'application/pdf',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
}

/** Tipo pelo arquivo (alguns navegadores não informam o tipo; aí vale a extensão). */
export function tipoMime(nome: string, tipo: string): string {
  return tipo || EXTENSOES[nome.split('.').pop()?.toLowerCase() ?? ''] || ''
}

export type Recusa = 'tipo' | 'tamanho' | 'vazio'

/** Confere tipo e tamanho; devolve o tipo do material ou o motivo da recusa. */
export function validarArquivo(
  a: { name: string; type: string; size: number },
  uso: 'material' | 'capa',
): { ok: true; tipo: Exclude<TipoMaterial, 'link'> } | { ok: false; motivo: Recusa } {
  const mime = tipoMime(a.name, a.type)
  const aceitos = uso === 'capa' ? IMAGENS : ['application/pdf', ...IMAGENS]
  if (!aceitos.includes(mime)) return { ok: false, motivo: 'tipo' }
  if (a.size <= 0) return { ok: false, motivo: 'vazio' }
  if (a.size > (uso === 'capa' ? LIMITE_CAPA : LIMITE_MATERIAL))
    return { ok: false, motivo: 'tamanho' }
  return { ok: true, tipo: mime === 'application/pdf' ? 'pdf' : 'imagem' }
}

/** Tamanho legível: "850 KB", "2,4 MB". */
export function formatarTamanho(bytes: number | null): string {
  if (bytes === null) return ''
  if (bytes < MB) return `${Math.max(1, Math.round(bytes / 1024))} KB`
  return `${(bytes / MB).toLocaleString('pt-BR', { maximumFractionDigits: 1 })} MB`
}

/** Nome sem a extensão, para virar o nome editável do material. */
export const nomeSemExtensao = (nome: string) => nome.replace(/\.[a-z0-9]+$/i, '').slice(0, 160)
