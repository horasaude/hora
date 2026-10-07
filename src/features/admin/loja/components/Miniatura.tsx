/** Miniatura quadrada da foto (ou um quadro vazio). */
export function Miniatura({ src, tamanho = 'size-11' }: { src?: string; tamanho?: string }) {
  return (
    <span className={`block shrink-0 overflow-hidden rounded-xl bg-trilho ${tamanho}`}>
      {src && <img src={src} alt="" className="size-full object-cover" />}
    </span>
  )
}
