import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import type { RotinaAluna, TreinoResumo } from '../api/treinos.api'
import { CartaoTipo } from './CartaoTipo'

const treino = (id: string, categoria: string) => ({ id, categoria, nome: id }) as TreinoResumo

const rotina: RotinaAluna = {
  id: 'r1',
  nome: 'Emagrecimento',
  tema_id: 't1',
  nivel: 'iniciante',
  local: 'casa',
  tipo: 'semana',
  objetivo: 'reducao_gordura',
  orientacoes: '',
  descricao: '',
  publicado: true,
  created_at: '',
  updated_at: '',
  dias: [
    { dia_semana: 1, ordem: 0, treino: treino('A', 'musculacao') },
    { dia_semana: 1, ordem: 1, treino: treino('Bike', 'aerobico') },
    { dia_semana: 3, ordem: 2, treino: treino('B', 'musculacao') },
  ],
}

describe('cartão do tipo de treino', () => {
  afterEach(cleanup)

  it('mostra nome, objetivo, nível, local e quantos treinos e aeróbicos tem na semana', () => {
    render(<CartaoTipo rotina={rotina} paraVoce={false} aoAbrir={() => undefined} />)
    expect(screen.getByText('Emagrecimento')).toBeInTheDocument()
    expect(screen.getByText('Redução de gordura')).toBeInTheDocument()
    expect(screen.getByText('Iniciante')).toBeInTheDocument()
    expect(screen.getByText('Casa')).toBeInTheDocument()
    expect(screen.getByText('2 treinos na semana · 1 aeróbico')).toBeInTheDocument()
    expect(screen.queryByText('Para você')).not.toBeInTheDocument()
  })

  it('destaca o que combina com ela e abre ao tocar', () => {
    const abrir = vi.fn()
    render(<CartaoTipo rotina={rotina} paraVoce aoAbrir={abrir} />)
    expect(screen.getByText('Para você')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button'))
    expect(abrir).toHaveBeenCalledOnce()
  })
})
