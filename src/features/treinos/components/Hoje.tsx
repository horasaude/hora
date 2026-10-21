import { useState } from 'react'
import { Link } from 'react-router-dom'
import { IconeCheck } from '@/components/ui'
import { DIAS_CURTOS, DIAS_SEMANA, semanaDe, treinoDeHoje } from '@/domain/treinos'
import type { RotinaAluna } from '../api/treinos.api'
import { textos } from '../textos'
import { FichaTreino } from './FichaTreino'

type Props = { rotina: RotinaAluna; dia: number; feitos: Set<string>; link: (id: string) => string }

/** Treino de hoje pela rotina e pelo dia da semana; em dia de descanso, a ficha do próximo. */
export function TreinoDeHoje({ rotina, dia, feitos, link }: Props) {
  const porDia = rotina.dias.flatMap((d) =>
    d.dia_semana === null ? [] : [{ ...d, dia_semana: d.dia_semana }],
  )
  const { hoje, proximo } = treinoDeHoje(porDia, dia)
  const treino = hoje?.treino ?? proximo?.treino
  if (!treino)
    return <p className="text-[17px] font-bold text-verde-escuro">{textos.descansoHoje}</p>
  const aviso = !hoje && proximo && (
    <p className="rounded-[18px] bg-[#FFF1EA] px-4 py-3 text-sm text-tinta">
      <b className="text-verde-escuro">{textos.descansoHoje}</b>
      {'. '}
      {textos.proximo(DIAS_SEMANA[proximo.dia_semana] ?? '', proximo.treino.nome)}
    </p>
  )
  return (
    <FichaTreino
      treino={treino}
      rotulo={hoje ? textos.hoje : textos.proximoTreino}
      feito={feitos.has(treino.id)}
      link={link(treino.id)}
      aviso={aviso}
    />
  )
}

/** A semana da rotina, de domingo a sábado, com check verde nos dias em que ela treinou. */
export function SemanaTreinos({
  rotina,
  dia,
  datas,
  link,
}: Omit<Props, 'feitos'> & { datas: Set<string> }) {
  const [semana] = useState(() => semanaDe(new Date()))
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-[19px] font-bold text-verde-escuro">{textos.semana}</h2>
      <ul className="grid grid-cols-7 gap-1.5 sm:gap-2">
        {DIAS_CURTOS.map((nome, i) => {
          const d = rotina.dias.find((x) => x.dia_semana === i)
          const feito = datas.has(semana[i] ?? '')
          const conteudo = (
            <>
              <span className="text-[11px] font-bold text-suave">{nome}</span>
              <span
                className={`grid size-8 place-items-center rounded-full text-[11px] font-bold ${feito ? 'brilho brilho-verde' : d ? 'brilho brilho-coral' : 'bg-trilho text-suave'}`}
              >
                {feito ? (
                  <IconeCheck className="size-3.5" />
                ) : d ? (
                  (d.treino.nome.match(/\b[A-Z]\b/)?.[0] ?? '•')
                ) : (
                  '-'
                )}
              </span>
            </>
          )
          const classe = `flex flex-col items-center gap-1.5 rounded-2xl py-2 ${i === dia ? 'bg-[#FFF1EA] ring-1 ring-coral' : ''}`
          return (
            <li key={nome}>
              {d ? (
                <Link
                  to={link(d.treino.id)}
                  aria-label={`${DIAS_SEMANA[i]}: ${d.treino.nome}`}
                  className={classe}
                >
                  {conteudo}
                </Link>
              ) : (
                <span className={classe}>{conteudo}</span>
              )}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
