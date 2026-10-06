import { useState } from 'react'
import { textos } from '../../textos'
import { TelaHoje } from './TelaHoje'
import { TelaPlano } from './TelaPlano'
import { TelaDesafios, TelaEu, TelaRanking } from './TelasResumo'

const t = textos.app
export type Aba = (typeof t.abas)[number]['id']

const PONTOS_BASE = 335

/** Protótipo do app: cabeçalho com pontos, tela da aba e barra de abas. */
export function Celular({ aba, escolher }: { aba: Aba; escolher: (a: Aba) => void }) {
  const [feitos, setFeitos] = useState(() => t.hoje.habitos.map((h) => h.feito))
  const pontos =
    PONTOS_BASE + t.hoje.habitos.reduce((soma, h, i) => soma + (feitos[i] ? h.pts : 0), 0)
  const alternar = (i: number) => setFeitos((f) => f.map((v, k) => (k === i ? !v : v)))
  return (
    <div className="relative mx-auto h-[600px] w-[300px] rounded-[2.75rem] bg-tinta p-2.5 shadow-2xl">
      <div className="absolute top-4 left-1/2 z-10 h-5 w-20 -translate-x-1/2 rounded-full bg-tinta" />
      <div className="flex h-full flex-col overflow-hidden rounded-[2.25rem] bg-[#fbfaf7]">
        <div className="flex items-center justify-between px-4 pt-10 pb-3">
          <div>
            <p className="font-titulo text-xl leading-none text-ora">{t.hoje.ola}</p>
            <p className="mt-1 text-[0.6rem] text-suave">{t.hoje.dia}</p>
          </div>
          <span className="flex items-center gap-1.5 rounded-full bg-ora px-2.5 py-1 text-[0.65rem] font-semibold text-creme tabular-nums">
            <span className="size-1.5 rounded-full bg-[#c99a4f]" />
            {pontos} {t.hoje.pontos}
          </span>
        </div>
        <div key={aba} className="entrada flex-1 overflow-y-auto px-3 pb-3">
          {aba === 'hoje' && <TelaHoje feitos={feitos} alternar={alternar} />}
          {aba === 'plano' && <TelaPlano />}
          {aba === 'desafios' && <TelaDesafios />}
          {aba === 'ranking' && <TelaRanking />}
          {aba === 'eu' && <TelaEu />}
        </div>
        <nav className="grid grid-cols-5 border-t border-linha bg-white px-1 pt-2 pb-4">
          {t.abas.map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => escolher(a.id)}
              aria-current={aba === a.id}
              className={`flex flex-col items-center gap-1 text-[0.6rem] font-semibold ${aba === a.id ? 'text-ora' : 'text-suave/70'}`}
            >
              <span
                className={`size-1.5 rounded-full ${aba === a.id ? 'bg-ora' : 'bg-transparent'}`}
              />
              {a.nome}
            </button>
          ))}
        </nav>
      </div>
    </div>
  )
}
