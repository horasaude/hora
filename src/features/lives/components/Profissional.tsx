import { nomesDasProfissionais, PROFISSIONAIS } from '@/domain/lives'
import type { Live } from '../api/lives.api'

/** Fotos e nomes de quem conduz a live (as fotos se sobrepõem quando são várias). */
export function Profissional({
  quem,
  tamanho = 'size-14',
}: {
  quem: Live['profissionais']
  tamanho?: string
}) {
  if (quem.length === 0) return null
  return (
    <span className="flex items-center gap-3">
      <span className="flex shrink-0 -space-x-3">
        {quem.map((q) => (
          <img
            key={q}
            src={PROFISSIONAIS[q].foto}
            alt=""
            className={`${tamanho} rounded-full object-cover object-top ring-2 ring-white`}
          />
        ))}
      </span>
      <span className="text-[15px] font-bold text-tinta">{nomesDasProfissionais(quem)}</span>
    </span>
  )
}
