import { Link } from 'react-router-dom'
import { IconeVoltar } from './IconesDesafio'

/** Topo da tela: voltar sempre para o mesmo lugar (o tema do desafio ou a lista), nunca pelo histórico. */
export function Topo({ titulo, rotulo, para }: { titulo: string; rotulo: string; para: string }) {
  return (
    <header className="flex items-center gap-3">
      <Link
        to={para}
        aria-label={rotulo}
        className="grid size-9 shrink-0 place-items-center rounded-full border border-linha bg-white text-verde-escuro transition hover:bg-trilho"
      >
        <IconeVoltar />
      </Link>
      <h1 className="text-[22px] leading-tight font-bold text-verde-escuro lg:text-[28px]">
        {titulo}
      </h1>
    </header>
  )
}
