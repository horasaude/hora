import type { ReactNode } from 'react'
import { textos } from '../../textos'

const t = textos.app

function Cartao({ children }: { children: ReactNode }) {
  return <div className="rounded-2xl border border-linha bg-white p-3">{children}</div>
}

export function TelaDesafios() {
  const d = t.desafios
  return (
    <div className="flex flex-col gap-3">
      <Cartao>
        <p className="font-titulo text-xl text-ora">{d.titulo}</p>
        <p className="text-[0.7rem] text-suave">{d.sub}</p>
        <div className="mt-3 grid grid-cols-7 gap-1">
          {d.dias.map((dia, i) => (
            <span
              key={i}
              className={`grid h-7 place-items-center rounded-lg text-[0.6rem] font-semibold ${i < d.feitos ? 'bg-ora text-creme' : 'bg-creme text-suave'}`}
            >
              {dia}
            </span>
          ))}
        </div>
        <p className="mt-2 text-right text-[0.65rem] font-semibold text-ora">
          {d.feitos}/{d.dias.length}
        </p>
      </Cartao>
      <Cartao>
        <ul className="flex flex-col gap-2">
          {d.proximos.map((p) => (
            <li key={p} className="flex items-center gap-2 text-xs text-tinta">
              <span className="size-2 rounded-full bg-salvia" />
              {p}
            </li>
          ))}
        </ul>
      </Cartao>
    </div>
  )
}

export function TelaRanking() {
  const r = t.ranking
  const alturas = ['h-14', 'h-20', 'h-10']
  const ordem = [1, 0, 2]
  return (
    <div className="flex flex-col gap-3">
      <Cartao>
        <p className="text-xs font-semibold text-ora">{r.titulo}</p>
        <div className="mt-3 grid grid-cols-3 items-end gap-2">
          {ordem.map((i) => {
            const p = r.podio[i]
            if (!p) return null
            return (
              <div key={p.nome} className="text-center">
                <span className="mx-auto mb-1 grid size-8 place-items-center rounded-full bg-salvia text-[0.65rem] font-semibold text-white">
                  {p.nome[0]}
                </span>
                <p className="text-[0.6rem] font-semibold text-tinta">{p.nome}</p>
                <div
                  className={`mt-1 grid place-items-center rounded-t-lg bg-ora text-sm text-creme ${alturas[i]}`}
                >
                  {i + 1}º
                </div>
              </div>
            )
          })}
        </div>
      </Cartao>
      <div className="flex items-center gap-3 rounded-2xl bg-creme px-3 py-2 text-xs">
        <span className="font-semibold text-suave">{r.voce.pos}</span>
        <span className="flex-1 font-semibold text-ora">{r.voce.nome}</span>
        <span className="font-semibold text-tinta">{r.voce.pts} pts</span>
      </div>
      <p className="text-center text-[0.65rem] font-semibold tracking-[0.12em] text-suave uppercase">
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
          {e.numeros.map((n) => (
            <div key={n.rotulo} className="rounded-xl bg-creme py-2">
              <p className="font-titulo text-2xl leading-none text-ora">{n.valor}</p>
              <p className="mt-1 text-[0.55rem] text-suave">{n.rotulo}</p>
            </div>
          ))}
        </div>
      </Cartao>
      <Cartao>
        <p className="text-xs font-semibold text-ora">{e.checkin}</p>
        <ul className="mt-2 flex flex-col gap-2">
          {e.medidores.map((m) => (
            <li key={m.nome} className="text-[0.65rem] text-tinta">
              <span className="flex justify-between">
                {m.nome}
                <span className="text-suave">{m.valor}%</span>
              </span>
              <span className="mt-1 block h-2 overflow-hidden rounded-full bg-creme">
                <span
                  className="block h-full rounded-full bg-salvia"
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
