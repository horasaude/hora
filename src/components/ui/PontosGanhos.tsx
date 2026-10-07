/** "+5" discreto que sobe e some ao lado do que foi feito. A chave nova reinicia a animação. */
export function PontosGanhos({ pontos, chave }: { pontos: number; chave: number }) {
  if (pontos <= 0) return null
  return (
    <span
      key={chave}
      aria-live="polite"
      className="pontos-ganhos pointer-events-none absolute -top-1 right-1 text-[13px] font-bold text-verde-vivo"
    >
      +{pontos}
    </span>
  )
}
