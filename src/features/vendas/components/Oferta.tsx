import { LOJA_PARCEIRA_CONFIRMADA } from '../flags'
import { useEmOferta } from '../hooks/useEmOferta'
import { textos } from '../textos'
import { Destaque } from './Destaque'
import { itensVisiveis } from './itensRecebe'
import { Secao } from './Secao'

function Lista({ titulo, itens, sim }: { titulo: string; itens: string[]; sim: boolean }) {
  const marca = sim
    ? 'mt-1.5 h-3.5 w-2 shrink-0 rotate-45 border-r-[3px] border-b-[3px] border-ora'
    : 'mt-3 h-[3px] w-3.5 shrink-0 bg-terracota'
  return (
    <div className={`rounded-3xl p-7 ${sim ? 'bg-white' : 'bg-areia'}`}>
      <h3 className="font-titulo text-3xl font-semibold text-ora">
        <Destaque texto={titulo} />
      </h3>
      <ul className="mt-6 flex flex-col gap-4">
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
    <Secao fundo="areia">
      <div className="grid gap-6 sm:grid-cols-2">
        <Lista titulo={t.simTitulo} itens={t.sim} sim />
        <Lista titulo={t.naoTitulo} itens={t.nao} sim={false} />
      </div>
    </Secao>
  )
}

export function Recebe() {
  const t = textos.recebe
  const itens = itensVisiveis(t.itens, useEmOferta(), LOJA_PARCEIRA_CONFIRMADA)
  return (
    <Secao titulo={t.titulo}>
      <ul>
        {itens.map((i) => (
          <li
            key={i.texto}
            className="flex items-center justify-between gap-4 border-t border-linha py-5 text-lg text-tinta last:border-b"
          >
            <span>{i.texto}</span>
            {i.bonus && (
              <span className="shrink-0 rounded-full bg-ocre px-3 py-1 text-xs font-bold tracking-wider text-tinta">
                {t.selo}
              </span>
            )}
          </li>
        ))}
      </ul>
    </Secao>
  )
}
