import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import type { AulaTrilha, TemaTrilha } from '@/domain/trilha'
import { ListaTemas } from './ListaTemas'

const aula = (id: string, concluida: boolean): AulaTrilha => ({
  id,
  titulo: id,
  profissional: null,
  duracao_minutos: null,
  dia_liberacao: 1,
  ordem: 1,
  liberada: true,
  em_breve: false,
  capa: null,
  miniatura: null,
  concluida,
})

const tema = (
  id: string,
  inicio: number,
  aberto: boolean,
  aulas: AulaTrilha[] = [],
): TemaTrilha => ({
  id,
  chave: null,
  cor: null,
  titulo: id,
  frase: '',
  capa: null,
  inicio,
  dias: 7,
  aberto,
  em_breve: false,
  aulas,
})

describe('ListaTemas', () => {
  it('mostra aulas e dias do tema aberto e quando abrem os próximos', () => {
    render(
      <MemoryRouter>
        <ListaTemas
          dia={3}
          temas={[
            tema('Detox', 1, true, [aula('a', true), aula('b', false)]),
            tema('Emagrecimento', 8, false),
            tema('Lipedema', 38, false),
          ]}
        />
      </MemoryRouter>,
    )
    expect(screen.getByText('1 de 2 aulas · 7 dias')).toBeInTheDocument()
    expect(screen.getByText('Aberto')).toBeInTheDocument()
    expect(screen.getByText('Abre em 5 dias')).toBeInTheDocument()
    expect(screen.getByText('Abre no dia 38')).toBeInTheDocument()
    expect(screen.getAllByText('Em breve')).toHaveLength(2)
  })
})
