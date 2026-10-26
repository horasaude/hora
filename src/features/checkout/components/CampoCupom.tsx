import { useId, type KeyboardEvent } from 'react'
import { cupomVale, type Cupom } from '@/domain/cupom'
import type { Plano } from '@/domain/precos'
import { formatarPreco } from '@/lib/moeda'
import type { EstadoCupom } from '../hooks/useCupom'
import { textos } from '../textos'

type Props = {
  plano: Plano
  codigo: string
  digitar: (v: string) => void
  aplicado: Cupom | null
  estado: EstadoCupom
  aplicar: () => void
  remover: () => void
}

const t = textos.cupom

const desconto = (c: Cupom) => (c.tipo === 'porcentagem' ? `${c.valor}%` : formatarPreco(c.valor))

function Aplicado({ c, plano, remover }: { c: Cupom; plano: Plano; remover: () => void }) {
  const vale = cupomVale(c, plano)
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-ora/30 bg-white px-4 py-3">
      <p className={`text-sm ${vale ? 'font-semibold text-ora' : 'text-terracota-escuro'}`}>
        {vale ? t.aplicado(c.codigo, desconto(c)) : t.naoVale}
      </p>
      <button
        type="button"
        onClick={remover}
        className="min-h-9 shrink-0 rounded-full border border-linha px-4 text-xs font-semibold text-suave hover:bg-creme"
      >
        {t.remover}
      </button>
    </div>
  )
}

/** Cupom de desconto: digita e aplica; o valor dos planos já muda com ele. */
export function CampoCupom({ plano, codigo, digitar, aplicado, estado, aplicar, remover }: Props) {
  const id = useId()
  if (aplicado) return <Aplicado c={aplicado} plano={plano} remover={remover} />
  const erro = estado === 'invalido' ? t.invalido : estado === 'falha' ? t.falha : null
  const enter = (e: KeyboardEvent) => {
    if (e.key !== 'Enter') return
    e.preventDefault()
    aplicar()
  }
  return (
    <div className="flex flex-col gap-1 text-sm">
      <label htmlFor={id} className="font-medium">
        {t.rotulo}
      </label>
      <div className="flex gap-2">
        <input
          id={id}
          value={codigo}
          onChange={(e) => digitar(e.target.value)}
          onKeyDown={enter}
          placeholder={t.exemplo}
          autoCapitalize="characters"
          autoComplete="off"
          aria-invalid={Boolean(erro)}
          aria-describedby={erro ? `${id}-erro` : undefined}
          className="min-h-12 min-w-0 flex-1 rounded-xl border border-linha bg-white px-4 uppercase placeholder:text-suave placeholder:normal-case focus:border-ora focus:outline-none"
        />
        <button
          type="button"
          onClick={aplicar}
          disabled={estado === 'buscando' || !codigo}
          className="min-h-12 shrink-0 rounded-xl border border-ora px-5 text-sm font-semibold text-ora hover:bg-ora hover:text-creme disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-ora"
        >
          {estado === 'buscando' ? t.buscando : t.aplicar}
        </button>
      </div>
      {erro && (
        <span id={`${id}-erro`} role="alert" className="text-terracota-escuro">
          {erro}
        </span>
      )}
    </div>
  )
}
