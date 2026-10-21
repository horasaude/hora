import { useQuery } from '@tanstack/react-query'
import { LinkBrilho } from '@/components/ui'
import { buscarPedidos } from '../api/lembretes.api'
import { textos } from '../textos'

/** Cartão no Início com o que a profissional pediu para a aluna fazer; some quando ela faz. */
export function PedidosDaEquipe() {
  const pedidos = useQuery({ queryKey: ['pedidos-equipe'], queryFn: buscarPedidos })
  if (!pedidos.data?.length) return null
  return (
    <section className="flex flex-col gap-3 rounded-[20px] bg-[#FFF6E5] p-4">
      <h2 className="text-sm font-bold text-tinta">{textos.titulo}</h2>
      <ul className="flex flex-col gap-2">
        {pedidos.data.map((p) => (
          <li key={p.item} className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-[15px] text-tinta">{p.nome}</span>
            <LinkBrilho to={p.para} tom="dourado">
              {textos.fazer}
            </LinkBrilho>
          </li>
        ))}
      </ul>
    </section>
  )
}
