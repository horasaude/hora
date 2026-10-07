import { describe, expect, it } from 'vitest'
import { linkWhatsApp } from './whatsapp'

describe('linkWhatsApp', () => {
  it('põe o 55 quando vem só com DDD', () => {
    expect(linkWhatsApp('(98) 98765-4321')).toBe('https://wa.me/5598987654321')
  })

  it('aceita número que já vem com 55 e codifica a mensagem', () => {
    expect(linkWhatsApp('5598987654321', 'Oi, ORA')).toBe(
      'https://wa.me/5598987654321?text=Oi%2C%20ORA',
    )
  })

  it.each([undefined, '', '1234', '989876543'])('número inválido (%s) devolve null', (n) => {
    expect(linkWhatsApp(n)).toBeNull()
  })
})
