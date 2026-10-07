import { PROFISSIONAIS } from '@/domain/lives'
import type { Live } from '../api/lives.api'

/** Foto e nome de quem conduz a live. */
export function Profissional({
  quem,
  tamanho = 'size-14',
}: {
  quem: Live['profissional']
  tamanho?: string
}) {
  if (!quem) return null
  const p = PROFISSIONAIS[quem]
  return (
    <span className="flex items-center gap-3">
      <img
        src={p.foto}
        alt=""
        className={`${tamanho} shrink-0 rounded-full object-cover object-top`}
      />
      <span className="text-[15px] font-bold text-tinta">{p.nome}</span>
    </span>
  )
}
