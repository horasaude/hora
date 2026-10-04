import type { ReactNode } from 'react'
import { Destaque } from './Destaque'

type Fundo = 'branco' | 'areia' | 'ora'

type Props = { id?: string; titulo?: string; fundo?: Fundo; children: ReactNode }

const fundos: Record<Fundo, string> = {
  branco: 'bg-white',
  areia: 'bg-areia',
  ora: 'bg-ora text-white',
}

/** Bloco da página: muito respiro, título grande com uma palavra em destaque. */
export function Secao({ id, titulo, fundo = 'branco', children }: Props) {
  return (
    <section id={id} className={`scroll-mt-16 ${fundos[fundo]}`}>
      <div className="mx-auto max-w-3xl px-5 py-20 sm:py-28">
        {titulo && (
          <h2
            className={`font-titulo text-[2.5rem] leading-[1.05] font-semibold tracking-tight sm:text-6xl ${fundo === 'ora' ? 'text-white' : 'text-ora'}`}
          >
            <Destaque texto={titulo} cor={fundo === 'ora' ? 'ocre' : 'terracota'} />
          </h2>
        )}
        <div className={titulo ? 'mt-10' : ''}>{children}</div>
      </div>
    </section>
  )
}
