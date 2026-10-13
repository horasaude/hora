import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { CampoSenha } from './CampoSenha'

describe('CampoSenha', () => {
  afterEach(cleanup)

  it('o olhinho mostra e esconde o que foi digitado', () => {
    render(<CampoSenha id="s" rotulo="Senha" defaultValue="segredo123" />)
    const campo = screen.getByLabelText<HTMLInputElement>('Senha')
    expect(campo.type).toBe('password')
    fireEvent.click(screen.getByRole('button', { name: 'Mostrar senha' }))
    expect(campo.type).toBe('text')
    fireEvent.click(screen.getByRole('button', { name: 'Esconder senha' }))
    expect(campo.type).toBe('password')
  })
})
