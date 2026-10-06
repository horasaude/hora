import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { BarraProgresso, BotaoBrilho, EtiquetaBrilho } from './Brilho'

describe('componentes do estilo brilho', () => {
  afterEach(cleanup)

  it('barra de progresso limita de 0 a 100 e mostra o que falta embaixo', () => {
    render(<BarraProgresso pct={140} legenda="Dia 15 de 21 · faltam 6 dias" rotulo="Andamento" />)
    expect(screen.getByRole('progressbar', { name: 'Andamento' })).toHaveAttribute(
      'aria-valuenow',
      '100',
    )
    expect(screen.getByText('Dia 15 de 21 · faltam 6 dias')).toBeInTheDocument()
  })

  it('botão e etiqueta saem em vidro do tom pedido', () => {
    render(
      <>
        <BotaoBrilho tom="coral">Treino</BotaoBrilho>
        <EtiquetaBrilho tom="cinza">Rascunho</EtiquetaBrilho>
      </>,
    )
    expect(screen.getByRole('button', { name: 'Treino' })).toHaveClass('brilho', 'brilho-coral')
    expect(screen.getByRole('button', { name: 'Treino' })).toHaveAttribute('type', 'button')
    expect(screen.getByText('Rascunho')).toHaveClass('brilho', 'brilho-cinza')
  })
})
