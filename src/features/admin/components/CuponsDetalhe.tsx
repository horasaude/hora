import { useState } from 'react'
import { BotaoBrilho, EtiquetaBrilho, type TomBrilho } from '@/components/ui'
import { PLANOS } from '@/domain/precos'
import { formatarDataHora } from '@/lib/datas'
import { formatarPreco } from '@/lib/moeda'
import { useCupons, useSalvarCupom } from '../hooks/useCupons'
import type { CupomLinha } from '../schemas/cupomForm'
import { cupons as t } from '../textos/cupons'
import { CartaoDetalhe } from './CartaoDetalhe'
import { CupomJanela } from './CupomJanela'
import { Estado } from './Estado'

function situacao(c: CupomLinha): [string, TomBrilho] {
  if (!c.ativo) return [t.desligado, 'cinza']
  if (c.valido_ate && new Date(c.valido_ate) < new Date()) return [t.vencido, 'coral']
  if (c.limite_usos && c.usos >= c.limite_usos) return [t.esgotado, 'coral']
  return [t.ligado, 'verde']
}

const desconto = (c: CupomLinha) =>
  c.tipo === 'porcentagem' ? `${c.valor}%` : formatarPreco(c.valor)

function Linha({ c, editar }: { c: CupomLinha; editar: () => void }) {
  const salvar = useSalvarCupom()
  const [rotulo, tom] = situacao(c)
  const planos = PLANOS.filter((p) => c.planos.includes(p)).map((p) => t.nomesPlanos[p])
  return (
    <li className="flex flex-col gap-3 rounded-2xl border border-[#ECEFED] p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 flex-col gap-1">
        <p className="flex flex-wrap items-center gap-2">
          <span className="font-bold tracking-wide text-verde-escuro">{c.codigo}</span>
          <EtiquetaBrilho tom="dourado">{desconto(c)}</EtiquetaBrilho>
          <EtiquetaBrilho tom={tom}>{rotulo}</EtiquetaBrilho>
        </p>
        <p className="text-[13px] text-suave">
          {[
            planos.join(', '),
            t.usos(c.usos, c.limite_usos),
            c.valido_ate ? t.ate(formatarDataHora(new Date(c.valido_ate))) : t.semPrazo,
          ].join(' · ')}
        </p>
      </div>
      <div className="flex shrink-0 gap-2">
        <BotaoBrilho onClick={editar}>{t.editar}</BotaoBrilho>
        <BotaoBrilho
          tom={c.ativo ? 'coral' : 'verde'}
          disabled={salvar.isPending}
          onClick={() => salvar.mutate({ id: c.id, linha: { ativo: !c.ativo } })}
        >
          {c.ativo ? t.desligar : t.ligar}
        </BotaoBrilho>
      </div>
    </li>
  )
}

type Aberto = { cupom: CupomLinha | null } | null

/** Lista dos cupons com criar, editar e ligar ou desligar. */
export function CuponsDetalhe() {
  const lista = useCupons()
  const [aberto, setAberto] = useState<Aberto>(null)
  const cupons = lista.data ?? []
  let corpo
  if (lista.isPending) corpo = <Estado tipo="carregando" />
  else if (lista.isError) corpo = <Estado tipo="erro" tentar={() => lista.refetch()} />
  else if (!cupons.length) corpo = <p className="text-[13px] text-suave">{t.vazio}</p>
  else
    corpo = (
      <ul className="flex flex-col gap-2">
        {cupons.map((c) => (
          <Linha key={c.id} c={c} editar={() => setAberto({ cupom: c })} />
        ))}
      </ul>
    )
  return (
    <CartaoDetalhe titulo={t.item}>
      <BotaoBrilho tom="dourado" className="self-start" onClick={() => setAberto({ cupom: null })}>
        {t.novo}
      </BotaoBrilho>
      {corpo}
      {aberto && (
        <CupomJanela
          cupom={aberto.cupom}
          codigos={cupons.map((c) => c.codigo)}
          aoFechar={() => setAberto(null)}
        />
      )}
    </CartaoDetalhe>
  )
}
