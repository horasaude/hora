// Recorte da foto no navegador: escolher o enquadramento num quadro de proporção fixa e gerar a imagem final.

export type Enquadre = { zoom: number; x: number; y: number }
export type Retangulo = { sx: number; sy: number; sw: number; sh: number }

export const ENQUADRE_INICIAL: Enquadre = { zoom: 1, x: 0.5, y: 0.5 }
const limitar = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))

/** Parte da imagem que aparece no quadro. x e y vão de 0 (borda esquerda/topo) a 1. */
export function retangulo(
  largura: number,
  altura: number,
  proporcao: number,
  e: Enquadre,
): Retangulo {
  const deitada = largura / altura > proporcao
  const sw = (deitada ? altura * proporcao : largura) / e.zoom
  const sh = (deitada ? altura : largura / proporcao) / e.zoom
  return { sx: (largura - sw) * e.x, sy: (altura - sh) * e.y, sw, sh }
}

/** Novo enquadre depois de arrastar dx e dy pixels num quadro com a largura dada. */
export function arrastar(
  largura: number,
  altura: number,
  proporcao: number,
  e: Enquadre,
  dx: number,
  dy: number,
  larguraQuadro: number,
): Enquadre {
  const r = retangulo(largura, altura, proporcao, e)
  const porPixel = r.sw / larguraQuadro
  const sobraX = largura - r.sw
  const sobraY = altura - r.sh
  return {
    ...e,
    x: sobraX > 0 ? limitar(e.x - (dx * porPixel) / sobraX, 0, 1) : 0.5,
    y: sobraY > 0 ? limitar(e.y - (dy * porPixel) / sobraY, 0, 1) : 0.5,
  }
}

/** Gera a foto recortada em JPEG, com no máximo a largura dada. */
export async function recortar(
  img: HTMLImageElement,
  proporcao: number,
  e: Enquadre,
  maximo = 1600,
): Promise<File> {
  const r = retangulo(img.naturalWidth, img.naturalHeight, proporcao, e)
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(Math.min(maximo, r.sw))
  canvas.height = Math.round(canvas.width / proporcao)
  canvas.getContext('2d')?.drawImage(img, r.sx, r.sy, r.sw, r.sh, 0, 0, canvas.width, canvas.height)
  const blob = await new Promise<Blob | null>((ok) => canvas.toBlob(ok, 'image/jpeg', 0.88))
  if (!blob) throw new Error('recorte')
  return new File([blob], 'capa.jpg', { type: 'image/jpeg' })
}
