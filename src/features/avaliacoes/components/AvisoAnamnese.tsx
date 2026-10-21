import { Link } from 'react-router-dom'
import { EtiquetaBrilho } from '@/components/ui'
import { useAvaliacoesPendentes } from '../hooks/useAvaliacoes'
import { textos } from '../textos'

function IconePrancheta() {
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
      <path d="M9 4h6v3H9zM8 5.5H6v15h12v-15h-2M9 11h.01M12 11h3M9 15h.01M12 15h3" />
    </svg>
  )
}

/** Cartão coral no Início e em Treinos enquanto houver anamnese sem enviar (aparece desde o dia 1). */
export function AvisoAnamnese() {
  const pendentes = useAvaliacoesPendentes()
  const primeira = pendentes[0]
  if (!primeira) return null
  return (
    <Link
      to={`/app/avaliacoes/${primeira.id}`}
      data-pedido
      className="flex items-center gap-3 rounded-[20px] border border-[#f8cdbd] bg-[#fde7df] p-3.5 transition hover:brightness-[0.98]"
    >
      <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-white text-[#c8471f]">
        <IconePrancheta />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-bold text-tinta">{textos.avisoTitulo}</span>
        <span className="block text-[13px] text-suave">{textos.aviso}</span>
      </span>
      <EtiquetaBrilho tom="coral">{textos.responder}</EtiquetaBrilho>
    </Link>
  )
}
