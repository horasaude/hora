import { forwardRef, useState, type InputHTMLAttributes } from 'react'

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & { rotulo: string; erro?: string }

function Olho({ aberto }: { aberto: boolean }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="size-5">
      <path
        d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="1.7" />
      {!aberto && (
        <path d="M4 20 20 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      )}
    </svg>
  )
}

/** Campo de senha com o olhinho para ver o que foi digitado. */
export const CampoSenha = forwardRef<HTMLInputElement, Props>(function CampoSenha(
  { rotulo, erro, id, ...props },
  ref,
) {
  const [visivel, setVisivel] = useState(false)
  const campoId = id ?? props.name
  const erroId = campoId ? `${campoId}-erro` : undefined
  return (
    <div className="flex flex-col gap-1 text-sm">
      <label htmlFor={campoId} className="font-medium">
        {rotulo}
      </label>
      <div className="relative">
        <input
          ref={ref}
          id={campoId}
          type={visivel ? 'text' : 'password'}
          className="min-h-12 w-full rounded-xl border border-linha bg-white py-2 pr-12 pl-4 placeholder:text-suave focus:border-ora focus:outline-none"
          aria-invalid={Boolean(erro)}
          aria-describedby={erro ? erroId : undefined}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisivel(!visivel)}
          aria-label={visivel ? 'Esconder senha' : 'Mostrar senha'}
          aria-pressed={visivel}
          className="absolute inset-y-0 right-0 grid w-12 place-items-center text-suave hover:text-ora"
        >
          <Olho aberto={visivel} />
        </button>
      </div>
      {erro && (
        <span id={erroId} className="text-terracota-escuro">
          {erro}
        </span>
      )}
    </div>
  )
})
