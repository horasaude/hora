// Ícones da barra da aluna, desenhados para a HORA: traço fino e cantos redondos.

const traco = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const

function Svg({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="size-[1.35rem]" {...traco}>
      {children}
    </svg>
  )
}

const DESENHOS = {
  inicio: (
    <Svg>
      <path d="M4.5 10.5 12 4l7.5 6.5V19a1 1 0 0 1-1 1H15v-5.5H9V20H5.5a1 1 0 0 1-1-1z" />
    </Svg>
  ),
  trilha: (
    <Svg>
      <circle cx="6" cy="18.5" r="1.8" />
      <circle cx="18" cy="5.5" r="1.8" />
      <path d="M7.8 18.5H15a3 3 0 0 0 0-6H9a3 3 0 0 1 0-6h7.2" />
    </Svg>
  ),
  desafios: (
    <Svg>
      <path d="M6 20.5V4" />
      <path d="M6 5h11.5l-2.2 4 2.2 4H6" />
    </Svg>
  ),
  ranking: (
    <Svg>
      <path d="M3.5 20h17" />
      <path d="M5 20v-6h4.5v6M9.5 20V8.5h5V20M14.5 20v-4H19v4" />
    </Svg>
  ),
  forum: (
    <Svg>
      <path d="M4.5 6.5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v7.5a2 2 0 0 1-2 2H11l-4 3.5V16H6.5a2 2 0 0 1-2-2z" />
      <path d="M8.5 9h7M8.5 12h4.5" />
    </Svg>
  ),
  loja: (
    <Svg>
      <path d="M5 8.5h14l-1 11a1.5 1.5 0 0 1-1.5 1.4h-9A1.5 1.5 0 0 1 6 19.5z" />
      <path d="M9 10V7a3 3 0 0 1 6 0v3" />
    </Svg>
  ),
  perfil: (
    <Svg>
      <circle cx="12" cy="8.5" r="3.5" />
      <path d="M5 20c.9-3.6 3.7-5.6 7-5.6s6.1 2 7 5.6" />
    </Svg>
  ),
}

export type NomeIcone = keyof typeof DESENHOS

/** Ícone da barra de navegação da aluna. */
export function IconeNavegacao({ nome }: { nome: NomeIcone }) {
  return DESENHOS[nome]
}
