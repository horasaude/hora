import { useState } from 'react'
import { Link } from 'react-router-dom'
import { IconeCheck, LinkBrilho } from '@/components/ui'
import { DIAS_CURTOS, DIAS_SEMANA, semanaDe, treinoDeHoje } from '@/domain/treinos'
import type { RotinaAluna } from '../api/treinos.api'
import { textos } from '../textos'
import { detalhe } from '../formato'

type Props = { rotina: RotinaAluna; dia: number; feitos: Set<string>; link: (id: string) => string }

/** Card destaque "Treino de hoje", pela rotina e pelo dia da semana. */
export function TreinoDeHoje({ rotina, dia, feitos, link }: Props) {
  const { hoje, proximo } = treinoDeHoje(rotina.dias, dia)
  return (
    <section className="rounded-[24px] bg-gradient-to-br from-[#FFF1EA] to-white p-5 shadow-cartao sm:p-6">
      <p className="text-xs font-bold tracking-[0.14em] text-coral uppercase">{textos.hoje}</p>
      {hoje ? (
        <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-[22px] font-bold text-verde-escuro">{hoje.treino.nome}</h2>
            <p className="mt-1 text-sm text-suave">{detalhe(hoje.treino)}</p>
          </div>
          {feitos.has(hoje.treino.id) ? (
            <span className="brilho brilho-verde inline-flex min-h-10 items-center gap-1 rounded-full px-5 text-[13px] font-bold">
              <IconeCheck className="size-3.5" />
              {textos.feito}
            </span>
          ) : (
            <LinkBrilho to={link(hoje.treino.id)} tom="coral" tamanho="lg">
              {textos.comecar}
            </LinkBrilho>
          )}
        </div>
      ) : (
        <div className="mt-2">
          <h2 className="text-[22px] font-bold text-verde-escuro">{textos.descansoHoje}</h2>
          {proximo && (
            <p className="mt-1 text-sm text-suave">
              {textos.proximo(DIAS_SEMANA[proximo.dia_semana] ?? '', proximo.treino.nome)}
            </p>
          )}
        </div>
      )}
    </section>
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
