import { describe, expect, it } from 'vitest'
import { deCupom, errosCupom, formVazio, paraLinha, type CupomLinha } from './cupomForm'

describe('formulário do cupom', () => {
  it('pede código, desconto válido e ao menos uma forma de pagamento', () => {
    const f = { ...formVazio(), codigo: 'A', porcentagem: '95', planos: [], limite: '0' }
    expect(Object.keys(errosCupom(f)).sort()).toEqual(['codigo', 'limite', 'planos', 'valor'])
    expect(errosCupom({ ...formVazio(), codigo: 'ORA10' })).toEqual({})
    expect(errosCupom({ ...formVazio(), codigo: 'ORA10', tipo: 'valor' }).valor).toBeTruthy()
  })

  it('vira a linha do banco e volta igual', () => {
    const f = {
      ...formVazio(),
      codigo: 'NATAL',
      tipo: 'valor' as const,
      centavos: 5000,
      planos: ['pix' as const],
      limite: '20',
      validoAte: '2026-12-25T23:59',
    }
    const linha = paraLinha(f)
    expect(linha).toMatchObject({ codigo: 'NATAL', tipo: 'valor', valor: 5000, limite_usos: 20 })
    expect(linha.valido_ate).toBe('2026-12-26T02:59:00.000Z')
    const volta = deCupom({ ...(linha as CupomLinha), id: 'x', usos: 0 })
    expect(volta).toEqual(f)
  })
})
