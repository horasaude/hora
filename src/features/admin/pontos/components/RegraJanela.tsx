import { useId, useState } from 'react'
import { Janela } from '@/components/ui'
import { RodapeForm } from '../../components/RodapeForm'
import { criarAcao, salvarRegra, type Regra } from '../api/pontos.api'
import { useAcaoPontos } from '../hooks/usePontos'
import { t } from '../textos'
import { Campos, type Valores } from './RegraCampos'

const inicial = (r: Regra | null): Valores => ({
  nome: r?.nome ?? '',
  pontos: String(r?.pontos ?? 10),
  tipo: r?.limite_tipo ?? 'por_dia',
  qtd: String(r?.limite_qtd ?? 1),
  ativo: r?.ativo ?? true,
})

/** Validação dos campos; volta a mensagem de erro ou os valores prontos para salvar. */
function validar(v: Valores, propria: boolean) {
  const p = Number(v.pontos)
  const q = Number(v.qtd)
  const nome = v.nome.trim()
  if (propria && (nome.length < 1 || nome.length > 80)) return t.regras.erroNome
  const qtdOk = v.tipo !== 'por_dia' || (Number.isInteger(q) && q >= 1 && q <= 50)
  if (!Number.isInteger(p) || p < 0 || p > 10000 || !qtdOk) return t.regras.erro
  return { nome, pontos: p, limite_tipo: v.tipo, limite_qtd: v.tipo === 'por_dia' ? q : null }
}

/** Janela de criar ação própria ou editar regra. Vale para os próximos lançamentos. */
export function RegraJanela({ regra, aoFechar }: { regra: Regra | null; aoFechar: () => void }) {
  const id = useId()
  const salvar = useAcaoPontos(salvarRegra)
  const criar = useAcaoPontos(criarAcao)
  const propria = regra === null || regra.propria
  const [v, setV] = useState<Valores>(inicial(regra))
  const [erro, setErro] = useState('')
  const enviar = async (e: React.FormEvent) => {
    e.preventDefault()
    const d = validar(v, propria)
    if (typeof d === 'string') return setErro(d)
    try {
      if (regra === null) await criar.mutateAsync(d)
      else
        await salvar.mutateAsync({
          ...d,
          acao: regra.acao,
          ativo: v.ativo,
          nome: propria ? d.nome : undefined,
        })
      aoFechar()
    } catch {
      setErro(t.erro)
    }
  }
  return (
    <Janela
      titulo={regra ? `${t.regras.editar}: ${regra.nome}` : t.regras.nova}
      aoFechar={aoFechar}
      rotuloFechar={t.fechar}
      rodape={
        <RodapeForm
          formId={id}
          salvando={salvar.isPending || criar.isPending}
          aoCancelar={aoFechar}
        />
      }
    >
      <form id={id} onSubmit={enviar} noValidate className="grid gap-4 sm:grid-cols-3">
        <Campos
          v={v}
          mudar={(p) => setV((x) => ({ ...x, ...p }))}
          propria={propria}
          nova={!regra}
        />
        {erro && (
          <p role="alert" className="text-sm text-terracota-escuro sm:col-span-3">
            {erro}
          </p>
        )}
      </form>
    </Janela>
  )
}
