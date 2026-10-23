import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { Rodape } from './Fechamento'

describe('Rodape', () => {
  afterEach(cleanup)

  it('tem o WhatsApp ao lado da política de privacidade, abrindo o wa.me com a mensagem', () => {
    render(<Rodape />)
    expect(screen.getByRole('link', { name: 'Política de privacidade' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'WhatsApp' })).toHaveAttribute(
      'href',
      expect.stringMatching(/^https:\/\/wa\.me\/\d+\?text=/),
    )
  })
})
