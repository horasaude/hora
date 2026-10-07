// Comprime foto no navegador antes de subir: lado maior até 1200 px, WebP (ou JPEG).

/** Medida reduzida mantendo a proporção; nunca aumenta a imagem. */
export function medidaReduzida(largura: number, altura: number, maximo: number) {
  const fator = Math.min(1, maximo / Math.max(largura, altura))
  return { largura: Math.round(largura * fator), altura: Math.round(altura * fator) }
}

export async function comprimirImagem(
  arquivo: File,
  maximo = 1200,
  qualidade = 0.82,
): Promise<File> {
  const bitmap = await createImageBitmap(arquivo)
  const m = medidaReduzida(bitmap.width, bitmap.height, maximo)
  const canvas = document.createElement('canvas')
  canvas.width = m.largura
  canvas.height = m.altura
  canvas.getContext('2d')?.drawImage(bitmap, 0, 0, m.largura, m.altura)
  bitmap.close()
  const tentar = (tipo: string) =>
    new Promise<Blob | null>((ok) => canvas.toBlob(ok, tipo, qualidade))
  const blob = (await tentar('image/webp')) ?? (await tentar('image/jpeg'))
  if (!blob) return arquivo
  const ext = blob.type === 'image/webp' ? 'webp' : 'jpg'
  return new File([blob], `foto.${ext}`, { type: blob.type })
}
