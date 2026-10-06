import { BotaoBrilho } from '@/components/ui'
import type { ListaCompras } from '@/domain/listaCompras'
import { tCardapios as t, tRefeicoes } from '../textos2'
import { Bloco } from './BarraTopo'

type Props = {
  lista: ListaCompras
  textoLivre: boolean
  aoGerar: () => void
  aoMudar: (l: ListaCompras) => void
}

const campo =
  'min-h-9 rounded-lg border border-linha bg-white px-3 text-[13px] focus:border-ora focus:outline-none'

type Linha = {
  nome: string
  quantidade: string
  aoMudar: (p: { nome?: string; quantidade?: string }) => void
  aoRemover: () => void
}

function LinhaLista({ nome, quantidade, aoMudar, aoRemover }: Linha) {
  return (
    <div className="flex gap-2">
      <input
        aria-label={t.item}
        className={`${campo} min-w-0 flex-1`}
        value={nome}
        onChange={(e) => aoMudar({ nome: e.target.value })}
      />
      <input
        aria-label={t.quantidade}
        className={`${campo} w-24`}
        value={quantidade}
        onChange={(e) => aoMudar({ quantidade: e.target.value })}
      />
      <button
        type="button"
        aria-label={tRefeicoes.removerItem(nome)}
        onClick={aoRemover}
        className="grid size-9 place-items-center rounded-full text-terracota-escuro hover:bg-trilho"
      >
        <svg viewBox="0 0 16 16" aria-hidden className="size-3.5">
          <path
            d="m4 4 8 8m0-8-8 8"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  )
}

/** Lista de compras da semana por tipo; dá para gerar do cardápio e editar antes de publicar. */
export function ListaComprasEditor({ lista, textoLivre, aoGerar, aoMudar }: Props) {
  const mudarItem = (g: number, i: number, p: { nome?: string; quantidade?: string }) =>
    aoMudar(
      lista.map((x, k) =>
        k === g ? { ...x, itens: x.itens.map((it, j) => (j === i ? { ...it, ...p } : it)) } : x,
      ),
    )
  const remover = (g: number, i: number) =>
    aoMudar(lista.map((x, k) => (k === g ? { ...x, itens: x.itens.filter((_, j) => j !== i) } : x)))
  const novo = (g: number) =>
    aoMudar(
      lista.map((x, k) =>
        k === g ? { ...x, itens: [...x.itens, { nome: '', quantidade: '' }] } : x,
      ),
    )
  return (
    <Bloco titulo={t.listaCompras}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-[13px] text-suave">{t.semana}</p>
        {!textoLivre && (
          <BotaoBrilho tom="dourado" onClick={aoGerar}>
            {t.gerarLista}
          </BotaoBrilho>
        )}
      </div>
      {lista.length === 0 && <p className="text-[13px] text-suave">{t.listaVazia}</p>}
      <div className="grid gap-4 sm:grid-cols-2">
        {lista.map((g, gi) => (
          <div key={g.grupo} className="flex flex-col gap-2">
            <p className="text-[11px] font-bold tracking-[0.08em] text-[#8A9692] uppercase">
              {g.grupo}
            </p>
            {g.itens.map((it, i) => (
              <LinhaLista
                key={i}
                nome={it.nome}
                quantidade={it.quantidade}
                aoMudar={(p) => mudarItem(gi, i, p)}
                aoRemover={() => remover(gi, i)}
              />
            ))}
            <button
              type="button"
              onClick={() => novo(gi)}
              className="min-h-8 self-start text-xs font-bold text-verde-escuro underline underline-offset-4"
            >
              + {t.novoItemLista}
            </button>
          </div>
        ))}
      </div>
    </Bloco>
  )
}
