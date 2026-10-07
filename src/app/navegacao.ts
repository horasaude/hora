// Navegação da aluna: 5 abas (seções) e as telas de cada uma. As rotas não mudam, só são agrupadas.
import type { NomeIcone } from './IconesNavegacao'
import { textosAluna as t } from './textosAluna'

export type Tela = {
  para: string
  nome: string
  cor: string
  /** Também pertence a esta tela (ex.: a aula abre a partir de Temas). */
  tambem?: string[]
  exata?: boolean
  dourada?: boolean
}
export type Secao = { id: string; nome: string; icone: NomeIcone; telas: Tela[] }

export const SECOES: Secao[] = [
  {
    id: 'inicio',
    nome: t.nav.inicio,
    icone: 'inicio',
    telas: [{ para: '/app', nome: t.nav.inicio, cor: 'bg-salvia', exata: true }],
  },
  {
    id: 'trilhas',
    nome: t.nav.trilhas,
    icone: 'trilha',
    telas: [
      { para: '/app/trilha', nome: t.nav.temas, cor: 'bg-terracota', tambem: ['/app/aula'] },
      { para: '/app/cardapios', nome: t.nav.cardapios, cor: 'bg-salvia' },
    ],
  },
  {
    id: 'desafios',
    nome: t.nav.desafios,
    icone: 'desafios',
    telas: [
      { para: '/app/desafios', nome: t.nav.desafioDoMes, cor: 'bg-ocre' },
      { para: '/app/ranking', nome: t.nav.ranking, cor: 'bg-[#8fa7c0]' },
    ],
  },
  {
    id: 'comunidade',
    nome: t.nav.comunidade,
    icone: 'comunidade',
    telas: [
      { para: '/app/lives', nome: t.nav.lives, cor: 'bg-dourado', dourada: true },
      { para: '/app/forum', nome: t.nav.forum, cor: 'bg-[#e0a48f]' },
      { para: '/app/loja', nome: t.nav.loja, cor: 'bg-[#d9b56a]' },
    ],
  },
  {
    id: 'perfil',
    nome: t.nav.perfil,
    icone: 'perfil',
    telas: [
      { para: '/app/perfil', nome: t.nav.evolucao, cor: 'bg-[#b9a2c4]', exata: true },
      { para: '/app/perfil/conta', nome: t.nav.conta, cor: 'bg-[#8fa7c0]' },
    ],
  },
]

const casa = (caminho: string, base: string, exata?: boolean) =>
  exata
    ? caminho === base || caminho === `${base}/`
    : caminho === base || caminho.startsWith(`${base}/`)

/** Tela aberta pelo endereço (a mais específica vence). */
export function telaAtiva(caminho: string): Tela | null {
  const todas = SECOES.flatMap((s) => s.telas)
  const achadas = todas.filter(
    (tela) =>
      casa(caminho, tela.para, tela.exata) || (tela.tambem ?? []).some((b) => casa(caminho, b)),
  )
  return achadas.sort((a, b) => b.para.length - a.para.length)[0] ?? null
}

/** Seção da tela aberta. */
export function secaoAtiva(caminho: string): Secao | null {
  const tela = telaAtiva(caminho)
  return SECOES.find((s) => s.telas.some((x) => x === tela)) ?? null
}

/** Primeira tela de uma seção (para onde a aba leva). */
export const destino = (s: Secao) => s.telas[0]?.para ?? '/app'
