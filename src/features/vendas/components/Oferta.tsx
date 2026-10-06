import { LOJA_PARCEIRA_CONFIRMADA } from '../flags'
import { useEmOferta } from '../hooks/useEmOferta'
import { textos } from '../textos'
import { Destaque } from './Destaque'
import { itensVisiveis } from './itensRecebe'
import { Secao } from './Secao'

function Lista({ titulo, itens, sim }: { titulo: string; itens: string[]; sim: boolean }) {
  const marca = sim
    ? 'mt-1.5 h-3.5 w-2 shrink-0 rotate-45 border-r-2 border-b-2 border-ora'
    : 'mt-3 h-px w-4 shrink-0 bg-suave'
  return (
    <div className="rounded-[1.5rem] bg-white p-6">
      <h3 className="text-4xl text-ora">
        <Destaque texto={titulo} />
      </h3>
      <ul className="mt-5 flex flex-col gap-3">
        {itens.map((i) => (
          <li key={i} className="flex gap-4 text-lg text-tinta">
            <span aria-hidden="true" className={marca} />
            {i}
          </li>
        ))}
      </ul>
    </div>
  )
}

export function ParaQuem() {
  const t = textos.paraQuem
  return (
    <Secao cta={t.cta} etiqueta={t.etiqueta} marca>
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <img
          src={t.foto}
          alt={t.fotoAlt}
          width={1000}
          height={1500}
          loading="lazy"
          className="aspect-[4/5] w-full rounded-[2rem] object-cover lg:aspect-[2/3]"
        />
        <div className="flex flex-col gap-6">
          <Lista titulo={t.simTitulo} itens={t.sim} sim />
          <Lista titulo={t.naoTitulo} itens={t.nao} sim={false} />
        </div>
      </div>
    </Secao>
  )
}

export function Recebe() {
  const t = textos.recebe
  const itens = itensVisiveis(t.itens, useEmOferta(), LOJA_PARCEIRA_CONFIRMADA)
  return (
    <Secao cta={t.cta} etiqueta={t.etiqueta} titulo={t.titulo} fundo="branco">
      <ul className="grid sm:grid-cols-2 sm:gap-x-10">
        {itens.map((i) => (
          <li
            key={i.texto}
            className="flex items-center justify-between gap-4 border-t border-linha py-3 text-base text-tinta sm:text-lg"
          >
            <span>{i.texto}</span>
            {i.bonus && (
              <span className="shrink-0 rounded-full bg-ora px-3 py-1 text-[0.65rem] font-semibold tracking-[0.2em] text-creme">
                {t.selo}
              </span>
            )}
          </li>
        ))}
      </ul>
    </Secao>
  )
}
