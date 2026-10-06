import { useState, type FormEvent, type ReactNode } from 'react'
import { BotaoBrilho, Campo } from '@/components/ui'
import { deCampoBrasilia, paraCampoBrasilia } from '@/lib/datas'
import type { Configuracoes } from '../api/modulos.api'
import { useSalvarConfiguracoes } from '../hooks/useModulos'
import { textos } from '../textos'
import { CampoDinheiro } from './CampoDinheiro'

const t = textos.configuracoes
const PRECOS = ['pix', 'parcelado', 'recorrente'] as const

/** Moldura de salvar: botão, erro e o aviso de salvo. */
export function Salvar({
  aoSalvar,
  children,
  valido = true,
}: {
  aoSalvar: () => Promise<void>
  children: ReactNode
  valido?: boolean
}) {
  const [estado, setEstado] = useState<'parado' | 'salvando' | 'salvo' | 'erro'>('parado')
  const enviar = async (e: FormEvent) => {
    e.preventDefault()
    if (!valido) return
    setEstado('salvando')
    try {
      await aoSalvar()
      setEstado('salvo')
    } catch {
      setEstado('erro')
    }
  }
  return (
    <form onSubmit={enviar} noValidate className="flex flex-col gap-4">
      {children}
      {estado === 'erro' && (
        <p role="alert" className="text-sm text-terracota-escuro">
          {textos.erroSalvar}
        </p>
      )}
      {estado === 'salvo' && (
        <p role="status" className="text-sm text-ora">
          {t.salvo}
        </p>
      )}
      <BotaoBrilho type="submit" disabled={estado === 'salvando'} className="self-start">
        {estado === 'salvando' ? textos.salvando : textos.salvar}
      </BotaoBrilho>
    </form>
  )
}

/** Preços cheios e da oferta, em reais. */
export function FormPrecos({ config }: { config: Configuracoes }) {
  const salvar = useSalvarConfiguracoes()
  const [v, setV] = useState(() => ({ ...config }))
  const rotulo = { pix: t.pix, parcelado: t.parcelado, recorrente: t.recorrente }
  const valido = PRECOS.every((p) => v[`${p}_cheio`] > 0 && v[`${p}_oferta`] > 0)
  return (
    <Salvar
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
    </Salvar>
  )
}

/** Começo e fim da oferta do ORA, no horário de Brasília. */
export function FormOferta({ config }: { config: Configuracoes }) {
  const salvar = useSalvarConfiguracoes()
  const [inicio, setInicio] = useState(() => paraCampoBrasilia(new Date(config.oferta_inicio)))
  const [fim, setFim] = useState(() => paraCampoBrasilia(new Date(config.oferta_fim)))
  const a = deCampoBrasilia(inicio)
  const b = deCampoBrasilia(fim)
  const valido = Boolean(a && b && b > a)
  return (
    <Salvar
      valido={valido}
      aoSalvar={() =>
        salvar.mutateAsync({ oferta_inicio: a?.toISOString(), oferta_fim: b?.toISOString() })
      }
    >
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
    </Salvar>
  )
}
