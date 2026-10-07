import { Cartao, LinkBrilho } from '@/components/ui'
import { desafioEmAndamento } from '@/domain/engajamento'
import { useDesafios } from '../hooks/useDesafios'
import { textos } from '../textos'
import { CheckinDesafio } from './CheckinDesafio'
import { ProgressoDesafio } from './Progresso'

/** Início: o desafio em andamento de que ela participa, com a barra e o check-in do dia. */
export function CartaoDesafioAtivo({ hoje }: { hoje: string }) {
  const desafios = useDesafios()
  const d = desafios.data?.find((x) => x.participando && desafioEmAndamento(x, hoje))
  if (!d) return null
  return (
    <Cartao className="flex flex-col gap-4">
      <h2 className="text-base font-bold text-tinta">{d.nome}</h2>
      <ProgressoDesafio d={d} hoje={hoje} />
      <div className="flex flex-wrap items-end justify-between gap-3">
        <CheckinDesafio d={d} hoje={hoje} />
        <LinkBrilho to={`/app/desafios/${d.id}`} tom="cinza">
          {textos.inicio.ver}
        </LinkBrilho>
      </div>
    </Cartao>
  )
}
