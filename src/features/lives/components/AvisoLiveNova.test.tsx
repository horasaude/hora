import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import type { Live } from '../api/lives.api'
import { AvisoLiveNova } from './AvisoLiveNova'

const lista: { data: Live[] } = { data: [] }
vi.mock('../hooks/useLives', () => ({
  useLives: () => lista,
  useAgora: () => new Date('2026-11-18T12:00:00Z'),
}))

const base = {
  id: 'l1',
  tema: 'Como manter o foco em dezembro',
  data: '2026-11-19T23:00:00Z',
  profissionais: ['ana'],
  duracao_minutos: 60,
  gravacao_url: null,
  descricao: '',
  capa_path: null,
  capa: null,
  lembrete: false,
  presente: false,
} as Live

const ver = (lives: Live[]) => {
  lista.data = lives
  return render(
    <MemoryRouter>
      <AvisoLiveNova />
    </MemoryRouter>,
  )
}

describe('AvisoLiveNova', () => {
  beforeEach(() => localStorage.clear())
  afterEach(cleanup)

  it('avisa da live nova com tema, dia, profissional e o caminho para as lives', () => {
    ver([base])
    expect(screen.getByRole('dialog', { name: 'Tem live nova' })).toBeInTheDocument()
    expect(screen.getByText('Como manter o foco em dezembro')).toBeInTheDocument()
    expect(screen.getByText('quinta, 20h · 19/11')).toBeInTheDocument()
    expect(screen.getByText('Com Ana Milhomem')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Ver a live' })).toHaveAttribute('href', '/app/lives')
  })

  it('depois do Entendi não aparece de novo para a mesma live', () => {
    ver([base])
    fireEvent.click(screen.getByRole('button', { name: 'Entendi' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    cleanup()
    ver([base])
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('live que já acabou não avisa', () => {
    ver([{ ...base, data: '2026-11-17T23:00:00Z' }])
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('live marcada depois avisa de novo', () => {
    localStorage.setItem('ora-lives-vistas', JSON.stringify(['l1']))
    ver([base, { ...base, id: 'l2', tema: 'Treino em casa', data: '2026-11-25T23:00:00Z' }])
    expect(screen.getByText('Treino em casa')).toBeInTheDocument()
  })
})
