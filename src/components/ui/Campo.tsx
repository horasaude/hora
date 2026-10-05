import { forwardRef, type InputHTMLAttributes } from 'react'

type Props = InputHTMLAttributes<HTMLInputElement> & {
  rotulo: string
  erro?: string
  /** Rótulo só para leitor de tela, quando o placeholder já explica o campo. */
  rotuloOculto?: boolean
}

export const Campo = forwardRef<HTMLInputElement, Props>(function Campo(
  { rotulo, erro, rotuloOculto, id, ...props },
  ref,
) {
  const campoId = id ?? props.name
  return (
    <label htmlFor={campoId} className="flex flex-col gap-1 text-sm">
      <span className={rotuloOculto ? 'sr-only' : 'font-medium'}>{rotulo}</span>
      <input
        ref={ref}
        id={campoId}
        className="min-h-12 rounded-xl border border-linha bg-white px-4 placeholder:text-suave focus:border-ora focus:outline-none"
        aria-invalid={Boolean(erro)}
        {...props}
      />
      {erro && <span className="text-terracota">{erro}</span>}
    </label>
  )
})
