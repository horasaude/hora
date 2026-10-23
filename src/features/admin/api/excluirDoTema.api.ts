// Excluir de vez o que foi criado dentro do tema (como a aula): cardápio, receita, material, tipo de treino e desafio.
import { supabase } from '@/lib/supabase'
import type { Tables } from '@/types/database'
import { excluirCardapio } from '../plano/api/cardapios.api'
import { excluirMaterialNutricao } from '../plano/api/materiais.api'
import { removerReceita } from '../plano/api/receitas.api'
import { removerRotina } from '../treinos/api/treinos.api'
import { ok, type TabelaConteudo } from './conteudo.api'

async function excluirReceita(id: string) {
  const r: Tables<'receitas'> = ok(
    await supabase.from('receitas').select('*').eq('id', id).single(),
  )
  await removerReceita(r)
}

async function excluirDesafio(id: string) {
  ok(await supabase.from('desafios').delete().eq('id', id))
}

const excluir: Partial<Record<TabelaConteudo, (id: string) => Promise<void>>> = {
  cardapios: excluirCardapio,
  receitas: excluirReceita,
  materiais_nutricao: excluirMaterialNutricao,
  rotinas: removerRotina,
  desafios: excluirDesafio,
}

export const podeExcluir = (tabela: TabelaConteudo) => tabela in excluir

export async function excluirDoTema(tabela: TabelaConteudo, id: string): Promise<void> {
  await excluir[tabela]?.(id)
}
