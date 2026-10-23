import { beforeEach, describe, expect, it, vi } from 'vitest'

const lidos = vi.hoisted(() => ({ linhas: [] as { id: string; tema_id: string | null }[] }))
const update = vi.hoisted(() => vi.fn())
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: () => ({
      select: () => ({ in: async () => ({ data: lidos.linhas, error: null }) }),
      update: (x: unknown) => ({
        eq: async (_c: string, id: string) => (update(x, id), { error: null }),
      }),
    }),
  },
}))
const salvarTreino = vi.hoisted(() => vi.fn(async () => 'copia'))
vi.mock('../treinos/api/treinos.api', () => ({
  buscarTreino: async (id: string) => ({
    treino: { id, tema_id: lidos.linhas.find((x) => x.id === id)?.tema_id ?? null, nome: id },
    itens: [],
  }),
  salvarTreino,
  salvarRotina: vi.fn(),
}))

const { trazerTreinos } = await import('./usarExistente.api')

describe('trazerTreinos', () => {
  beforeEach(() => {
    update.mockClear()
    salvarTreino.mockClear()
  })

  it('mantém os deste tema, copia os de outro e assume os sem tema', async () => {
    lidos.linhas = [
      { id: 'daqui', tema_id: 'detox' },
      { id: 'outro', tema_id: 'lipedema' },
      { id: 'solto', tema_id: null },
    ]
    const dias = [
      { treino_id: 'daqui', dia_semana: 1 },
      { treino_id: 'outro', dia_semana: 3 },
      { treino_id: 'outro', dia_semana: 5 },
      { treino_id: 'solto', dia_semana: 6 },
    ]
    const r = await trazerTreinos(dias, 'detox')
    expect(r.map((x) => x.treino_id)).toEqual(['daqui', 'copia', 'copia', 'solto'])
    expect(salvarTreino).toHaveBeenCalledTimes(1)
    expect(salvarTreino).toHaveBeenCalledWith(
      expect.objectContaining({
        treino: expect.objectContaining({ tema_id: 'detox', publicado: false }),
      }),
    )
    expect(update).toHaveBeenCalledWith({ tema_id: 'detox' }, 'solto')
  })
})
