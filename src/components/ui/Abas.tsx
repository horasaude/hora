import { classeBrilho } from './estiloBrilho'

type Props<T extends string> = {
  opcoes: readonly { id: T; nome: string }[]
  ativa: T
  aoEscolher: (id: T) => void
  rotulo: string
}

/** Abas em pílulas de vidro: a escolhida fica verde, as outras cinza. */
export function Abas<T extends string>({ opcoes, ativa, aoEscolher, rotulo }: Props<T>) {
  return (
    <div role="tablist" aria-label={rotulo} className="flex flex-wrap gap-2">
      {opcoes.map((o) => (
        <button
          key={o.id}
          type="button"
          role="tab"
          aria-selected={o.id === ativa}
          onClick={() => aoEscolher(o.id)}
          className={`${classeBrilho(o.id === ativa ? 'verde' : 'cinza', 'md')} min-w-20`}
        >
          {o.nome}
        </button>
      ))}
    </div>
  )
}

/** Abas discretas sublinhadas (dentro de uma tela que já tem pílulas no topo). */
export function AbasSublinhadas<T extends string>({ opcoes, ativa, aoEscolher, rotulo }: Props<T>) {
  return (
    <div role="tablist" aria-label={rotulo} className="flex gap-6 border-b border-linha">
      {opcoes.map((o) => (
        <button
          key={o.id}
          type="button"
          role="tab"
          aria-selected={o.id === ativa}
          onClick={() => aoEscolher(o.id)}
          className={`-mb-px min-h-10 border-b-2 text-[15px] transition ${o.id === ativa ? 'border-ora font-bold text-verde-escuro' : 'border-transparent text-suave hover:text-tinta'}`}
        >
          {o.nome}
        </button>
      ))}
    </div>
  )
}
