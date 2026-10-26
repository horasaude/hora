import { deCampoBrasilia, paraCampoBrasilia } from '@/lib/datas'
import { PLANOS, type Plano } from '@/domain/precos'
import type { Tables, TablesInsert } from '@/types/database'
import { cupons as t } from '../textos/cupons'

export type CupomLinha = Tables<'cupons'> & { usos: number }

export type FormCupom = {
  codigo: string
  tipo: 'porcentagem' | 'valor'
  porcentagem: string
  centavos: number
  planos: Plano[]
  limite: string
  validoAte: string
  ativo: boolean
}

export const formVazio = (): FormCupom => ({
  codigo: '',
  tipo: 'porcentagem',
  porcentagem: '10',
  centavos: 0,
  planos: [...PLANOS],
  limite: '',
  validoAte: '',
  ativo: true,
})

export function deCupom(c: CupomLinha): FormCupom {
  return {
    codigo: c.codigo,
    tipo: c.tipo === 'valor' ? 'valor' : 'porcentagem',
    porcentagem: c.tipo === 'valor' ? '10' : String(c.valor),
    centavos: c.tipo === 'valor' ? c.valor : 0,
    planos: PLANOS.filter((p) => c.planos.includes(p)),
    limite: c.limite_usos ? String(c.limite_usos) : '',
    validoAte: c.valido_ate ? paraCampoBrasilia(new Date(c.valido_ate)) : '',
    ativo: c.ativo,
  }
}

export type ErrosCupom = Partial<Record<'codigo' | 'valor' | 'planos' | 'limite' | 'data', string>>

export function errosCupom(f: FormCupom): ErrosCupom {
  const e: ErrosCupom = {}
  if (!/^[A-Z0-9]{3,20}$/.test(f.codigo)) e.codigo = t.erros.codigo
  const pct = Number(f.porcentagem)
  if (f.tipo === 'porcentagem' && !(Number.isInteger(pct) && pct >= 1 && pct <= 90))
    e.valor = t.erros.porcentagem
  if (f.tipo === 'valor' && f.centavos <= 0) e.valor = t.erros.valor
  if (!f.planos.length) e.planos = t.erros.planos
  if (f.limite && !/^[1-9]\d{0,6}$/.test(f.limite)) e.limite = t.erros.limite
  if (f.validoAte && !deCampoBrasilia(f.validoAte)) e.data = t.erros.data
  return e
}

/** Linha para o banco. Chame só com errosCupom vazio. */
export function paraLinha(f: FormCupom): TablesInsert<'cupons'> {
  return {
    codigo: f.codigo,
    tipo: f.tipo,
    valor: f.tipo === 'porcentagem' ? Number(f.porcentagem) : f.centavos,
    planos: f.planos,
    limite_usos: f.limite ? Number(f.limite) : null,
    valido_ate: f.validoAte ? (deCampoBrasilia(f.validoAte)?.toISOString() ?? null) : null,
    ativo: f.ativo,
  }
}
