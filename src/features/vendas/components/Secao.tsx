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
  /** No computador, título à esquerda e conteúdo à direita (menos espaço vazio). */
  lateral?: boolean
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
      className={`pointer-events-none absolute -top-10 -right-24 font-titulo text-[22rem] leading-none select-none sm:-right-10 ${claro ? 'text-creme/[0.06]' : 'text-salvia/[0.12]'}`}
    >
      A
    </span>
  )
}

export function Secao({ id, etiqueta, titulo, fundo = 'creme', marca, lateral, children }: Props) {
  const escuro = fundo === 'ora'
  return (
    <section id={id} className={`relative scroll-mt-16 overflow-hidden ${fundos[fundo]}`}>
      {marca && <Marca claro={escuro} />}
      <div data-revelar className="relative mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
        {etiqueta && <Etiqueta texto={etiqueta} claro={escuro} />}
        <div
          className={lateral ? 'lg:grid lg:grid-cols-[0.8fr_1.2fr] lg:items-start lg:gap-12' : ''}
        >
          {titulo && (
            <h2
              className={`mt-3 text-[2.5rem] break-words sm:text-5xl lg:text-6xl ${escuro ? 'text-creme' : 'text-ora'}`}
            >
              <Destaque texto={titulo} />
            </h2>
          )}
          <div className={titulo ? (lateral ? 'mt-6 lg:mt-4' : 'mt-6') : etiqueta ? 'mt-5' : ''}>
            {children}
          </div>
        </div>
      </div>
    </section>
  )
}
