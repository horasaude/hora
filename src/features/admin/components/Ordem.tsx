import { textos } from '../textos'

type Props = { titulo: string; aoSubir?: () => void; aoDescer?: () => void; ocupado?: boolean }

const botao =
  'brilho brilho-cinza grid size-8 place-items-center rounded-full text-verde-escuro disabled:opacity-30'

/** Setas para subir e descer um item na ordem. */
export function Ordem({ titulo, aoSubir, aoDescer, ocupado }: Props) {
  return (
    <div className="flex gap-1">
      <button
        type="button"
        aria-label={`${textos.subir}: ${titulo}`}
        onClick={aoSubir}
        disabled={!aoSubir || ocupado}
        className={botao}
      >
        <span className="mt-1 size-2 rotate-45 border-t-2 border-l-2 border-current" />
      </button>
      <button
        type="button"
        aria-label={`${textos.descer}: ${titulo}`}
        onClick={aoDescer}
        disabled={!aoDescer || ocupado}
        className={botao}
      >
        <span className="mb-1 size-2 rotate-45 border-r-2 border-b-2 border-current" />
      </button>
    </div>
  )
}
