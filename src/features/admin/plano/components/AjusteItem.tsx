import { Campo } from '@/components/ui'
import { montar, rotuloOpcao, type MedidaEscolhida } from '../opcoes'
import { textos } from '../textos'
import { tEscolher as t } from '../textos2'
import type { Escolhido } from './Resultados'

/** Ajuste do escolhido: medida caseira (ou gramas, ou porção) e quantidade, com a prévia. */
export function Ajuste({
  e,
  medida,
  setMedida,
  qtd,
  setQtd,
}: {
  e: Escolhido
  medida: MedidaEscolhida
  setMedida: (m: MedidaEscolhida) => void
  qtd: string
  setQtd: (q: string) => void
}) {
  const o = montar(e, medida, Number(qtd.replace(',', '.')) || 0)
  return (
    <div className="flex flex-col gap-4 rounded-xl bg-[#F8FAF9] p-4">
      <p className="text-[15px] font-bold text-verde-escuro">{o.nome}</p>
      {e.tipo === 'alimento' && (
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">{t.medida}</span>
          <select
            className="min-h-12 rounded-xl border border-linha bg-white px-4"
            value={medida?.nome ?? ''}
            onChange={(ev) => {
              const m = e.a.medidas_caseiras.find((x) => x.nome === ev.target.value)
              setMedida(m ? { nome: m.nome, gramas: m.gramas } : null)
              setQtd(m ? '1' : '100')
            }}
          >
            <option value="">{t.gramas}</option>
            {e.a.medidas_caseiras.map((m) => (
              <option key={m.id} value={m.nome}>{`${m.nome} (${m.gramas} g)`}</option>
            ))}
          </select>
        </label>
      )}
      <Campo
        rotulo={e.tipo === 'receita' ? `${t.quantidade} (${t.porcao})` : t.quantidade}
        inputMode="decimal"
        value={qtd}
        onChange={(ev) => setQtd(ev.target.value)}
      />
      <p className="text-[13px] text-[#40504B]">
        {rotuloOpcao(o)} · <b>{textos.kcal(o.nutrientes.kcal)}</b> · P{' '}
        {Math.round(o.nutrientes.proteina)} g · C {Math.round(o.nutrientes.carboidrato)} g · G{' '}
        {Math.round(o.nutrientes.gordura)} g
      </p>
    </div>
  )
}
