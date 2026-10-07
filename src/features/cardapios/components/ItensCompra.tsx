import { IconeCheck } from '@/components/ui'
import type { ListaCompras } from '@/domain/listaCompras'

type Props = {
  lista: ListaCompras
  marcados: string[]
  aoMarcar: (item: string, marcado: boolean) => void
}

/** Itens agrupados por categoria, cada um com caixa de marcar. */
export function ItensCompra({ lista, marcados, aoMarcar }: Props) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {lista.map((g) => (
        <section
          key={g.grupo}
          className="flex flex-col gap-2 rounded-[22px] bg-white p-5 shadow-cartao"
        >
          <h2 className="text-[11px] font-bold tracking-[0.08em] text-suave uppercase">
            {g.grupo}
          </h2>
          <ul className="flex flex-col">
            {g.itens.map((it) => {
              const marcado = marcados.includes(it.nome)
              return (
                <li key={it.nome}>
                  <label className="flex min-h-11 cursor-pointer items-center gap-3 text-[15px]">
                    <input
                      type="checkbox"
                      checked={marcado}
                      onChange={(e) => aoMarcar(it.nome, e.target.checked)}
                      className="peer sr-only"
                    />
                    <span
                      aria-hidden
                      className={`grid size-6 shrink-0 place-items-center rounded-full peer-focus-visible:outline-2 peer-focus-visible:outline-ora ${marcado ? 'brilho brilho-verde' : 'border-2 border-linha'}`}
                    >
                      {marcado && <IconeCheck className="size-3" />}
                    </span>
                    <span
                      className={`flex-1 ${marcado ? 'text-suave line-through' : 'text-tinta'}`}
                    >
                      {it.nome}
                    </span>
                    <span className="text-sm text-suave">{it.quantidade}</span>
                  </label>
                </li>
              )
            })}
          </ul>
        </section>
      ))}
    </div>
  )
}

/** Versão limpa para imprimir (só ela aparece no papel). */
export function ImpressaoCompras({ titulo, lista }: { titulo: string; lista: ListaCompras }) {
  return (
    <div className="area-impressao font-sistema text-black">
      <h1 className="mb-4 text-xl font-bold">{titulo}</h1>
      {lista.map((g) => (
        <section key={g.grupo} className="mb-4 break-inside-avoid">
          <h2 className="mb-1 text-sm font-bold uppercase">{g.grupo}</h2>
          <ul>
            {g.itens.map((it) => (
              <li key={it.nome} className="text-sm">
                ☐ {it.nome} · {it.quantidade}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
