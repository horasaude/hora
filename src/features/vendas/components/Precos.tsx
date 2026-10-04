import { lazy, Suspense, useState } from 'react'
import {
  precosVigentes,
  tempoRestanteOferta,
  type Plano,
  type TempoRestante,
} from '@/domain/precos'
import { useAgora } from '../hooks/useAgora'
import { textos } from '../textos'
import { opcoesDePreco, type OpcaoPreco } from './opcoes'
import { Secao } from './Secao'

const Cadastro = lazy(() => import('./Cadastro').then((m) => ({ default: m.Cadastro })))

const t = textos.precos

function Contagem({ tempo }: { tempo: TempoRestante }) {
  const partes = [
    [tempo.dias, t.unidades.dias],
    [tempo.horas, t.unidades.horas],
    [tempo.minutos, t.unidades.minutos],
    [tempo.segundos, t.unidades.segundos],
  ] as const
  return (
    <div className="rounded-lg border border-terracota/40 bg-white p-4">
      <p className="text-sm font-semibold text-terracota">{t.selo}</p>
      <p className="mt-1 text-sm text-suave">{t.terminaEm}</p>
      <div className="mt-2 grid grid-cols-4 gap-2 text-center" role="timer" aria-live="off">
        {partes.map(([valor, unidade]) => (
          <div key={unidade}>
            <p className="font-titulo text-3xl text-ora tabular-nums">
              {String(valor).padStart(2, '0')}
            </p>
            <p className="text-xs text-suave">{unidade}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function ListaPrecos({ opcoes }: { opcoes: OpcaoPreco[] }) {
  return (
    <ul className="flex flex-col gap-3">
      {opcoes.map((o, i) => (
        <li
          key={o.plano}
          className={`rounded-lg bg-white p-5 ${i === 0 ? 'border-2 border-ora' : 'border border-linha'}`}
        >
          <p className="font-titulo text-3xl text-ora">{o.valor}</p>
          <p className="mt-1 text-suave">{o.rotulo}</p>
        </li>
      ))}
    </ul>
  )
}

function ProximaEtapa({ opcao }: { opcao: OpcaoPreco }) {
  return (
    <div role="status" className="flex flex-col gap-4 rounded-lg border-2 border-ora bg-white p-5">
      <p className="font-titulo text-2xl text-ora">{textos.cadastro.feito}</p>
      <p className="text-tinta">{textos.cadastro.escolheu(`${opcao.valor} ${opcao.rotulo}`)}</p>
      <button
        type="button"
        disabled
        className="min-h-12 rounded-lg bg-ora px-6 font-semibold text-white disabled:opacity-60"
      >
        {t.botao}
      </button>
    </div>
  )
}

export function Precos() {
  const agora = useAgora()
  const p = precosVigentes(agora)
  const tempo = tempoRestanteOferta(agora)
  const opcoes = opcoesDePreco(p)
  const [plano, setPlano] = useState<Plano | null>(null)
  const escolhida = opcoes.find((o) => o.plano === plano)
  return (
    <Secao id="precos" titulo={t.titulo} fundo="areia">
      <div className="flex flex-col gap-4">
        {p.emOferta && tempo && <Contagem tempo={tempo} />}
        <p className="font-semibold text-tinta">{t.acesso(p.mesesAcesso)}</p>
        {escolhida ? (
          <ProximaEtapa opcao={escolhida} />
        ) : (
          <Suspense fallback={<ListaPrecos opcoes={opcoes} />}>
            <Cadastro opcoes={opcoes} onCadastrado={setPlano} />
          </Suspense>
        )}
      </div>
    </Secao>
  )
}
