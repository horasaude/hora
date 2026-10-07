// Monta a opção de um item de refeição a partir do alimento (medida e quantidade) ou da receita (porções).
import { multiplicar, nutrientesDe, porPorcao, type Opcao, type Por100 } from '@/domain/nutricao'
import type { Alimento } from './api/alimentos.api'
import type { ReceitaCompleta } from './api/receitas.api'
import type { Escolhido } from './components/Resultados'

export type MedidaEscolhida = { nome: string; gramas: number } | null

export const por100De = (
  a: Pick<Alimento, 'kcal' | 'proteina' | 'carboidrato' | 'gordura' | 'fibra'>,
): Por100 => ({
  kcal: a.kcal,
  proteina: a.proteina,
  carboidrato: a.carboidrato,
  gordura: a.gordura,
  fibra: a.fibra,
})

/** Medida null = gramas. */
export function opcaoDeAlimento(a: Alimento, medida: MedidaEscolhida, quantidade: number): Opcao {
  const gramasMedida = medida ? medida.gramas : 1
  const gramas = gramasMedida * quantidade
  return {
    tipo: 'alimento',
    ref_id: a.id,
    nome: a.nome,
    grupo: a.grupo,
    medida: medida ? medida.nome : 'g',
    gramas_medida: gramasMedida,
    quantidade,
    gramas,
    nutrientes: nutrientesDe(por100De(a), gramas),
  }
}

export function porcaoDaReceita(r: ReceitaCompleta) {
  return porPorcao(
    r.receita_itens.map((i) => ({ por100: por100De(i.alimentos), gramas: i.gramas })),
    r.porcoes,
  )
}

export function opcaoDeReceita(r: ReceitaCompleta, porcoes: number): Opcao {
  return {
    tipo: 'receita',
    ref_id: r.id,
    nome: r.nome,
    grupo: '',
    medida: 'porção',
    gramas_medida: 0,
    quantidade: porcoes,
    gramas: 0,
    nutrientes: multiplicar(porcaoDaReceita(r), porcoes),
  }
}

export { rotuloOpcao } from '@/domain/nutricao'

/** Opção do que foi escolhido na janela de adicionar alimento. */
export function montar(e: Escolhido, medida: MedidaEscolhida, qtd: number): Opcao {
  return e.tipo === 'alimento' ? opcaoDeAlimento(e.a, medida, qtd) : opcaoDeReceita(e.r, qtd)
}
