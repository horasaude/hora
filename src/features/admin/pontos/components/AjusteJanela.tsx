import { useId, useState } from 'react'
import { Campo, Janela } from '@/components/ui'
import { CampoArea } from '../../components/CampoArea'
import { RodapeForm } from '../../components/RodapeForm'
import { lancarAjuste } from '../api/pontos.api'
import { useAcaoPontos, useAlunasSimples } from '../hooks/usePontos'
import { t } from '../textos'

const h = t.historico
type Valores = { perfil: string; sinal: 1 | -1; qtd: string; motivo: string }

function Campos({ v, mudar }: { v: Valores; mudar: (p: Partial<Valores>) => void }) {
  const alunas = useAlunasSimples().data ?? []
  return (
    <>
      <label className="flex flex-col gap-1 text-sm sm:col-span-2">
        <span className="font-medium">{h.aluna}</span>
        <select
          className="min-h-12 rounded-xl border border-linha bg-white px-4"
          value={v.perfil}
          onChange={(e) => mudar({ perfil: e.target.value })}
        >
          <option value="" />
          {alunas.map((a) => (
            <option key={a.id} value={a.id}>
              {a.nome}
              {a.apelido ? ` (${a.apelido})` : ''}
            </option>
          ))}
        </select>
      </label>
      <fieldset className="flex items-end gap-2">
        {([1, -1] as const).map((s) => (
          <label
            key={s}
            className={`flex min-h-10 cursor-pointer items-center rounded-full px-4 text-[13px] font-bold ${v.sinal === s ? (s === 1 ? 'brilho brilho-verde' : 'brilho brilho-coral') : 'border border-[#ECEFED] bg-white text-suave'}`}
          >
            <input
              type="radio"
              name="sinal"
              className="sr-only"
              checked={v.sinal === s}
              onChange={() => mudar({ sinal: s })}
            />
            {s === 1 ? h.dar : h.tirar}
          </label>
        ))}
      </fieldset>
      <Campo
        rotulo={h.quantidade}
        type="number"
        min={1}
        value={v.qtd}
        onChange={(e) => mudar({ qtd: e.target.value })}
      />
      <div className="sm:col-span-2">
        <CampoArea
          rotulo={h.motivo}
          rows={3}
          value={v.motivo}
          onChange={(e) => mudar({ motivo: e.target.value })}
        />
      </div>
    </>
  )
}

/** Lançar ajuste: dar ou tirar pontos de uma aluna, sempre com motivo. */
export function AjusteJanela({ aoFechar }: { aoFechar: () => void }) {
  const id = useId()
  const lancar = useAcaoPontos(lancarAjuste)
  const [v, setV] = useState<Valores>({ perfil: '', sinal: 1, qtd: '', motivo: '' })
  const [erro, setErro] = useState('')
  const enviar = async (e: React.FormEvent) => {
    e.preventDefault()
    const n = Number(v.qtd)
    if (!v.perfil || !Number.isInteger(n) || n < 1 || n > 10000 || !v.motivo.trim())
      return setErro(h.erroAjuste)
    try {
      await lancar.mutateAsync({ perfil: v.perfil, pontos: v.sinal * n, motivo: v.motivo.trim() })
      aoFechar()
    } catch {
      setErro(t.erro)
    }
  }
  return (
    <Janela
      titulo={h.ajuste}
      aoFechar={aoFechar}
      rotuloFechar={t.fechar}
      rodape={<RodapeForm formId={id} salvando={lancar.isPending} aoCancelar={aoFechar} />}
    >
      <form id={id} onSubmit={enviar} noValidate className="grid gap-4 sm:grid-cols-2">
        <Campos v={v} mudar={(p) => setV((x) => ({ ...x, ...p }))} />
        {erro && (
          <p role="alert" className="text-sm text-terracota-escuro sm:col-span-2">
            {erro}
          </p>
        )}
      </form>
    </Janela>
  )
}
