import { Link } from 'react-router-dom'
import { Cartao, EtiquetaBrilho } from '@/components/ui'
import { totalCardapio } from '@/domain/nutricao'
import type { Cardapio } from '../api/cardapios.api'
import { textos } from '../textos'

/** Cartão da lista: nome, objetivo, kcal do dia e número de refeições. */
export function CartaoCardapio({ c }: { c: Cardapio }) {
  const kcal = totalCardapio(c.refeicoes).kcal
  return (
    <Link
      to={`/app/cardapios/${c.id}`}
      aria-label={textos.abrir(c.titulo)}
      className="block h-full rounded-[22px] focus-visible:outline-2 focus-visible:outline-ora"
    >
      <Cartao className="flex h-full flex-col gap-3 transition hover:shadow-menu">
        <span className="self-start">
          <EtiquetaBrilho tom="verde">{c.objetivo}</EtiquetaBrilho>
        </span>
        <h2 className="text-[17px] leading-snug font-bold text-tinta">{c.titulo}</h2>
        {c.descricao && <p className="line-clamp-2 text-sm text-suave">{c.descricao}</p>}
        <p className="mt-auto text-sm text-tinta">
          {!c.texto && kcal > 0 && (
            <span className="font-bold text-verde-escuro">{textos.kcalDia(kcal)} · </span>
          )}
          {textos.refeicoes(c.refeicoes.length)}
        </p>
      </Cartao>
    </Link>
  )
}
