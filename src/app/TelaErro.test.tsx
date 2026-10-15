import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { TelaErro } from './TelaErro'

describe('TelaErro', () => {
  it('sem configuração, mostra manutenção, Recarregar e o suporte', () => {
    render(<TelaErro tipo="config" />)
    expect(screen.getByRole('heading', { name: 'O ORA está em manutenção' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Recarregar' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Falar com o suporte' })).toHaveAttribute(
      'href',
      expect.stringContaining('wa.me/5534991483885'),
    )
  })
})
