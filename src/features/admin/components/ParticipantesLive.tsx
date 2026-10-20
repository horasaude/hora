import { useId } from 'react'
import { BotaoBrilho } from '@/components/ui'
import { PROFISSIONAIS, type Profissional } from '@/domain/lives'
import type { Convidada } from '../api/agenda.api'
import { convidadaInvalida } from '../schemas/convidadas'
import { meet } from '../textos/meet'

export type Participantes = { profissionais: Profissional[]; convidadas: Convidada[] }

const MAXIMO = 20
const campo =
  'min-h-12 w-full rounded-xl border bg-white px-4 text-sm focus:border-ora focus:outline-none'

function LinhaConvidada({
  c,
  mudar,
  tirar,
}: {
  c: Convidada
  mudar: (c: Convidada) => void
  tirar: () => void
}) {
  const id = useId()
  const borda = convidadaInvalida(c) ? 'border-terracota' : 'border-linha'
  return (
    <li className="grid gap-2 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
      <label htmlFor={`${id}-n`} className="flex flex-col gap-1 text-sm font-medium">
        {meet.nome}
        <input
          id={`${id}-n`}
          className={`${campo} ${borda}`}
          value={c.nome}
          maxLength={120}
          onChange={(e) => mudar({ ...c, nome: e.target.value })}
        />
      </label>
      <label htmlFor={`${id}-e`} className="flex flex-col gap-1 text-sm font-medium">
        {meet.email}
        <input
          id={`${id}-e`}
          type="email"
          className={`${campo} ${borda}`}
          value={c.email}
          maxLength={254}
          onChange={(e) => mudar({ ...c, email: e.target.value })}
        />
      </label>
      <BotaoBrilho tom="cinza" onClick={tirar} aria-label={meet.remover(c.nome)}>
        ×
      </BotaoBrilho>
    </li>
  )
}

const TODAS = Object.keys(PROFISSIONAIS) as Profissional[]

/** Uma ou mais profissionais, sempre na ordem fixa (Ana, Clara, Laís). */
function Profissionais({
  marcadas,
  aoMudar,
}: {
  marcadas: Profissional[]
  aoMudar: (v: Profissional[]) => void
}) {
  return (
    <fieldset className="flex flex-col gap-1">
      <legend className="mb-1 text-sm font-medium">{meet.profissionais}</legend>
      {TODAS.map((p) => (
        <label key={p} className="flex min-h-10 items-center gap-3 text-sm">
          <input
            type="checkbox"
            className="size-5 accent-ora"
            checked={marcadas.includes(p)}
            onChange={(e) =>
              aoMudar(TODAS.filter((q) => (q === p ? e.target.checked : marcadas.includes(q))))
            }
          />
          {PROFISSIONAIS[p].nome}
        </label>
      ))}
    </fieldset>
  )
}

/** Profissionais (várias) e convidadas (nome e e-mail) da live, dentro da janela de editar. */
export function ParticipantesLive({
  valor,
  aoMudar,
}: {
  valor: Participantes
  aoMudar: (v: Participantes) => void
}) {
  const trocar = (i: number, c: Convidada | null) =>
    aoMudar({
      ...valor,
      convidadas: c
        ? valor.convidadas.map((x, j) => (j === i ? c : x))
        : valor.convidadas.filter((_, j) => j !== i),
    })
  return (
    <div className="flex flex-col gap-5">
      <Profissionais
        marcadas={valor.profissionais}
        aoMudar={(profissionais) => aoMudar({ ...valor, profissionais })}
      />
      <fieldset className="flex flex-col gap-3">
        <legend className="mb-1 text-sm font-medium">{meet.convidadas}</legend>
        {valor.convidadas.length > 0 && (
          <ul className="flex flex-col gap-3">
            {valor.convidadas.map((c, i) => (
              <LinhaConvidada
                key={i}
                c={c}
                mudar={(n) => trocar(i, n)}
                tirar={() => trocar(i, null)}
              />
            ))}
          </ul>
        )}
        {valor.convidadas.length < MAXIMO && (
          <BotaoBrilho
            tom="dourado"
            className="self-start"
            onClick={() =>
              aoMudar({ ...valor, convidadas: [...valor.convidadas, { nome: '', email: '' }] })
            }
          >
            {meet.adicionar}
          </BotaoBrilho>
        )}
      </fieldset>
    </div>
  )
}
