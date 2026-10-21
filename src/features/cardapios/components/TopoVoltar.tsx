import { useNavigate } from 'react-router-dom'
import { IconeVoltar } from './IconesCardapio'

/** Topo da tela: voltar (para onde ela veio; sem histórico, para o endereço padrão) e o título. */
export function TopoVoltar({
  titulo,
  padrao,
  rotulo,
}: {
  titulo: string
  padrao: string
  rotulo: string
}) {
  const navegar = useNavigate()
  const voltar = () => {
    const idx = (window.history.state as { idx?: number } | null)?.idx ?? 0
    if (idx > 0) navegar(-1)
    else navegar(padrao)
  }
  return (
    <header className="flex items-center gap-3">
      <button
        type="button"
        aria-label={rotulo}
        onClick={voltar}
        className="grid size-9 shrink-0 place-items-center rounded-full border border-linha bg-white text-verde-escuro transition hover:bg-trilho"
      >
        <IconeVoltar className="size-5" />
      </button>
      <h1 className="text-[22px] leading-tight font-bold text-verde-escuro lg:text-[28px]">
        {titulo}
      </h1>
    </header>
  )
}
