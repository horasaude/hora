const CORES = ['#8b6fd6', '#6f9582', '#e2588f', '#c26e4f', '#1f4a41', '#f2643a'] as const

/** Foto de perfil ou a inicial num círculo colorido (a cor muda com a posição). */
export function Inicial({
  nome,
  foto,
  posicao,
  tamanho = 'size-9 text-[15px]',
}: {
  nome: string
  foto?: string | null
  posicao: number
  tamanho?: string
}) {
  if (foto)
    return <img src={foto} alt="" className={`${tamanho} shrink-0 rounded-full object-cover`} />
  return (
    <span
      aria-hidden
      style={{ background: CORES[posicao % CORES.length] }}
      className={`${tamanho} grid shrink-0 place-items-center rounded-full font-bold text-white`}
    >
      {nome[0]?.toUpperCase()}
    </span>
  )
}
