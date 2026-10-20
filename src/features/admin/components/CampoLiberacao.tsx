import { useId } from 'react'
import { Campo } from '@/components/ui'
import { modoDe, type Liberacao, type ModoLiberacao } from '@/domain/liberacao'
import { formatarDataHora } from '@/lib/datas'
import { liberacao as t } from '../textos/liberacao'
import { Etiqueta } from './Tabela'

export type ValorLiberacao = { modo: ModoLiberacao; quando: string }

const MODOS: ModoLiberacao[] = ['aberta', 'breve', 'data']

/** Disponível, Em breve (cadeado para a aluna) ou Liberar em data e hora de Brasília. */
export function CampoLiberacao({
  valor,
  aoMudar,
  erro,
}: {
  valor: ValorLiberacao
  aoMudar: (v: ValorLiberacao) => void
  erro?: string
}) {
  const id = useId()
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="mb-1 text-sm font-medium">{t.titulo}</legend>
      <div className="flex flex-wrap gap-2">
        {MODOS.map((m) => (
          <button
            key={m}
            type="button"
            aria-pressed={valor.modo === m}
            onClick={() => aoMudar({ ...valor, modo: m })}
            className={`min-h-10 rounded-full px-4 text-[13px] font-bold ${valor.modo === m ? 'brilho brilho-verde' : 'border border-linha bg-white text-suave'}`}
          >
            {t.modos[m]}
          </button>
        ))}
      </div>
      {valor.modo === 'data' && (
        <Campo
          id={id}
          rotulo={t.quando}
          type="datetime-local"
          value={valor.quando}
          erro={erro}
          onChange={(e) => aoMudar({ ...valor, quando: e.target.value })}
        />
      )}
    </fieldset>
  )
}

/** Etiqueta da lista: Em breve ou a data de liberação; nada quando já está disponível. */
export function EtiquetaLiberacao({ l }: { l: Liberacao }) {
  const modo = modoDe(l)
  if (modo === 'breve') return <Etiqueta tom="rosa">{t.emBreve}</Etiqueta>
  if (modo === 'data' && l.libera_em)
    return <Etiqueta tom="ocre">{t.liberaEm(formatarDataHora(new Date(l.libera_em)))}</Etiqueta>
  return null
}
