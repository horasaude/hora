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
    id: 'comece',
    nome: t.nav.comece,
    icone: 'trilha',
    telas: [
      {
        para: '/app/trilha',
        nome: t.nav.comecePorAqui,
        cor: 'bg-terracota',
        tambem: ['/app/aula', '/app/cardapios', '/app/treinos', '/app/desafios'],
      },
    ],
  },
  {
    id: 'comunidade',
    nome: t.nav.comunidade,
    icone: 'comunidade',
    telas: [
      { para: '/app/lives', nome: t.nav.lives, cor: 'bg-dourado', dourada: true },
      { para: '/app/forum', nome: t.nav.forum, cor: 'bg-[#e0a48f]' },
      { para: '/app/ranking', nome: t.nav.ranking, cor: 'bg-[#8fa7c0]' },
    ],
  },
  {
    id: 'loja',
    nome: t.nav.loja,
    icone: 'loja',
    telas: [{ para: '/app/loja', nome: t.nav.loja, cor: 'bg-[#d9b56a]' }],
  },
  {
    id: 'perfil',
    nome: t.nav.perfil,
    icone: 'perfil',
    telas: [
      {
        para: '/app/perfil',
        nome: t.nav.evolucao,
        cor: 'bg-[#b9a2c4]',
        exata: true,
        tambem: ['/app/perfil/indique'],
      },
      { para: '/app/perfil/conta', nome: t.nav.conta, cor: 'bg-[#8fa7c0]' },
    ],
  },
]

export type ItemMenu = { para: string; nome: string; cor: string; fim?: boolean; live?: boolean }

/** Menu lateral do computador: lista simples, na ordem pedida, com a bolinha de cor de cada item. */
export const MENU_LATERAL: ItemMenu[] = [
  { para: '/app', nome: t.nav.inicio, cor: '#7FB89E', fim: true },
  { para: '/app/trilha', nome: t.nav.comecePorAqui, cor: '#F2643A' },
  { para: '/app/lives', nome: t.nav.lives, cor: '#E9B949', live: true },
  { para: '/app/forum', nome: t.nav.forum, cor: '#D98BA8' },
  { para: '/app/ranking', nome: t.nav.ranking, cor: '#6E9BC9' },
  { para: '/app/loja', nome: t.nav.loja, cor: '#D9B56A' },
  { para: '/app/perfil', nome: t.nav.evolucao, cor: '#B9A2C4', fim: true },
  { para: '/app/perfil/conta', nome: t.nav.conta, cor: '#8FA7C0' },
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
