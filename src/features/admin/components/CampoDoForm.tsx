import type { FieldValues, Path, UseFormRegister } from 'react-hook-form'
import { Campo } from '@/components/ui'
import { CampoArea } from './CampoArea'

export type CampoDef<E> = {
  nome: Path<E & FieldValues>
  rotulo: string
  tipo?: 'texto' | 'area' | 'datahora' | 'link' | 'data' | 'numero' | 'escolha' | 'marcar'
  opcoes?: { valor: string; nome: string }[]
  sugestoes?: string[]
  /** Na janela: 'meia' divide a linha com outro campo; 'inteira' ocupa a linha. Texto longo é inteira por padrão. */
  largura?: 'meia' | 'inteira'
  /** Mostra o campo só quando a condição vale para o que já foi preenchido. */
  quando?: (valores: E) => boolean
  /** Texto de ajuda embaixo do campo. */
  ajuda?: string
  /** Mostra a prévia do vídeo do link digitado. */
  previaVideo?: boolean
}

const TIPO_INPUT = { datahora: 'datetime-local', data: 'date', numero: 'number' } as const

type Props<E extends FieldValues> = {
  campo: CampoDef<E>
  register: UseFormRegister<E>
  erro?: string
}

/** Um campo do formulário genérico, no tipo pedido. */
export function CampoDoForm<E extends FieldValues>({ campo: c, register, erro }: Props<E>) {
  const reg = register(c.nome as Path<E>)
  if (c.tipo === 'area') return <CampoArea rotulo={c.rotulo} erro={erro} {...reg} />
  if (c.tipo === 'marcar')
    return (
      <label className="flex min-h-12 items-center gap-3 text-sm font-medium">
        <input type="checkbox" className="size-5 accent-ora" {...reg} />
        {c.rotulo}
      </label>
    )
  if (c.tipo === 'escolha')
    return (
      <div className="flex flex-col gap-1 text-sm">
        <label htmlFor={c.nome} className="font-medium">
          {c.rotulo}
        </label>
        <select
          id={c.nome}
          className="min-h-12 rounded-xl border border-linha bg-white px-4 focus:border-ora focus:outline-none"
          {...reg}
        >
          {c.opcoes?.map((o) => (
            <option key={o.valor} value={o.valor}>
              {o.nome}
            </option>
          ))}
        </select>
      </div>
    )
  const lista = c.sugestoes ? `${c.nome}-sugestoes` : undefined
  return (
    <>
      <Campo
        rotulo={c.rotulo}
        type={
          c.tipo && c.tipo in TIPO_INPUT ? TIPO_INPUT[c.tipo as keyof typeof TIPO_INPUT] : 'text'
        }
        inputMode={c.tipo === 'link' ? 'url' : c.tipo === 'numero' ? 'numeric' : undefined}
        min={c.tipo === 'numero' ? 0 : undefined}
        list={lista}
        erro={erro}
        {...reg}
      />
      {lista && (
        <datalist id={lista}>
          {c.sugestoes?.map((s) => (
            <option key={s} value={s} />
          ))}
        </datalist>
      )}
    </>
  )
}
