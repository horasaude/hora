import { useState } from 'react'
import { DIAS_CURTOS } from '@/domain/treinos'
import type { AerobicoDaRotina } from '../hooks/useRotinaForm'
import { t } from '../textos'
import { NovoAerobico } from './NovoAerobico'

const a = t.aerobicos

type Props = {
  base: { tema_id: string; nivel: string; local: string }
  comDias: boolean
  aerobicos: AerobicoDaRotina[]
  treinos: { id: string; nome: string }[]
  aoMudar: (x: AerobicoDaRotina[]) => void
}

/** Aeróbicos do tipo de treino: por dia (ou soltos na rotina numérica), com Adicionar aeróbico. */
export function AerobicosDaRotina({ base, comDias, aerobicos, treinos, aoMudar }: Props) {
  const [abrindo, setAbrindo] = useState(false)
  const nome = (id: string) => treinos.find((x) => x.id === id)?.nome ?? ''
  const lista = aerobicos
    .map((x, i) => ({ ...x, i }))
    .filter((x) => !comDias || x.dia !== null)
    .sort((x, y) => (((x.dia ?? 0) + 6) % 7) - (((y.dia ?? 0) + 6) % 7))
  return (
    <fieldset className="grid gap-3 rounded-2xl border border-[#F2C4B3] p-4 sm:col-span-2">
      <legend className="px-1 text-sm font-bold text-coral">{a.titulo}</legend>
      {lista.length === 0 ? (
        <p className="text-sm text-suave">{a.nenhum}</p>
      ) : (
        <ul className="flex flex-wrap gap-2">
          {lista.map((x) => (
            <li
              key={`${x.dia}-${x.treino_id}-${x.i}`}
              className="inline-flex min-h-9 items-center gap-1 rounded-full bg-[#FFF1EA] pr-1 pl-3 text-[13px] text-tinta"
            >
              {comDias && x.dia !== null && <b>{DIAS_CURTOS[x.dia]}</b>}
              {nome(x.treino_id)}
              <button
                type="button"
                onClick={() => aoMudar(aerobicos.filter((_, j) => j !== x.i))}
                aria-label={a.tirar(nome(x.treino_id))}
                className="grid size-7 place-items-center rounded-full text-terracota-escuro hover:bg-white"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
      {abrindo ? (
        <NovoAerobico
          base={base}
          comDias={comDias}
          existentes={treinos}
          aoAdicionar={(novos) => (aoMudar([...aerobicos, ...novos]), setAbrindo(false))}
          aoCancelar={() => setAbrindo(false)}
        />
      ) : (
        <button
          type="button"
          onClick={() => setAbrindo(true)}
          className="brilho brilho-coral inline-flex min-h-9 items-center self-start justify-self-start rounded-full px-4 text-[13px] font-bold"
        >
          {a.abrir}
        </button>
      )}
    </fieldset>
  )
}
