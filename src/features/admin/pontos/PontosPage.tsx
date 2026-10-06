import { useSearchParams } from 'react-router-dom'
import { Quadro } from '../components/Quadro'
import { AbaFotos } from './components/AbaFotos'
import { AbaHistorico } from './components/AbaHistorico'
import { AbaIndicacoes } from './components/AbaIndicacoes'
import { AbaRegras } from './components/AbaRegras'
import { useResumoPontos } from './hooks/usePontos'
import { t } from './textos'

const ABAS = ['regras', 'historico', 'fotos', 'indicacoes'] as const
type Aba = (typeof ABAS)[number]
const CONTEUDO: Record<Aba, () => React.ReactNode> = {
  regras: () => <AbaRegras />,
  historico: () => <AbaHistorico />,
  fotos: () => <AbaFotos />,
  indicacoes: () => <AbaIndicacoes />,
}

/** Pontos e indicações: resumo do mês e as abas Regras, Histórico, Fotos de treino e Indicações. */
export function PontosPage() {
  const [busca, setBusca] = useSearchParams()
  const aba: Aba = ABAS.find((a) => a === busca.get('aba')) ?? 'regras'
  const r = useResumoPontos().data
  const valor = (n?: number) => (n === undefined ? '-' : n.toLocaleString('pt-BR'))
  return (
    <Quadro
      titulo={t.titulo}
      numeros={[
        { valor: valor(r?.pontos_mes), rotulo: t.cartoes.pontos, tom: 'salvia' },
        { valor: valor(r?.checkins_hoje), rotulo: t.cartoes.checkins, tom: 'salvia' },
        { valor: valor(r?.indicacoes_mes), rotulo: t.cartoes.indicacoes, tom: 'ocre' },
        { valor: valor(r?.fotos_denunciadas), rotulo: t.cartoes.denunciadas, tom: 'terracota' },
      ]}
    >
      <div role="tablist" aria-label={t.titulo} className="flex flex-wrap gap-1.5">
        {ABAS.map((a) => (
          <button
            key={a}
            type="button"
            role="tab"
            aria-selected={aba === a}
            onClick={() => setBusca({ aba: a }, { replace: true })}
            className={`min-h-9 rounded-full px-4 text-[13px] font-bold ${aba === a ? 'brilho brilho-verde' : 'border border-[#ECEFED] bg-white text-suave hover:bg-trilho'}`}
          >
            {t.abas[a]}
          </button>
        ))}
      </div>
      {CONTEUDO[aba]()}
    </Quadro>
  )
}
