/**
 * Padrão das capas do ORA: "Você é a *ÚLTIMA* da sua lista." vira frase em itálico leve,
 * a palavra entre asteriscos enorme em serifa fina caixa alta, e o complemento em itálico.
 * A cor vem do elemento pai.
 */
/** `linha`: tudo na mesma linha, mantendo a diferença de tamanho. */
export function Destaque({ texto, linha = false }: { texto: string; linha?: boolean }) {
  const partes = texto.split(/\*(.+?)\*/).map((p) => p.trim())
  return (
    <>
      {partes.map((parte, i) => {
        if (!parte) return null
        return i % 2 ? (
          <span
            key={i}
            className={`${linha ? 'mr-[0.25em] inline' : 'block'} font-titulo leading-[0.95] font-medium tracking-[0.01em] uppercase`}
          >
            {parte}
          </span>
        ) : (
          <span
            key={i}
            className={`${linha ? 'mr-[0.25em] inline' : 'block'} font-texto text-[0.36em] leading-snug font-light tracking-normal normal-case italic`}
          >
            {parte}
          </span>
        )
      })}
    </>
  )
}
