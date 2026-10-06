import { forwardRef, type TextareaHTMLAttributes } from 'react'

type Props = TextareaHTMLAttributes<HTMLTextAreaElement> & { rotulo: string; erro?: string }

/** Texto longo com rótulo e erro, no mesmo visual do Campo. */
export const CampoArea = forwardRef<HTMLTextAreaElement, Props>(function CampoArea(
  { rotulo, erro, id, ...props },
  ref,
) {
  const campoId = id ?? props.name
  return (
    <div className="flex flex-col gap-1 text-sm">
      <label htmlFor={campoId} className="font-medium">
        {rotulo}
      </label>
      <textarea
        ref={ref}
        id={campoId}
        rows={4}
        className="rounded-xl border border-linha bg-white px-4 py-3 focus:border-ora focus:outline-none"
        aria-invalid={Boolean(erro)}
        aria-describedby={erro ? `${campoId}-erro` : undefined}
        {...props}
      />
      {erro && (
        <span id={`${campoId}-erro`} className="text-terracota-escuro">
          {erro}
        </span>
      )}
    </div>
  )
})
