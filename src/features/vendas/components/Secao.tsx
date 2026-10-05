import type { ReactNode } from 'react'
import { textos } from '../textos'
import { Destaque } from './Destaque'

type Fundo = 'creme' | 'branco' | 'ora'

type Props = {
  id?: string
  etiqueta?: string
  titulo?: string
  fundo?: Fundo
  marca?: boolean
  children: ReactNode
}

const fundos: Record<Fundo, string> = {
  creme: 'bg-creme text-tinta',
  branco: 'bg-white text-tinta',
  ora: 'bg-ora text-creme',
}

/** Etiqueta pequena espaçada à esquerda e "ORA · 2026" à direita, como no topo do carrossel. */
export function Etiqueta({ texto, claro }: { texto: string; claro?: boolean }) {
  return (
    <div
      className={`flex justify-between gap-4 text-[0.7rem] font-medium tracking-[0.22em] uppercase italic ${claro ? 'text-creme/75' : 'text-suave'}`}
    >
      <span>{texto}</span>
      <span>{textos.assinatura}</span>
    </div>
  )
}

/** O "A" da logo, enorme e clarinho, como marca d'água das lâminas. */
function Marca({ claro }: { claro: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute -top-10 -right-24 font-titulo text-[30rem] leading-none select-none sm:-right-10 ${claro ? 'text-creme/[0.06]' : 'text-salvia/[0.12]'}`}
    >
      A
    </span>
  )
}

export function Secao({ id, etiqueta, titulo, fundo = 'creme', marca, children }: Props) {
  const escuro = fundo === 'ora'
  return (
    <section id={id} className={`relative scroll-mt-16 overflow-hidden ${fundos[fundo]}`}>
      {marca && <Marca claro={escuro} />}
      <div className="relative mx-auto max-w-5xl px-5 py-20 sm:px-8 sm:py-28">
        {etiqueta && <Etiqueta texto={etiqueta} claro={escuro} />}
        {titulo && (
          <h2
            className={`mt-8 text-[3.25rem] break-words sm:text-7xl ${escuro ? 'text-creme' : 'text-ora'}`}
          >
            <Destaque texto={titulo} />
          </h2>
        )}
        <div className={titulo ? 'mt-12' : etiqueta ? 'mt-10' : ''}>{children}</div>
      </div>
    </section>
  )
}
