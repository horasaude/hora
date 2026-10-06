import { z } from 'zod'
import { textos } from '../textos'

const e = textos.erros
const d = textos.desafios.erros
const texto = (max: number) => z.string().trim().max(max)
const obrigatorio = (max: number) => z.string().trim().min(1, e.titulo).max(max, e.titulo)
const inteiro = (min: number) =>
  z
    .string()
    .trim()
    .regex(/^\d{1,6}$/, d.inteiro)
    .transform(Number)
    .refine((n) => n >= min, d.inteiro)
const data = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, d.data)

const DIA_MS = 86_400_000
const diasEntre = (inicio: string, fim: string) =>
  Math.round((Date.parse(fim) - Date.parse(inicio)) / DIA_MS) + 1

export const esquemaDesafio = z
  .object({
    nome: obrigatorio(120),
    descricao: texto(2000),
    inicio: data,
    fim: data,
    tipo_checkin: z.enum(['sim_nao', 'foto', 'numero']),
    unidade: texto(40),
    meta_diaria: z.string().trim(),
    meta_dias: inteiro(1),
    pontos_por_dia: inteiro(0),
    bonus_conclusao: inteiro(0),
    premio: texto(500),
    publico: z.enum(['todas', 'inscritas']),
  })
  .refine((v) => v.fim >= v.inicio, { path: ['fim'], message: d.periodo })
  .refine((v) => v.fim < v.inicio || v.meta_dias <= diasEntre(v.inicio, v.fim), {
    path: ['meta_dias'],
    message: d.metaDias,
  })
  .refine(
    (v) =>
      v.tipo_checkin !== 'numero' || (v.unidade !== '' && /^[1-9]\d{0,5}$/.test(v.meta_diaria)),
    { path: ['meta_diaria'], message: d.numero },
  )
  .transform(({ unidade, meta_diaria, ...resto }) => {
    const numero = resto.tipo_checkin === 'numero'
    return {
      ...resto,
      unidade: numero ? unidade : null,
      meta_diaria: numero ? Number(meta_diaria) : null,
    }
  })
