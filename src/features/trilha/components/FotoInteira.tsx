/** Foto inteira dentro do quadro, sem cortar: a sobra fica com a própria foto desfocada ao fundo. */
export function FotoInteira({ src, className = '' }: { src: string; className?: string }) {
  return (
    <span className={`absolute inset-0 overflow-hidden ${className}`}>
      <img
        src={src}
        alt=""
        aria-hidden
        loading="lazy"
        className="absolute inset-0 size-full scale-110 object-cover opacity-60 blur-md"
      />
      <img src={src} alt="" loading="lazy" className="absolute inset-0 size-full object-contain" />
    </span>
  )
}
