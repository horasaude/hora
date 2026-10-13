import { tReceitas as t } from '../textos2'

const BASICOS = [
  { cmd: 'bold', rotulo: t.negrito, icone: <b>B</b> },
  { cmd: 'insertUnorderedList', rotulo: t.lista, icone: <span>•</span> },
  { cmd: 'insertOrderedList', rotulo: t.listaNumerada, icone: <span>1.</span> },
] as const
const ITALICO = {
  cmd: 'italic',
  rotulo: t.italico,
  icone: <i className="font-serif">I</i>,
} as const

const botao =
  'grid size-8 place-items-center rounded-lg text-[13px] text-verde-escuro hover:bg-trilho'

function IconeLink() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="size-4">
      <path
        d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

type Props = {
  completo: boolean
  linkAberto: boolean
  aoComando: (cmd: string) => void
  /** Guarda a seleção antes de abrir o campo do link. */
  aoAbrirLink: () => void
  aoAlternarLink: () => void
}

/** Botões do editor: negrito e listas; completo também tem itálico e link. */
export function BarraEditor({
  completo,
  linkAberto,
  aoComando,
  aoAbrirLink,
  aoAlternarLink,
}: Props) {
  const botoes = completo ? [BASICOS[0], ITALICO, BASICOS[1], BASICOS[2]] : BASICOS
  return (
    <div className="flex flex-wrap gap-1 border-b border-[#F0F2F1] px-2 py-1.5">
      {botoes.map((b) => (
        <button
          key={b.cmd}
          type="button"
          aria-label={b.rotulo}
          title={b.rotulo}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => aoComando(b.cmd)}
          className={botao}
        >
          {b.icone}
        </button>
      ))}
      {completo && (
        <button
          type="button"
          aria-label={t.link}
          title={t.link}
          aria-expanded={linkAberto}
          onMouseDown={(e) => {
            e.preventDefault()
            aoAbrirLink()
          }}
          onClick={aoAlternarLink}
          className={botao}
        >
          <IconeLink />
        </button>
      )}
    </div>
  )
}
