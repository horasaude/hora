// Arquivos enviados pelo painel: materiais da aula (PDF, Word e imagens até 20 MB), capa da live (imagem até 5 MB)
// e mídia do exercício (imagem ou GIF até 5 MB, vídeo MP4, WEBM ou MOV até 30 MB).

export type TipoMaterial = 'pdf' | 'imagem' | 'word' | 'link'

const MB = 1024 * 1024
export const LIMITE_MATERIAL = 20 * MB
export const LIMITE_CAPA = 5 * MB
export const LIMITE_VIDEO = 30 * MB

const IMAGENS = ['image/jpeg', 'image/png', 'image/webp']
export const VIDEOS = ['video/mp4', 'video/webm', 'video/quicktime']
const WORD = [
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]
const EXTENSOES: Record<string, string> = {
  pdf: 'application/pdf',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  gif: 'image/gif',
  mp4: 'video/mp4',
  webm: 'video/webm',
  mov: 'video/quicktime',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
}

/** Tipo pelo arquivo (alguns navegadores não informam o tipo; aí vale a extensão). */
export function tipoMime(nome: string, tipo: string): string {
  return tipo || EXTENSOES[nome.split('.').pop()?.toLowerCase() ?? ''] || ''
}

export type Recusa = 'tipo' | 'tamanho' | 'vazio'

/** Confere tipo e tamanho; devolve o tipo do material ou o motivo da recusa. */
export function validarArquivo(
  a: { name: string; type: string; size: number },
  uso: 'material' | 'capa' | 'exercicio',
): { ok: true; tipo: Exclude<TipoMaterial, 'link'> } | { ok: false; motivo: Recusa } {
  const mime = tipoMime(a.name, a.type)
  const aceitos =
    uso === 'material'
      ? ['application/pdf', ...WORD, ...IMAGENS]
      : uso === 'exercicio'
        ? [...IMAGENS, 'image/gif', ...VIDEOS]
        : IMAGENS
  if (!aceitos.includes(mime)) return { ok: false, motivo: 'tipo' }
  if (a.size <= 0) return { ok: false, motivo: 'vazio' }
  const limite =
    uso === 'material' ? LIMITE_MATERIAL : VIDEOS.includes(mime) ? LIMITE_VIDEO : LIMITE_CAPA
  if (a.size > limite) return { ok: false, motivo: 'tamanho' }
  const tipo = mime === 'application/pdf' ? 'pdf' : WORD.includes(mime) ? 'word' : 'imagem'
  return { ok: true, tipo }
}

/** Tamanho legível: "850 KB", "2,4 MB". */
export function formatarTamanho(bytes: number | null): string {
  if (bytes === null) return ''
  if (bytes < MB) return `${Math.max(1, Math.round(bytes / 1024))} KB`
  return `${(bytes / MB).toLocaleString('pt-BR', { maximumFractionDigits: 1 })} MB`
}

/** Nome sem a extensão, para virar o nome editável do material. */
export const nomeSemExtensao = (nome: string) => nome.replace(/\.[a-z0-9]+$/i, '').slice(0, 160)

/** Extensão para guardar no espaço: jpg, png, webp, gif, mp4, webm ou mov. */
export function extensaoDe(nome: string, tipo: string): string {
  const sub = tipoMime(nome, tipo).split('/')[1] ?? 'jpg'
  return sub.replace('jpeg', 'jpg').replace('quicktime', 'mov')
}

/** Caminho de vídeo (o exercício mostra em loop, sem som). */
export const ehVideo = (caminho: string | null) => /\.(mp4|webm|mov)$/i.test(caminho ?? '')
