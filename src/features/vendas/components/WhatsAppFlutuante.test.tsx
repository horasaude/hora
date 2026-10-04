import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { WhatsAppFlutuante } from './WhatsAppFlutuante'

describe('WhatsAppFlutuante', () => {
  afterEach(cleanup)

  it('com número, abre o wa.me com a mensagem', () => {
    render(<WhatsAppFlutuante numero="98987654321" />)
    expect(screen.getByRole('link', { name: 'Falar no WhatsApp' })).toHaveAttribute(
      'href',
      expect.stringMatching(/^https:\/\/wa\.me\/5598987654321\?text=/),
    )
  })

  it('sem número, não aparece', () => {
    render(<WhatsAppFlutuante numero={undefined} />)
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })
})
