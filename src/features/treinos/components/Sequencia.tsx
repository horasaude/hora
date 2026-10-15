import { Link } from 'react-router-dom'
import { IconeCheck, LinkBrilho } from '@/components/ui'
import { proximoDaSequencia } from '@/domain/series'
import type { Feito, RotinaAluna } from '../api/treinos.api'
import { detalhe } from '../formato'
import { textos } from '../textos'

type Props = { rotina: RotinaAluna; feitos: Feito[]; hoje: string; link: (id: string) => string }

/** Rotina numérica: o próximo treino em destaque e a lista Treino 1, 2, 3 com o da vez marcado. */
export function TreinoDaSequencia({ rotina, feitos, hoje, link }: Props) {
  const ordem = rotina.dias.map((d) => d.treino.id)
  const { indice, feitoHoje } = proximoDaSequencia(ordem, feitos, hoje)
  const daVez = rotina.dias[indice]
  if (!daVez) return null
  return (
    <>
      <section className="rounded-[24px] bg-gradient-to-br from-[#FFF1EA] to-white p-5 shadow-cartao sm:p-6">
        <p className="text-xs font-bold tracking-[0.14em] text-coral uppercase">
          {feitoHoje ? textos.hoje : textos.proximoTreino}
        </p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-suave">{textos.treinoN(indice + 1)}</p>
            <h2 className="text-[22px] font-bold text-verde-escuro">{daVez.treino.nome}</h2>
            <p className="mt-1 text-sm text-suave">{detalhe(daVez.treino)}</p>
          </div>
          {feitoHoje ? (
            <span className="brilho brilho-verde inline-flex min-h-10 items-center gap-1 rounded-full px-5 text-[13px] font-bold">
              <IconeCheck className="size-3.5" />
              {textos.feito}
            </span>
          ) : (
            <LinkBrilho to={link(daVez.treino.id)} tom="coral" tamanho="lg">
              {textos.comecar}
            </LinkBrilho>
          )}
        </div>
      </section>
      <section className="flex flex-col gap-3">
        <h2 className="text-[19px] font-bold text-verde-escuro">{textos.sequencia}</h2>
        <ol className="grid gap-3 lg:grid-cols-2">
          {rotina.dias.map((d, i) => (
            <li key={d.treino.id + i}>
              <Link
                to={link(d.treino.id)}
                className={`flex items-center gap-4 rounded-[20px] bg-white p-4 shadow-cartao ${i === indice ? 'ring-2 ring-coral' : ''}`}
              >
                <span className="brilho brilho-coral grid size-10 shrink-0 place-items-center rounded-full text-[15px] font-bold">
                  {i + 1}
                </span>
                <span className="flex-1">
                  <span className="block font-bold text-tinta">{d.treino.nome}</span>
                  <span className="text-sm text-suave">{detalhe(d.treino)}</span>
                </span>
                {i === indice && !feitoHoje && (
                  <span className="text-[11px] font-bold text-coral">{textos.daVez}</span>
                )}
              </Link>
            </li>
          ))}
        </ol>
      </section>
    </>
  )
}

/** Orientações gerais da professora, recolhidas para não ocupar a tela. */
export function Orientacoes({ texto }: { texto: string }) {
  if (!texto.trim()) return null
  return (
    <details className="rounded-[18px] bg-trilho px-4 py-3 text-sm text-tinta">
      <summary className="min-h-8 cursor-pointer font-bold text-verde-escuro">
        {textos.orientacoes}
      </summary>
      <p className="mt-2 whitespace-pre-line">{texto}</p>
    </details>
  )
}
