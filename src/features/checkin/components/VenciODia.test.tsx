import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { VenciODia } from './VenciODia'

const hoje = vi.hoisted(() => ({ lista: [] as string[] }))
vi.mock('../hooks/useCheckin', () => ({
  useMeusCheckins: () => ({ data: { hoje: hoje.lista } }),
  usePontosDoDia: () => ({ data: [{ acao: 'venci', pontos: 5 }] }),
}))

describe('Venci o dia', () => {
  afterEach(cleanup)

  it('espera os 4 hábitos enquanto o banco não marcou', () => {
    hoje.lista = ['sono', 'agua']
    render(<VenciODia />)
    expect(screen.getByRole('status')).toHaveTextContent('Marca sozinho')
  })

  it('fica dourado quando o banco marca venci', () => {
    hoje.lista = ['sono', 'agua', 'dieta', 'treino', 'venci']
    render(<VenciODia />)
    expect(screen.getByRole('status')).toHaveTextContent('Você venceu o dia!')
    expect(screen.getByRole('status')).toHaveTextContent('+5 pts')
  })
})
