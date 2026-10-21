import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import type { Item, Opcao } from '@/domain/nutricao'
import { ItensEditor } from './ItensEditor'

const opcao = (nome: string, gramas: number, kcal: number): Opcao => ({
  tipo: 'alimento',
  ref_id: nome,
  nome,
  grupo: '',
  medida: 'g',
  gramas_medida: 1,
  quantidade: gramas,
  gramas,
  nutrientes: { kcal, proteina: 10, carboidrato: 20, gordura: 5, fibra: 1 },
})

const itens: Item[] = [
  { opcoes: [opcao('Pão francês', 50, 150)] },
  { opcoes: [opcao('Ovo cozido', 50, 70), opcao('Queijo branco', 30, 80)] },
  { opcoes: [opcao('Café sem açúcar', 100, 5)] },
]

describe('ItensEditor', () => {
  afterEach(cleanup)

  it('mostra um alimento por linha, o "ou" na mesma linha e o total somando as linhas', () => {
    render(<ItensEditor itens={itens} aoMudar={vi.fn()} />)
    const linhas = screen.getAllByRole('row')
    expect(linhas).toHaveLength(5)
    expect(linhas[2]).toHaveTextContent('Ovo cozido (50 g) ou Queijo branco (30 g)')
    const total = within(linhas[4] as HTMLElement)
    expect(total.getByText('Total')).toBeInTheDocument()
    expect(total.getByText('225 kcal')).toBeInTheDocument()
    expect(total.getByText('200 g')).toBeInTheDocument()
  })

  it('excluir tira só aquela linha', () => {
    const aoMudar = vi.fn()
    render(<ItensEditor itens={itens} aoMudar={aoMudar} />)
    fireEvent.click(screen.getByRole('button', { name: 'Excluir Ovo cozido' }))
    expect(aoMudar).toHaveBeenCalledWith([itens[0], itens[2]])
  })

  it('editar a linha muda a quantidade, mantém o substituto e não cria linha nova', () => {
    const aoMudar = vi.fn()
    render(<ItensEditor itens={itens} aoMudar={aoMudar} />)
    fireEvent.click(screen.getByRole('button', { name: 'Editar Ovo cozido' }))
    const janela = within(screen.getByRole('dialog', { name: 'Editar alimento' }))
    expect(janela.getByText('Alimentos substitutos')).toBeInTheDocument()
    expect(janela.getByText('Queijo branco')).toBeInTheDocument()
    fireEvent.change(janela.getByLabelText('Quantidade'), { target: { value: '100' } })
    fireEvent.click(janela.getByRole('button', { name: 'Salvar' }))
    const novos = aoMudar.mock.calls[0]?.[0] as Item[]
    expect(novos).toHaveLength(3)
    expect(novos[1]?.opcoes.map((o) => [o.nome, o.gramas])).toEqual([
      ['Ovo cozido', 100],
      ['Queijo branco', 30],
    ])
  })

  it('a alça reordena pelo teclado', () => {
    const aoMudar = vi.fn()
    render(<ItensEditor itens={itens} aoMudar={aoMudar} />)
    fireEvent.keyDown(screen.getByRole('button', { name: 'Reordenar Café sem açúcar' }), {
      key: 'ArrowUp',
    })
    expect(aoMudar).toHaveBeenCalledWith([itens[0], itens[2], itens[1]])
  })
})
