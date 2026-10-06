import { useEffect, useState } from 'react'
import { textos } from '../../textos'
import { Secao } from '../Secao'
import { Celular, type Aba } from './Celular'
import { cores, SEQUENCIA } from './cores'

const t = textos.app
const POSICOES = [
  '-top-2 -left-4 -rotate-6',
  'top-24 -right-6 rotate-3',
  'top-64 -left-8 rotate-2',
  'bottom-16 -right-4 -rotate-3',
]

/** Selos de pontos flutuando em volta do celular, como no documento do app. */
function Selos() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 hidden sm:block">
      {t.selos.map((s, i) => (
        <div
          key={s.texto}
          className={`flutuar absolute flex items-center gap-2 rounded-2xl px-3 py-2 shadow-lg ${POSICOES[i]} ${cores[SEQUENCIA[i % SEQUENCIA.length] ?? 'ora'].forte} text-white`}
          style={{ animationDelay: `${i * -1.5}s` }}
        >
          <span className="text-lg font-semibold">{s.pts}</span>
          <span className="text-xs leading-tight font-semibold">
            {s.texto}
            <small className="block font-normal opacity-75">{s.sub}</small>
          </span>
        </div>
      ))}
    </div>
  )
}

/** Troca de tela sozinha a cada 5 s até a pessoa tocar em algo. */
function useAbaAutomatica() {
  const [aba, setAba] = useState<Aba>('hoje')
  const [tocou, setTocou] = useState(false)
  useEffect(() => {
    if (tocou || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    const id = window.setInterval(() => {
      setAba((atual) => {
        const i = t.abas.findIndex((a) => a.id === atual)
        return t.abas[(i + 1) % t.abas.length]?.id ?? 'hoje'
      })
    }, 5000)
    return () => window.clearInterval(id)
  }, [tocou])
  const escolher = (a: Aba) => {
    setTocou(true)
    setAba(a)
  }
  return { aba, escolher }
}

export function PorDentroDoApp() {
  const { aba, escolher } = useAbaAutomatica()
  const atual = t.abas.find((a) => a.id === aba)
  return (
    <Secao cta={t.cta} etiqueta={t.etiqueta} titulo={t.titulo} fundo="branco">
      <div className="grid min-w-0 gap-10 lg:grid-cols-[auto_1fr] lg:items-center lg:gap-16">
        <div
          className="relative mx-auto w-full max-w-[300px] sm:max-w-none sm:px-6"
          onPointerDown={() => escolher(aba)}
        >
          <Selos />
          <Celular aba={aba} escolher={escolher} />
        </div>
        <div className="flex min-w-0 flex-col gap-5">
          <p className="text-lg text-tinta">{t.texto}</p>
          <p className="text-[0.7rem] font-semibold tracking-[0.18em] text-suave uppercase">
            {t.dica}
          </p>
          <div className="flex flex-wrap gap-2">
            {t.abas.map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => escolher(a.id)}
                className={`min-h-11 rounded-full border px-4 text-sm font-semibold transition ${aba === a.id ? 'border-ora bg-ora text-creme' : 'border-linha bg-white text-ora hover:border-ora'}`}
              >
                {a.nome}
              </button>
            ))}
          </div>
          <p key={aba} className="entrada rounded-[1.5rem] bg-creme p-5 text-tinta">
            {atual?.explica}
          </p>
        </div>
      </div>
    </Secao>
  )
}
