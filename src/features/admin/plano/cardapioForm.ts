// Estado da página do cardápio e a conversão de/para o banco.
import type { ListaCompras } from '@/domain/listaCompras'
import type { Refeicao, Substituta } from '@/domain/nutricao'
import { buscarCardapio, type CardapioLinha, type RefeicaoModelo } from './api/cardapios.api'
import type { Rascunho } from './components/RefeicaoJanela'
import { lerItens, lerLista, lerRefeicoes } from './schemas/plano'

export type Modelo = 'calculado' | 'texto'
export type FormCardapio = {
  titulo: string
  /** Tema do cardápio: a aluna vê quando o tema abre para ela. */
  tema_id: string
  /** Objetivo do plano (ex.: Emagrecimento, Hipertrofia); o tema pode ter vários. Vazio, o banco grava o nome do tema. */
  objetivo: string
  modelo: Modelo
  refeicoes: Refeicao[]
  lista: ListaCompras
  publicado: boolean
}

export function deCardapio(c?: CardapioLinha, tema = ''): FormCardapio {
  return {
    titulo: c?.titulo ?? '',
    tema_id: c?.tema_id ?? tema,
    objetivo: c?.objetivo ?? '',
    modelo: c?.modelo === 'texto' ? 'texto' : 'calculado',
    refeicoes: lerRefeicoes(c?.refeicoes),
    lista: lerLista(c?.lista_compras),
    publicado: c?.publicado ?? false,
  }
}

export function paraBanco(f: FormCardapio, id?: string) {
  return {
    id,
    titulo: f.titulo.trim(),
    tema_id: f.tema_id || null,
    objetivo: f.objetivo.trim() || (f.tema_id ? '' : 'Sem tema'),
    modelo: f.modelo,
    refeicoes: f.refeicoes,
    lista_compras: f.lista,
    publicado: f.publicado,
  }
}

export const novoId = (): string => crypto.randomUUID()

export const refeicaoDe = (
  r: Rascunho,
  id = novoId(),
  substitutas: Substituta[] = [],
): Refeicao => ({
  id,
  nome: r.nome,
  horario: r.horario,
  itens: r.itens,
  texto: r.texto,
  observacao: r.observacao,
  substitutas,
})

export const rascunhoDe = (
  r?: Pick<Refeicao, 'nome' | 'horario' | 'itens' | 'texto' | 'observacao'>,
): Rascunho => ({
  nome: r?.nome ?? '',
  horario: r?.horario ?? '',
  itens: r?.itens ?? [],
  texto: r?.texto ?? '',
  observacao: r?.observacao ?? '',
})

/** Refeição do cardápio a partir de uma refeição modelo. */
export const refeicaoDoModelo = (m: RefeicaoModelo): Refeicao =>
  refeicaoDe({
    nome: m.nome,
    horario: m.horario?.slice(0, 5) ?? '',
    itens: lerItens(m.itens),
    texto: '',
    observacao: m.observacao,
  })

/** Cópia com ids novos (para duplicar refeição ou carregar de outro cardápio). */
export const copiarRefeicao = (r: Refeicao): Refeicao => ({
  ...r,
  id: novoId(),
  substitutas: r.substitutas.map((s) => ({ ...s, id: novoId() })),
})

/** Refeições de um cardápio salvo, com ids novos (para "Carregar cardápio salvo"). */
export async function refeicoesDoCardapio(id: string) {
  const c = await buscarCardapio(id)
  return {
    modelo: (c.modelo === 'texto' ? 'texto' : 'calculado') as Modelo,
    refeicoes: lerRefeicoes(c.refeicoes).map(copiarRefeicao),
  }
}
