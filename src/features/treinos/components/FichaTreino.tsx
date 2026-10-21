import type { ReactNode } from 'react'
import { Cartao, EtiquetaBrilho, IconeCheck, LinkBrilho } from '@/components/ui'
import { PROFISSIONAIS } from '@/domain/lives'
import { LOCAIS, NIVEIS, type Local, type Nivel } from '@/domain/treinos'
import { RegistrarTreino } from '@/features/checkin'
import type { TreinoCompleto, TreinoResumo } from '../api/treinos.api'
import { useTreino } from '../hooks/useTreinos'
import { usePreviaTreinos } from '../previa'
import { textos } from '../textos'
import { CartaoExercicio } from './CartaoExercicio'
import { Estado } from './Estado'
import { IconeCasa, IconeNivel, IconeRelogio } from './IconesTreino'

const lais = PROFISSIONAIS.lais

/** Endereço da execução já no passo do exercício (orientações e aquecimento vêm antes). */
function paraExercicio(link: string, t: TreinoCompleto, i: number) {
  const antes = (t.orientacoes.trim() ? 1 : 0) + (t.aquecimento.trim() ? 1 : 0)
  return `${link}${link.includes('?') ? '&' : '?'}passo=${antes + i}`
}

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
  feito: boolean
  link: string
  aviso?: ReactNode
}

/** Treino em destaque: nível, local e duração; quem montou e o nome; os exercícios; Começar e Marcar com foto. */
export function FichaTreino({ treino, rotulo, feito, link, aviso }: Props) {
  const previa = usePreviaTreinos()
  return (
    <section className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        <EtiquetaBrilho tom="dourado">
          <IconeNivel className="mr-1 size-3" />
          {NIVEIS[treino.nivel as Nivel] ?? treino.nivel}
        </EtiquetaBrilho>
        <EtiquetaBrilho tom="verde">
          <IconeCasa className="mr-1 size-3" />
          {LOCAIS[treino.local as Local] ?? treino.local}
        </EtiquetaBrilho>
        {treino.duracao_minutos ? (
          <EtiquetaBrilho tom="cinza">
            <IconeRelogio className="mr-1 size-3" />
            {textos.minutos(treino.duracao_minutos)}
          </EtiquetaBrilho>
        ) : null}
      </div>
      <Cartao className="flex items-center gap-3 p-4">
        <img
          src={lais.foto}
          alt={lais.nome}
          className="size-[46px] shrink-0 rounded-full object-cover"
        />
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-bold tracking-[0.12em] text-coral uppercase">{rotulo}</p>
          <p className="text-[16px] leading-snug font-bold text-verde-escuro">{treino.nome}</p>
          <p className="text-[12px] text-suave">{textos.ficha.montadoPor(lais.nome)}</p>
        </div>
      </Cartao>
      {aviso}
      <Exercicios id={treino.id} link={link} />
      <div className="flex flex-wrap items-center gap-2">
        {feito ? (
          <EtiquetaBrilho tom="verde">
            <IconeCheck className="mr-1 size-3" />
            {textos.feito}
          </EtiquetaBrilho>
        ) : (
          <LinkBrilho to={link} tom="coral">
            {textos.comecar}
          </LinkBrilho>
        )}
        {!previa && <RegistrarTreino rotulo={textos.ficha.foto} />}
      </div>
    </section>
  )
}
