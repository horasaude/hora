import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { ConsultaIndividual } from './ConsultaIndividual'

describe('ConsultaIndividual', () => {
  afterEach(cleanup)

  it('cada profissional abre o WhatsApp dela com a mensagem pronta', () => {
    render(<ConsultaIndividual />)
    const mensagem = encodeURIComponent(
      'Sou aluna da ORA e gostaria de agendar uma consulta individual.',
    )
    const links = screen
      .getAllByRole('link', { name: /WhatsApp/ })
      .map((a) => a.getAttribute('href'))
    expect(links).toEqual([
      `https://wa.me/5534993159319?text=${mensagem}`,
      `https://wa.me/5534991463277?text=${mensagem}`,
      `https://wa.me/5534998333744?text=${mensagem}`,
    ])
  })

  it('a logo do Instagram abre o perfil de cada profissional', () => {
    render(<ConsultaIndividual />)
    const links = screen
      .getAllByRole('link', { name: /Instagram de/ })
      .map((a) => a.getAttribute('href'))
    expect(links).toEqual([
      'https://www.instagram.com/aanamilhomem/',
      'https://www.instagram.com/dra.claramariard/',
      'https://www.instagram.com/nutrilaismoraes/',
    ])
  })
})
