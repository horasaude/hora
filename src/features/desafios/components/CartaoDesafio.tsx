import { Link } from 'react-router-dom'
import { Cartao, EtiquetaBrilho } from '@/components/ui'
import { diaMesDeData } from '@/lib/datas'
import type { Desafio } from '../api/desafios.api'
import { textoPremio } from '../premio'
import { textos } from '../textos'

/** Cartão da lista: nome, período, prêmio, participantes e Participando ou Entrar. */
export function CartaoDesafio({ d }: { d: Desafio }) {
  const premio = textoPremio(d)
  return (
    <Link
      to={`/app/desafios/${d.id}`}
      className="block h-full rounded-[22px] focus-visible:outline-2 focus-visible:outline-ora"
    >
      <Cartao className="flex h-full flex-col gap-3 transition hover:shadow-menu">
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-[17px] leading-snug font-bold text-tinta">{d.nome}</h2>
          <EtiquetaBrilho tom={d.participando ? 'verde' : 'dourado'}>
            {d.participando ? textos.participando : textos.entrar}
          </EtiquetaBrilho>
        </div>
        <p className="text-sm text-suave">
          {textos.periodo(diaMesDeData(d.inicio), diaMesDeData(d.fim))} ·{' '}
          {textos.participantes(d.participantes)}
        </p>
        {premio && (
          <p className="mt-auto text-sm text-tinta">
            <span className="font-bold text-ocre">{textos.premio}: </span>
            {premio}
          </p>
        )}
      </Cartao>
    </Link>
  )
}
