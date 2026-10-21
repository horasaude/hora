import { Link } from 'react-router-dom'
import { IconeVoltar } from './IconesCardapio'

/** Topo da tela: voltar sempre para o mesmo lugar (o tema do cardápio), nunca pelo histórico
 * (pelo histórico, quem passou pela lista de compras voltava para ela). */
export function TopoVoltar({
  titulo,
  para,
  rotulo,
}: {
  titulo: string
  para: string
  rotulo: string
}) {
  return (
    <header className="flex items-center gap-3">
      <Link
        to={para}
        aria-label={rotulo}
        className="grid size-9 shrink-0 place-items-center rounded-full border border-linha bg-white text-verde-escuro transition hover:bg-trilho"
      >
        <IconeVoltar className="size-5" />
      </Link>
      <h1 className="text-[22px] leading-tight font-bold text-verde-escuro lg:text-[28px]">
        {titulo}
      </h1>
    </header>
  )
}
