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
  const erroId = campoId ? `${campoId}-erro` : undefined
  return (
    <div className="flex flex-col gap-1 text-sm">
      <label htmlFor={campoId} className={rotuloOculto ? 'sr-only' : 'font-medium'}>
        {rotulo}
      </label>
      <input
        ref={ref}
        id={campoId}
        className="min-h-12 rounded-xl border border-linha bg-white px-4 placeholder:text-suave focus:border-ora focus:outline-none"
        aria-invalid={Boolean(erro)}
        aria-describedby={erro ? erroId : undefined}
        {...props}
      />
      {erro && (
        <span id={erroId} className="text-terracota">
          {erro}
        </span>
      )}
    </div>
  )
})
