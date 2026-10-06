import type { ReactNode } from 'react'
import { textos } from '../../textos'
import { cores, SEQUENCIA } from './cores'

const t = textos.app
const cor = (i: number) => cores[SEQUENCIA[i % SEQUENCIA.length] ?? 'ora']

function Cartao({
  children,
  fundo = 'border border-linha bg-white',
}: {
  children: ReactNode
  fundo?: string
}) {
  return <div className={`rounded-2xl p-3 ${fundo}`}>{children}</div>
}

export function TelaDesafios() {
  const d = t.desafios
  return (
    <div className="flex flex-col gap-3">
      <Cartao fundo="bg-ocre-suave">
        <p className="font-titulo text-xl text-[#8a6326]">{d.titulo}</p>
        <p className="text-[0.7rem] text-suave">{d.sub}</p>
        <div className="mt-3 grid grid-cols-7 gap-1">
          {d.dias.map((dia, i) => (
            <span
              key={i}
              className={`grid h-7 place-items-center rounded-lg text-[0.6rem] font-semibold ${i < d.feitos ? 'bg-[#a77a32] text-white' : 'bg-white text-suave'}`}
            >
              {dia}
            </span>
          ))}
        </div>
        <p className="mt-2 text-right text-[0.65rem] font-semibold text-[#8a6326]">
          {d.feitos}/{d.dias.length}
        </p>
      </Cartao>
      <Cartao>
        <ul className="flex flex-col gap-2">
          {d.proximos.map((p, i) => (
            <li key={p} className="flex items-center gap-2 text-xs text-tinta">
              <span className={`size-2.5 rounded-full ${cor(i).forte}`} />
              {p}
            </li>
          ))}
        </ul>
      </Cartao>
    </div>
  )
}

const MEDALHAS = ['bg-[#a77a32]', 'bg-salvia', 'bg-terracota-escuro']
const ALTURAS = ['h-14', 'h-20', 'h-10']

export function TelaRanking() {
  const r = t.ranking
  return (
    <div className="flex flex-col gap-3">
      <Cartao fundo="bg-salvia-suave">
        <p className="text-xs font-semibold text-ora">{r.titulo}</p>
        <div className="mt-3 grid grid-cols-3 items-end gap-2">
          {[1, 0, 2].map((i) => {
            const p = r.podio[i]
            if (!p) return null
            return (
              <div key={p.nome} className="text-center">
                <span
                  className={`mx-auto mb-1 grid size-8 place-items-center rounded-full text-[0.65rem] font-semibold text-white ${MEDALHAS[i]}`}
                >
                  {p.nome[0]}
                </span>
                <p className="text-[0.6rem] font-semibold text-tinta">{p.nome}</p>
                <div
                  className={`mt-1 grid place-items-center rounded-t-lg text-sm text-white ${MEDALHAS[i]} ${ALTURAS[i]}`}
                >
                  {i + 1}º
                </div>
              </div>
            )
          })}
        </div>
      </Cartao>
      <div className="flex items-center gap-3 rounded-2xl bg-ocre-suave px-3 py-2 text-xs">
        <span className="font-semibold text-[#8a6326]">{r.voce.pos}</span>
        <span className="flex-1 font-semibold text-ora">{r.voce.nome}</span>
        <span className="font-semibold text-tinta">{r.voce.pts} pts</span>
      </div>
      <p className="mx-auto rounded-full bg-terracota-suave px-3 py-1 text-[0.6rem] font-semibold tracking-[0.12em] text-terracota-escuro uppercase">
        {r.nivel}
      </p>
    </div>
  )
}

export function TelaEu() {
  const e = t.eu
  return (
    <div className="flex flex-col gap-3">
      <Cartao>
        <p className="text-xs font-semibold text-ora">{e.titulo}</p>
        <div className="mt-2 grid grid-cols-3 gap-2 text-center">
          {e.numeros.map((n, i) => (
            <div key={n.rotulo} className={`rounded-xl py-2 ${cor(i).suave}`}>
              <p className={`font-titulo text-2xl leading-none ${cor(i).texto}`}>{n.valor}</p>
              <p className="mt-1 text-[0.55rem] text-suave">{n.rotulo}</p>
            </div>
          ))}
        </div>
      </Cartao>
      <Cartao>
        <p className="text-xs font-semibold text-ora">{e.checkin}</p>
        <ul className="mt-2 flex flex-col gap-2">
          {e.medidores.map((m, i) => (
            <li key={m.nome} className="text-[0.65rem] text-tinta">
              <span className="flex justify-between">
                {m.nome}
                <span className="text-suave">{m.valor}%</span>
              </span>
              <span className="mt-1 block h-2 overflow-hidden rounded-full bg-creme">
                <span
                  className={`block h-full rounded-full ${cor(i).forte}`}
                  style={{ width: `${m.valor}%` }}
                />
              </span>
            </li>
          ))}
        </ul>
      </Cartao>
    </div>
  )
}
