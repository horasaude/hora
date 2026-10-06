import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { usePapel } from '@/features/auth'
import { PainelLayout } from './PainelLayout'

vi.mock('@/features/auth', () => ({ usePapel: vi.fn() }))

function abrir(papel: string | null) {
  vi.mocked(usePapel).mockReturnValue({
    isPending: false,
    isError: false,
    data: papel,
    refetch: vi.fn(),
  } as unknown as ReturnType<typeof usePapel>)
  render(
    <MemoryRouter initialEntries={['/app/admin']}>
      <Routes>
        <Route path="/app" element={<p>Área da aluna</p>} />
        <Route path="/app/admin" element={<PainelLayout />}>
          <Route index element={<p>Conteúdo do painel</p>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  )
}

describe('PainelLayout', () => {
  afterEach(cleanup)

  it('aluna é mandada de volta para a área dela', () => {
    abrir('aluna')
    expect(screen.getByText('Área da aluna')).toBeInTheDocument()
    expect(screen.queryByText('Conteúdo do painel')).not.toBeInTheDocument()
  })

  it('admin vê o painel com as abas', () => {
    abrir('admin')
    expect(screen.getByText('Conteúdo do painel')).toBeInTheDocument()
    for (const aba of ['Conteúdo', 'Lives', 'Avisos']) {
      expect(screen.getByRole('link', { name: aba })).toBeInTheDocument()
    }
  })
})
