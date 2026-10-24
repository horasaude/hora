import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { esquemaRefeicao } from '../schemas/treino.schema'
import { CamposRefeicao } from './CamposRefeicao'

describe('CamposRefeicao', () => {
  afterEach(cleanup)

  it('mostra as 4 refeições e bloqueia as já enviadas hoje', () => {
    const escolher = vi.fn()
    render(<CamposRefeicao refeicao="" setRefeicao={escolher} enviadas={['almoco']} />)
    expect(screen.getByLabelText('Almoço')).toBeDisabled()
    fireEvent.click(screen.getByLabelText('Jantar'))
    expect(escolher).toHaveBeenCalledWith('jantar')
    expect(screen.getByLabelText('Café da manhã')).toBeEnabled()
    expect(screen.getByLabelText('Lanche')).toBeEnabled()
  })

  it('foto da refeição exige dizer qual refeição é', () => {
    const arquivo = new File(['x'], 'p.jpg', { type: 'image/jpeg' })
    expect(esquemaRefeicao.safeParse({ arquivo, refeicao: '' }).success).toBe(false)
    expect(esquemaRefeicao.safeParse({ arquivo, refeicao: 'lanche' }).success).toBe(true)
  })
})
