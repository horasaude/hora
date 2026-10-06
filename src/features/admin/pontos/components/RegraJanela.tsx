import { useId, useState } from 'react'
import { Campo, Janela } from '@/components/ui'
import { RodapeForm } from '../../components/RodapeForm'
import { salvarRegra, type Regra } from '../api/pontos.api'
import { useAcaoPontos } from '../hooks/usePontos'
import { t } from '../textos'

type Valores = { pontos: string; tipo: string; qtd: string; ativo: boolean }

function Campos({
  v,
  mudar,
  nome,
}: {
  v: Valores
  mudar: (p: Partial<Valores>) => void
  nome: string
}) {
  return (
    <>
      <Campo
        rotulo={t.regras.pontos}
        type="number"
        min={0}
        value={v.pontos}
        onChange={(e) => mudar({ pontos: e.target.value })}
      />
      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium">{t.regras.limiteTipo}</span>
        <select
          className="min-h-12 rounded-xl border border-linha bg-white px-4"
          value={v.tipo}
          onChange={(e) => mudar({ tipo: e.target.value })}
        >
          {Object.entries(t.regras.tipos).map(([valor, n]) => (
            <option key={valor} value={valor}>
              {n}
            </option>
          ))}
        </select>
      </label>
      {v.tipo === 'por_dia' && (
        <Campo
          rotulo={t.regras.qtd}
          type="number"
          min={1}
          max={50}
          value={v.qtd}
          onChange={(e) => mudar({ qtd: e.target.value })}
        />
      )}
      <label className="flex items-center gap-3 text-sm font-medium sm:col-span-3">
        <input
          type="checkbox"
          className="size-5 accent-ora"
          checked={v.ativo}
          onChange={(e) => mudar({ ativo: e.target.checked })}
        />
        {t.regras.ativa(nome)}
      </label>
    </>
  )
}

/** Janela de editar regra: pontos, limite e se está ativa. Vale para os próximos lançamentos. */
export function RegraJanela({ regra, aoFechar }: { regra: Regra; aoFechar: () => void }) {
  const id = useId()
  const salvar = useAcaoPontos(salvarRegra)
  const [v, setV] = useState<Valores>({
    pontos: String(regra.pontos),
    tipo: regra.limite_tipo,
    qtd: String(regra.limite_qtd ?? 1),
    ativo: regra.ativo,
  })
  const [erro, setErro] = useState('')
  const enviar = async (e: React.FormEvent) => {
    e.preventDefault()
    const p = Number(v.pontos)
    const q = Number(v.qtd)
    const qtdOk = v.tipo !== 'por_dia' || (Number.isInteger(q) && q >= 1 && q <= 50)
    if (!Number.isInteger(p) || p < 0 || p > 10000 || !qtdOk) return setErro(t.regras.erro)
    try {
      await salvar.mutateAsync({
        acao: regra.acao,
        pontos: p,
        limite_tipo: v.tipo,
        limite_qtd: v.tipo === 'por_dia' ? q : null,
        ativo: v.ativo,
      })
      aoFechar()
    } catch {
      setErro(t.erro)
    }
  }
  return (
    <Janela
      titulo={`${t.regras.editar}: ${regra.nome}`}
      aoFechar={aoFechar}
      rotuloFechar={t.fechar}
      rodape={<RodapeForm formId={id} salvando={salvar.isPending} aoCancelar={aoFechar} />}
    >
      <form id={id} onSubmit={enviar} noValidate className="grid gap-4 sm:grid-cols-3">
        <Campos v={v} mudar={(p) => setV((x) => ({ ...x, ...p }))} nome={regra.nome} />
        {erro && (
          <p role="alert" className="text-sm text-terracota-escuro sm:col-span-3">
            {erro}
          </p>
        )}
      </form>
    </Janela>
  )
}
