import { z } from 'zod'
import { CAMPOS_MEDIDA } from '../api/medidas.api'
import { textos } from '../textos'

const t = textos.evolucao

const LIMITES = {
  peso: [20, 400],
  cintura: [20, 300],
  quadril: [20, 300],
  braco: [5, 150],
  coxa: [10, 200],
} as const

/** "72,4" vira 72.4; vazio vira null. */
export function lerDecimal(valor: string): number | null {
  const v = valor.trim().replace(',', '.')
  return v === '' ? null : Number(v)
}

/** Máscara enquanto digita: só números e uma vírgula com uma casa. */
export function mascaraDecimal(valor: string): string {
  const [inteiro = '', decimal] = valor
    .replace('.', ',')
    .replace(/[^\d,]/g, '')
    .split(',')
  return decimal === undefined
    ? inteiro.slice(0, 3)
    : `${inteiro.slice(0, 3)},${decimal.slice(0, 1)}`
}

const campo = (c: keyof typeof LIMITES) =>
  z
    .string()
    .transform(lerDecimal)
    .refine(
      (v) => v === null || (v >= LIMITES[c][0] && v <= LIMITES[c][1]),
      t.invalido(textos.campos[c].nome.toLowerCase()),
    )

/** Registro de medidas: data até hoje, ao menos uma medida dentro dos limites do banco. */
export const esquemaMedida = (hoje: string) =>
  z
    .object({
      dia: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, t.dataInvalida)
        .refine((d) => d <= hoje && d >= '2026-01-01', t.dataInvalida),
      peso: campo('peso'),
      cintura: campo('cintura'),
      quadril: campo('quadril'),
      braco: campo('braco'),
      coxa: campo('coxa'),
      arquivo: z.instanceof(File).nullable(),
    })
    .refine((m) => CAMPOS_MEDIDA.some((c) => m[c] !== null), { message: t.peloMenosUm })
