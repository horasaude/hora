import { forwardRef, type InputHTMLAttributes } from 'react'

type Props = InputHTMLAttributes<HTMLInputElement> & { rotulo: string; erro?: string }

export const Campo = forwardRef<HTMLInputElement, Props>(function Campo(
  { rotulo, erro, id, ...props },
  ref,
) {
  const campoId = id ?? props.name
  return (
    <label htmlFor={campoId} className="flex flex-col gap-1 text-sm">
      <span className="font-medium">{rotulo}</span>
      <input
        ref={ref}
        id={campoId}
        className="min-h-11 rounded-lg border border-linha px-3 focus:border-ora focus:outline-none"
        aria-invalid={Boolean(erro)}
        {...props}
      />
      {erro && <span className="text-terracota">{erro}</span>}
    </label>
  )
})
