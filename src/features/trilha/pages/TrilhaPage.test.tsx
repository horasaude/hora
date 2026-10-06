import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import type { AulaTrilha } from '@/domain/trilha'
import { useTrilha } from '../hooks/useTrilha'
import { TrilhaPage } from './TrilhaPage'

vi.mock('@/features/auth', () => ({
  useMeuPerfil: () => ({ data: { acesso_inicio_em: '2026-10-06T14:30:00Z' } }),
}))
vi.mock('../hooks/useTrilha', () => ({ useTrilha: vi.fn() }))

const aula = (id: string, extra: Partial<AulaTrilha>): AulaTrilha => ({
  id,
  tema_id: 't',
  tema_titulo: 'Emagreci Agora',
  etapa_id: 'e',
  etapa_titulo: 'Arrancada',
  titulo: id,
  profissional: 'Ana',
  duracao_minutos: 12,
  dia_liberacao: 1,
  liberada: true,
  concluida: false,
  ...extra,
})

function abrir(dia: number) {
  vi.mocked(useTrilha).mockReturnValue({
    isPending: false,
    isError: false,
    data: {
      dia,
      aulas: [
        aula('O prato que sacia', { concluida: true }),
        aula('Hormônios e fome', {}),
        aula('Lista de compras', { liberada: false, dia_liberacao: 8 }),
      ],
    },
  } as unknown as ReturnType<typeof useTrilha>)
  render(
    <MemoryRouter>
      <TrilhaPage />
    </MemoryRouter>,
  )
}

describe('TrilhaPage', () => {
  afterEach(cleanup)

  it('nos dias 1 a 7 mostra "Comece por aqui" no lugar do tema', () => {
    abrir(3)
    expect(screen.getByRole('heading', { name: 'Comece por aqui' })).toBeInTheDocument()
    expect(screen.getByText('7 dias de preparação')).toBeInTheDocument()
  })

  it('depois do dia 7 mostra o tema; aula fechada sem link e com a data em que abre', () => {
    abrir(9)
    expect(screen.getByRole('heading', { name: 'Emagreci Agora' })).toBeInTheDocument()
    expect(screen.getByText('33% da etapa · semana 2')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Hormônios e fome/ })).toHaveAttribute(
      'href',
      '/app/aula/Hormônios e fome',
    )
    expect(screen.queryByRole('link', { name: /Lista de compras/ })).not.toBeInTheDocument()
    expect(screen.getByText('Abre em 13/10')).toBeInTheDocument()
  })
})
