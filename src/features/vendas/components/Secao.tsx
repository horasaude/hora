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
  /** Sem o botão "Quero entrar na ORA" no fim (só na própria seção de planos). */
  semBotao?: boolean
  /** Chamada do botão para os planos, própria de cada seção. */
  cta?: string
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

/** Botão no fim de cada seção que leva direto aos planos. */
function IrParaPlanos({ texto, claro }: { texto: string; claro: boolean }) {
  return (
    <div className="mt-10 flex justify-center">
      <a
        href="#preco"
        className={`inline-flex min-h-14 w-full items-center justify-center rounded-full px-6 py-3 text-center text-sm leading-snug font-semibold tracking-[0.06em] uppercase transition hover:-translate-y-0.5 sm:w-auto sm:px-10 sm:tracking-[0.16em] ${claro ? 'bg-creme text-ora hover:bg-white' : 'bg-ora text-creme hover:bg-[#233d37]'}`}
      >
        {texto}
      </a>
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

export function Secao({
  id,
  etiqueta,
  titulo,
  fundo = 'creme',
  marca,
  lateral,
  semBotao,
  cta = textos.hero.botao,
  children,
}: Props) {
  const escuro = fundo === 'ora'
  return (
    <section id={id} className={`relative scroll-mt-16 overflow-hidden ${fundos[fundo]}`}>
      {marca && <Marca claro={escuro} />}
      <div data-revelar className="relative mx-auto max-w-5xl px-6 py-14 sm:px-8 sm:py-14">
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
        {!semBotao && <IrParaPlanos texto={cta} claro={escuro} />}
      </div>
    </section>
  )
}
