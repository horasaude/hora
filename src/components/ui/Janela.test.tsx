import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { Janela } from './Janela'

describe('Janela', () => {
  afterEach(cleanup)

  it('abre com título, foca o primeiro campo e fecha com X, Esc e clique fora', () => {
    const aoFechar = vi.fn()
    render(
      <Janela titulo="Nova live" aoFechar={aoFechar} rodape={<button type="button">Salvar</button>}>
        <label>
          Tema
          <input />
        </label>
      </Janela>,
    )
    expect(screen.getByRole('dialog', { name: 'Nova live' })).toBeInTheDocument()
    expect(screen.getByLabelText('Tema')).toHaveFocus()
    fireEvent.click(screen.getByRole('button', { name: 'Fechar' }))
    fireEvent.keyDown(document, { key: 'Escape' })
    fireEvent.mouseDown(screen.getByRole('dialog').parentElement as HTMLElement)
    expect(aoFechar).toHaveBeenCalledTimes(3)
  })

  it('clique dentro da janela não fecha', () => {
    const aoFechar = vi.fn()
    render(
      <Janela titulo="Editar" aoFechar={aoFechar} rodape={null}>
        <p>Corpo</p>
      </Janela>,
    )
    fireEvent.mouseDown(screen.getByText('Corpo'))
    expect(aoFechar).not.toHaveBeenCalled()
  })
})
