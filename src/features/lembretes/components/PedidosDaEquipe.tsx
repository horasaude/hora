import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { EtiquetaBrilho } from '@/components/ui'
import { buscarPedidos } from '../api/lembretes.api'
import { textos } from '../textos'

function IconePedido() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className="size-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 4h6v3H9zM8 5.5H6v15h12v-15h-2M9 12h6M9 16h4" />
    </svg>
  )
}

/** Cartões coral no Início com o que a profissional pediu para a aluna fazer; somem quando ela faz. */
export function PedidosDaEquipe() {
  const pedidos = useQuery({ queryKey: ['pedidos-equipe'], queryFn: buscarPedidos })
  if (!pedidos.data?.length) return null
  return (
    <ul className="flex flex-col gap-2.5" data-pedido>
      {pedidos.data.map((p) => (
        <li key={p.item}>
          <Link
            to={p.para}
            className="flex items-center gap-3 rounded-[20px] border border-[#f8cdbd] bg-[#fde7df] p-3.5 transition hover:brightness-[0.98]"
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-white text-[#c8471f]">
              <IconePedido />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[15px] font-bold text-tinta">{p.nome}</span>
              <span className="block text-[13px] text-suave">{textos.titulo}</span>
            </span>
            <EtiquetaBrilho tom="coral">{textos.fazer}</EtiquetaBrilho>
          </Link>
        </li>
      ))}
    </ul>
  )
}
