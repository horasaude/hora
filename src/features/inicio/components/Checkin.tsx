import { useState } from 'react'
import { Cartao, classeBrilho, IconeCheck } from '@/components/ui'
import { exemplo, textos } from '../textos'

const t = textos.checkin
const COR = { salvia: 'verde', terracota: 'coral' } as const

/** Check-in de hoje: hábitos em botões e a sequência de dias. Por enquanto só visual. */
export function Checkin() {
  const [feitos, setFeitos] = useState<string[]>(exemplo.feitos)
  const alternar = (id: string) =>
    setFeitos((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]))
  return (
    <Cartao className="flex flex-col gap-4">
      <h2 className="text-base font-bold text-tinta">{t.titulo}</h2>
      <ul className="flex flex-wrap gap-2">
        {t.habitos.map((h) => {
          const feito = feitos.includes(h.id)
          return (
            <li key={h.id}>
              <button
                type="button"
                aria-pressed={feito}
                onClick={() => alternar(h.id)}
                className={classeBrilho(
                  feito ? COR[h.tom as keyof typeof COR] : 'cinza',
                  'md',
                  true,
                )}
              >
                {feito && <IconeCheck className="size-3.5" />}
                {h.nome}
              </button>
            </li>
          )
        })}
      </ul>
      <div className="flex items-center gap-3">
        <span className="flex gap-1.5" aria-hidden>
          {Array.from({ length: 7 }, (_, i) => (
            <span
              key={i}
              className={`size-3 rounded-full ${i < exemplo.diasSeguidos ? 'bg-dourado' : 'bg-trilho'}`}
            />
          ))}
        </span>
        <span className="text-sm text-suave">{t.seguidos(exemplo.diasSeguidos)}</span>
      </div>
    </Cartao>
  )
}
