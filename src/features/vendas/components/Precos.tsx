import { precosVigentes, tempoRestanteOferta, type TempoRestante } from '@/domain/precos'
import { formatarPreco } from '@/lib/moeda'
import { useAgora } from '../hooks/useAgora'
import { textos } from '../textos'
import { Secao } from './Secao'

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

function Opcao({ valor, rotulo, destaque }: { valor: string; rotulo: string; destaque?: boolean }) {
  return (
    <li
      className={`rounded-lg bg-white p-5 ${destaque ? 'border-2 border-ora' : 'border border-linha'}`}
    >
      <p className="font-titulo text-3xl text-ora">{valor}</p>
      <p className="mt-1 text-suave">{rotulo}</p>
    </li>
  )
}

export function Precos() {
  const agora = useAgora()
  const p = precosVigentes(agora)
  const tempo = tempoRestanteOferta(agora)
  return (
    <Secao id="precos" titulo={t.titulo} fundo="areia">
      <div className="flex flex-col gap-4">
        {p.emOferta && tempo && <Contagem tempo={tempo} />}
        <ul className="flex flex-col gap-3">
          <Opcao valor={formatarPreco(p.pixCentavos)} rotulo={t.pix} destaque />
          <Opcao
            valor={`${t.vezes(p.parcelas)} ${formatarPreco(p.parceladoCentavos)}`}
            rotulo={t.parcelado}
          />
          <Opcao
            valor={`${t.vezes(p.parcelas)} ${formatarPreco(p.recorrenteCentavos)}`}
            rotulo={t.recorrente}
          />
        </ul>
        <p className="font-semibold text-tinta">{t.acesso(p.mesesAcesso)}</p>
        <button
          type="button"
          disabled
          className="min-h-12 rounded-lg bg-ora px-6 font-semibold text-white disabled:opacity-60"
        >
          {t.botao}
        </button>
      </div>
    </Secao>
  )
}
