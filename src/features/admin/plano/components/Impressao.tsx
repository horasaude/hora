import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { CardapioImpresso, useReceitasImpressao } from '@/features/cardapios'
import type { FormCardapio } from '../cardapioForm'

/** Abre a impressão do navegador só com o cardápio (Salvar como PDF) e avisa quando termina. */
export function Impressao({ f, aoTerminar }: { f: FormCardapio; aoTerminar: () => void }) {
  const receitas = useReceitasImpressao(f.refeicoes)
  useEffect(() => {
    const fim = () => aoTerminar()
    window.addEventListener('afterprint', fim)
    const id = window.setTimeout(() => window.print(), 50)
    return () => {
      window.clearTimeout(id)
      window.removeEventListener('afterprint', fim)
    }
  }, [aoTerminar])
  return createPortal(
    <CardapioImpresso
      titulo={f.titulo}
      descricao=""
      guia={f.objetivo || 'Cardápio'}
      refeicoes={f.refeicoes}
      texto={f.modelo === 'texto'}
      receitas={receitas}
    />,
    document.body,
  )
}
