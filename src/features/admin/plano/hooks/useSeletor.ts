import { useState } from 'react'
import type { Escolhido, Fonte } from '../components/Resultados'
import { montar, type MedidaEscolhida } from '../opcoes'

/** Estado da escolha de um item: fonte, busca, escolhido, medida e quantidade. */
export function useSeletor(soAlimentos = false) {
  const [fonte, setFonte] = useState<Fonte>('todas')
  const [busca, setBusca] = useState('')
  const [escolhido, setEscolhido] = useState<Escolhido>()
  const [medida, setMedida] = useState<MedidaEscolhida>(null)
  const [qtd, setQtd] = useState('100')
  const quantidade = Number(qtd.replace(',', '.'))
  const escolher = (e: Escolhido) => {
    setEscolhido(e)
    setMedida(null)
    setQtd(e.tipo === 'receita' ? '1' : '100')
  }
  const opcao = escolhido && quantidade > 0 ? montar(escolhido, medida, quantidade) : undefined
  return {
    fontes: soAlimentos
      ? (['todas', 'taco', 'proprio'] as const)
      : (['todas', 'taco', 'proprio', 'receitas'] as const),
    fonte: soAlimentos && fonte === 'receitas' ? 'todas' : fonte,
    setFonte,
    busca,
    setBusca,
    escolhido,
    escolher,
    medida,
    setMedida,
    qtd,
    setQtd,
    opcao,
  }
}

export type Seletor = ReturnType<typeof useSeletor>
