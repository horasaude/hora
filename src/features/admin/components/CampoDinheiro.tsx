import { useId } from 'react'
import { formatarCentavos } from '@/lib/moeda'

type Props = { rotulo: string; valor: number; aoMudar: (centavos: number) => void; erro?: string }

/** Valor em reais que se formata enquanto digita; guarda centavos inteiros. */
export function CampoDinheiro({ rotulo, valor, aoMudar, erro }: Props) {
  const id = useId()
  return (
    <div className="flex flex-col gap-1 text-sm">
      <label htmlFor={id} className="font-medium">
        {rotulo}
      </label>
      <input
        id={id}
        inputMode="numeric"
        value={formatarCentavos(valor)}
        onChange={(e) => aoMudar(Number(e.target.value.replace(/\D/g, '').slice(0, 9) || '0'))}
        aria-invalid={Boolean(erro)}
        aria-describedby={erro ? `${id}-erro` : undefined}
        className="min-h-12 rounded-xl border border-linha bg-white px-4 tabular-nums focus:border-ora focus:outline-none"
      />
      {erro && (
        <span id={`${id}-erro`} className="text-terracota-escuro">
          {erro}
        </span>
      )}
    </div>
  )
}
