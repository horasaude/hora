import { Cartao, EtiquetaBrilho, IconeCheck, LinkBrilho } from '@/components/ui'
import { RegistrarTreino } from '@/features/checkin'
import type { TreinoCompleto, TreinoResumo } from '../api/treinos.api'
import { detalhe } from '../formato'
import { useTreino } from '../hooks/useTreinos'
import { usePreviaTreinos } from '../previa'
import { textos } from '../textos'
import { CartaoExercicio } from './CartaoExercicio'
import { Estado } from './Estado'

/** Endereço da execução já no passo do exercício (orientações e aquecimento vêm antes). */
function paraExercicio(link: string, t: TreinoCompleto, i: number) {
  const antes = (t.orientacoes.trim() ? 1 : 0) + (t.aquecimento.trim() ? 1 : 0)
  return `${link}${link.includes('?') ? '&' : '?'}passo=${antes + i}`
}

/** Todos os exercícios do treino em lista: imagem, nome, séries x repetições, descanso e carga. */
function Exercicios({ id, link }: { id: string; link: string }) {
  const treino = useTreino(id)
  if (treino.isPending) return <Estado tipo="carregando" />
  if (treino.isError) return <Estado tipo="erro" tentar={() => treino.refetch()} />
  const t = treino.data
  if (!t || t.itens.length === 0) return <Estado tipo="vazio" texto={textos.ficha.semExercicios} />
  return (
    <ul className="grid gap-2.5 lg:grid-cols-2">
      {t.itens.map((item, i) => (
        <li key={`${item.exercicio_id}-${i}`}>
          <CartaoExercicio
            item={item}
            aerobico={t.categoria === 'aerobico'}
            para={paraExercicio(link, t, i)}
          />
        </li>
      ))}
    </ul>
  )
}

type Props = {
  treino: TreinoResumo
  rotulo: string
  destaque: boolean
  feito: boolean
  link: string
}

/** Um treino da semana aberto: nome, todos os exercícios, Começar treino e Marcar com foto. */
export function TreinoEmLista({ treino, rotulo, destaque, feito, link }: Props) {
  const previa = usePreviaTreinos()
  return (
    <Cartao className={`flex flex-col gap-3 p-4 ${destaque ? 'ring-2 ring-coral' : ''}`}>
      <div className="flex flex-wrap items-start gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-bold tracking-[0.12em] text-coral uppercase">{rotulo}</p>
          <p className="text-[16px] leading-snug font-bold text-verde-escuro">{treino.nome}</p>
          <p className="text-[13px] text-suave">{detalhe(treino)}</p>
        </div>
        {feito && (
          <EtiquetaBrilho tom="verde">
            <IconeCheck className="mr-1 size-3" />
            {textos.feito}
          </EtiquetaBrilho>
        )}
      </div>
      <Exercicios id={treino.id} link={link} />
      <div className="flex flex-wrap items-center gap-2">
        {!feito && (
          <LinkBrilho to={link} tom="coral">
            {textos.comecar}
          </LinkBrilho>
        )}
        {!previa && <RegistrarTreino rotulo={textos.ficha.foto} />}
      </div>
    </Cartao>
  )
}
