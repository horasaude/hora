import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

type Opcao = { para: string; nome: string; extra?: ReactNode }

/** Seletor segmentado de rotas: trilho cinza, a opção aberta em branco com o texto verde ORA. */
export function Segmento({
  opcoes,
  ativa,
  rotulo,
}: {
  opcoes: Opcao[]
  ativa: string | undefined
  rotulo: string
}) {
  return (
    <nav
      aria-label={rotulo}
      className="grid gap-1 rounded-[14px] bg-trilho p-1"
      style={{ gridTemplateColumns: `repeat(${opcoes.length}, minmax(0, 1fr))` }}
    >
      {opcoes.map((o) => {
        const aberta = o.para === ativa
        return (
          <Link
            key={o.para}
            to={o.para}
            aria-current={aberta ? 'page' : undefined}
            className={`inline-flex min-h-9 items-center justify-center gap-1.5 rounded-[10px] text-[13px] font-bold transition ${
              aberta ? 'bg-white text-verde-escuro shadow-cartao' : 'text-suave hover:text-tinta'
            }`}
          >
            {o.extra}
            {o.nome}
          </Link>
        )
      })}
    </nav>
  )
}
