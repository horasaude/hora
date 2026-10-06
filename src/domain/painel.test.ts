import { describe, expect, it } from 'vitest'
import { acessoAtivo, progressoDesafio, situacaoDesafio, statusAluna } from './painel'

describe('situacaoDesafio', () => {
  const d = { publicado: true, inicio: '2026-11-01', fim: '2026-11-21', encerrado_em: null }
  it('agendado antes do início, ativo no período, encerrado depois do fim', () => {
    expect(situacaoDesafio(d, '2026-10-31')).toBe('agendado')
    expect(situacaoDesafio(d, '2026-11-01')).toBe('ativo')
    expect(situacaoDesafio(d, '2026-11-21')).toBe('ativo')
    expect(situacaoDesafio(d, '2026-11-22')).toBe('encerrado')
  })
  it('rascunho e encerrado à mão', () => {
    expect(situacaoDesafio({ ...d, publicado: false }, '2026-11-05')).toBe('rascunho')
    expect(situacaoDesafio({ ...d, encerrado_em: '2026-11-05T12:00:00Z' }, '2026-11-05')).toBe(
      'encerrado',
    )
  })
})

describe('statusAluna', () => {
  const agora = new Date('2026-10-20T12:00:00Z')
  const base = { acesso_inicio_em: '2026-10-01T12:00:00Z', acesso_fim_em: null }
  const entrou = (dias: number) => ({
    ...base,
    ultimo_acesso_em: new Date(agora.getTime() - dias * 86_400_000).toISOString(),
  })
  it('em dia até 2 dias, atenção de 3 a 6, sumiu a partir de 7', () => {
    expect(statusAluna(entrou(2), agora)).toBe('em_dia')
    expect(statusAluna(entrou(3), agora)).toBe('atencao')
    expect(statusAluna(entrou(6), agora)).toBe('atencao')
    expect(statusAluna(entrou(7), agora)).toBe('sumiu')
  })
  it('sem entrada conta do início; sem acesso ativo fica à parte', () => {
    expect(statusAluna({ ...base, ultimo_acesso_em: null }, agora)).toBe('sumiu')
    expect(
      statusAluna({ acesso_inicio_em: null, acesso_fim_em: null, ultimo_acesso_em: null }, agora),
    ).toBe('sem_acesso')
    expect(
      acessoAtivo(
        { ...base, acesso_fim_em: '2026-10-19T00:00:00Z', ultimo_acesso_em: null },
        agora,
      ),
    ).toBe(false)
  })
})

describe('progressoDesafio', () => {
  const d = { inicio: '2026-11-01', fim: '2026-11-21' }
  it('dia 15 de 21 deixa 6 dias faltando', () => {
    expect(progressoDesafio(d, '2026-11-15')).toEqual({ dia: 15, total: 21, faltam: 6, pct: 71 })
  })
  it('antes do início é 0; depois do fim fica no último dia', () => {
    expect(progressoDesafio(d, '2026-10-30').dia).toBe(0)
    expect(progressoDesafio(d, '2026-12-01')).toMatchObject({ dia: 21, faltam: 0, pct: 100 })
  })
})
