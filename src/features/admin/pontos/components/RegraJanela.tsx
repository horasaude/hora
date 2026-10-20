import { useId, useState } from 'react'
import { BotaoBrilho, Janela } from '@/components/ui'
import { RodapeForm } from '../../components/RodapeForm'
import { criarAcao, excluirRegra, salvarRegra, type Regra } from '../api/pontos.api'
import { useConfiguracoes, useSalvarConfiguracoes } from '../../hooks/useModulos'
import { useAcaoPontos } from '../hooks/usePontos'
import { t } from '../textos'
import { metaAguaValida } from '@/domain/agua'
import { CampoMetaAgua } from './MetaAgua'
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

/** Meta de água (configurações) editada junto com a regra Água. */
function useMetaAgua() {
  const config = useConfiguracoes().data
  const salvarConfig = useSalvarConfiguracoes()
  const [meta, setMeta] = useState<string | null>(null)
  const valor = meta ?? String(config?.agua_meta_ml ?? 2000)
  return {
    valor,
    mudar: setMeta,
    salvando: salvarConfig.isPending,
    salvar: async () => {
      if (Number(valor) !== config?.agua_meta_ml)
        await salvarConfig.mutateAsync({ agua_meta_ml: Number(valor) })
    },
  }
}

/** Excluir em dois toques: o primeiro pede a confirmação. */
function BotaoExcluir({ acao, aoExcluir }: { acao: string; aoExcluir: () => void }) {
  const excluir = useAcaoPontos(excluirRegra)
  const [confirmar, setConfirmar] = useState(false)
  return (
    <BotaoBrilho
      tom="coral"
      className="mr-auto"
      disabled={excluir.isPending}
      onClick={() =>
        confirmar ? excluir.mutate(acao, { onSuccess: aoExcluir }) : setConfirmar(true)
      }
    >
      {confirmar ? t.regras.confirmarExcluir : t.regras.excluir}
    </BotaoBrilho>
  )
}

/** Janela de criar ação própria ou editar regra (com Excluir). Vale para os próximos lançamentos. */
export function RegraJanela({ regra, aoFechar }: { regra: Regra | null; aoFechar: () => void }) {
  const id = useId()
  const salvar = useAcaoPontos(salvarRegra)
  const criar = useAcaoPontos(criarAcao)
  const propria = regra === null || regra.propria
  const [v, setV] = useState<Valores>(inicial(regra))
  const [erro, setErro] = useState('')
  const agua = regra?.acao === 'agua'
  const m = useMetaAgua()
  const salvando = salvar.isPending || criar.isPending || m.salvando
  const enviar = async (e: React.FormEvent) => {
    e.preventDefault()
    const d = validar(v, propria)
    if (typeof d === 'string') return setErro(d)
    if (agua && !metaAguaValida(m.valor)) return setErro(t.agua.invalido)
    try {
      if (agua) await m.salvar()
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
        <>
          {regra && <BotaoExcluir acao={regra.acao} aoExcluir={aoFechar} />}
          <RodapeForm formId={id} salvando={salvando} aoCancelar={aoFechar} />
        </>
      }
    >
      <form id={id} onSubmit={enviar} noValidate className="grid gap-4 sm:grid-cols-3">
        <Campos
          v={v}
          mudar={(p) => setV((x) => ({ ...x, ...p }))}
          propria={propria}
          nova={!regra}
        />
        {agua && <CampoMetaAgua valor={m.valor} mudar={m.mudar} />}
        {erro && (
          <p role="alert" className="text-sm text-terracota-escuro sm:col-span-3">
            {erro}
          </p>
        )}
      </form>
    </Janela>
  )
}
