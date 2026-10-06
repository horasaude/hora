import { useId, useState, type FormEvent, type ReactNode } from 'react'
import { Campo, Janela } from '@/components/ui'
import { deCampoBrasilia, paraCampoBrasilia } from '@/lib/datas'
import type { Configuracoes } from '../api/modulos.api'
import { useSalvarConfiguracoes } from '../hooks/useModulos'
import { textos } from '../textos'
import { CampoDinheiro } from './CampoDinheiro'
import { ErroForm, RodapeForm } from './RodapeForm'

const t = textos.configuracoes
const PRECOS = ['pix', 'parcelado', 'recorrente'] as const

type Moldura = {
  titulo: string
  aoFechar: () => void
  aoSalvar: () => Promise<unknown>
  children: ReactNode
  valido?: boolean
}

/** Janela de editar configuração: formulário, erro e Cancelar e Salvar no rodapé; fecha ao salvar. */
export function JanelaSalvar({ titulo, aoFechar, aoSalvar, children, valido = true }: Moldura) {
  const id = useId()
  const [estado, setEstado] = useState<'parado' | 'salvando' | 'erro'>('parado')
  const enviar = async (e: FormEvent) => {
    e.preventDefault()
    if (!valido) return
    setEstado('salvando')
    try {
      await aoSalvar()
      aoFechar()
    } catch {
      setEstado('erro')
    }
  }
  return (
    <Janela
      titulo={titulo}
      aoFechar={aoFechar}
      rotuloFechar={textos.fechar}
      rodape={<RodapeForm formId={id} salvando={estado === 'salvando'} aoCancelar={aoFechar} />}
    >
      <form id={id} onSubmit={enviar} noValidate className="flex flex-col gap-4">
        {children}
        <ErroForm mensagem={estado === 'erro' ? textos.erroSalvar : undefined} />
      </form>
    </Janela>
  )
}

type Edicao = { config: Configuracoes; aoFechar: () => void }

/** Preços cheios e da oferta, em reais. */
export function FormPrecos({ config, aoFechar }: Edicao) {
  const salvar = useSalvarConfiguracoes()
  const [v, setV] = useState(() => ({ ...config }))
  const rotulo = { pix: t.pix, parcelado: t.parcelado, recorrente: t.recorrente }
  const valido = PRECOS.every((p) => v[`${p}_cheio`] > 0 && v[`${p}_oferta`] > 0)
  return (
    <JanelaSalvar
      titulo={t.itens.precos}
      aoFechar={aoFechar}
      valido={valido}
      aoSalvar={() =>
        salvar.mutateAsync(
          Object.fromEntries(
            PRECOS.flatMap((p) => [
              [`${p}_cheio`, v[`${p}_cheio`]],
              [`${p}_oferta`, v[`${p}_oferta`]],
            ]),
          ),
        )
      }
    >
      <div className="grid gap-6 sm:grid-cols-2">
        {(['cheio', 'oferta'] as const).map((grupo) => (
          <fieldset key={grupo} className="flex flex-col gap-3">
            <legend className="mb-1 text-[0.7rem] font-semibold tracking-[0.14em] text-suave uppercase">
              {grupo === 'cheio' ? t.cheio : t.oferta}
            </legend>
            {PRECOS.map((p) => (
              <CampoDinheiro
                key={p}
                rotulo={rotulo[p]}
                valor={v[`${p}_${grupo}`]}
                aoMudar={(c) => setV((x) => ({ ...x, [`${p}_${grupo}`]: c }))}
                erro={v[`${p}_${grupo}`] > 0 ? undefined : t.erros.valor}
              />
            ))}
          </fieldset>
        ))}
      </div>
    </JanelaSalvar>
  )
}

/** Começo e fim da oferta do ORA, no horário de Brasília. */
export function FormOferta({ config, aoFechar }: Edicao) {
  const salvar = useSalvarConfiguracoes()
  const [inicio, setInicio] = useState(() => paraCampoBrasilia(new Date(config.oferta_inicio)))
  const [fim, setFim] = useState(() => paraCampoBrasilia(new Date(config.oferta_fim)))
  const a = deCampoBrasilia(inicio)
  const b = deCampoBrasilia(fim)
  const valido = Boolean(a && b && b > a)
  return (
    <JanelaSalvar
      titulo={t.itens.oferta}
      aoFechar={aoFechar}
      valido={valido}
      aoSalvar={() =>
        salvar.mutateAsync({ oferta_inicio: a?.toISOString(), oferta_fim: b?.toISOString() })
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Campo
          rotulo={t.inicio}
          name="oferta_inicio"
          type="datetime-local"
          value={inicio}
          onChange={(e) => setInicio(e.target.value)}
        />
        <Campo
          rotulo={t.fim}
          name="oferta_fim"
          type="datetime-local"
          value={fim}
          onChange={(e) => setFim(e.target.value)}
          erro={valido ? undefined : t.erros.fim}
        />
      </div>
    </JanelaSalvar>
  )
}
