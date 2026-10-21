import { IconeTema } from './Temas'

// Capa montada sozinha quando o tema não tem imagem: a cor do tema, formas suaves e o ícone grande.
const FUNDO: Record<string, string> = {
  verde: '#1f4a41',
  coral: '#c26e4f',
  dourado: '#b7862f',
  lilas: '#7a659f',
  rosa: '#b0647f',
  escuro: '#1e2925',
}
const POR_CHAVE: Record<string, string> = {
  preparacao: '#4d7362',
  emagrecimento: FUNDO.verde ?? '#1f4a41',
  composicao: FUNDO.coral ?? '#c26e4f',
  lipedema: FUNDO.lilas ?? '#7a659f',
  menopausa: FUNDO.rosa ?? '#b0647f',
  ganho_massa: FUNDO.dourado ?? '#b7862f',
}

const corDaCapa = (chave: string | null, cor: string | null) =>
  (cor && FUNDO[cor]) || POR_CHAVE[chave ?? ''] || '#1f4a41'

/** Preenche o espaço da capa (o pai é relative): cor do tema, dois círculos claros e o ícone. */
export function CapaAutomatica({
  chave,
  cor,
  icone = 'size-16',
  direita = false,
}: {
  chave: string | null
  cor: string | null
  icone?: string
  /** Ícone à direita (na capa grande, para não ficar atrás do título). */
  direita?: boolean
}) {
  return (
    <span
      aria-hidden
      className="absolute inset-0 overflow-hidden"
      style={{ backgroundColor: corDaCapa(chave, cor) }}
    >
      <span className="absolute -top-1/3 -right-1/4 aspect-square w-3/4 rounded-full bg-white/10" />
      <span className="absolute -bottom-1/2 -left-1/4 aspect-square w-2/3 rounded-full bg-white/[0.07]" />
      <span
        className={`absolute inset-0 grid items-center text-white/85 ${direita ? 'justify-items-end pr-8' : 'justify-items-center'}`}
      >
        <IconeTema chave={chave} className={icone} />
      </span>
    </span>
  )
}
