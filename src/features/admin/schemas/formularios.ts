import { z } from 'zod'
import { deCampoBrasilia } from '@/lib/datas'
import { textos } from '../textos'

const e = textos.erros
const titulo = (max: number) => z.string().trim().min(1, e.titulo).max(max, e.titulo)
const linkObrigatorio = z
  .string()
  .trim()
  .regex(/^https:\/\/\S+$/, e.link)
const linkOpcional = z
  .string()
  .trim()
  .refine((v) => v === '' || /^https:\/\/\S+$/.test(v), e.link)
  .transform((v) => v || null)
const quando = z
  .string()
  .refine((v) => deCampoBrasilia(v) !== null, e.data)
  .transform((v) => (deCampoBrasilia(v) ?? new Date()).toISOString())

export const esquemaTema = z.object({
  titulo: titulo(120),
  descricao: z.string().trim().max(2000),
})

export const esquemaEtapa = esquemaTema

/** Aula: o dia de liberação é o dia da preparação (1 a 7) ou o dia dentro da etapa do tema. */
export const esquemaAulaAte = (maxDia: number) =>
  z
    .object({
      titulo: titulo(160),
      descricao: z.string().trim().max(5000),
      video_url: linkObrigatorio,
      profissional: z
        .string()
        .trim()
        .max(80)
        .transform((v) => v || null),
      duracao: z
        .string()
        .trim()
        .refine((v) => v === '' || /^[1-9]\d{0,2}$/.test(v), e.duracao)
        .transform((v) => (v ? Number(v) : null)),
      dia: z
        .string()
        .trim()
        .refine((v) => /^[1-9]\d{0,3}$/.test(v) && Number(v) <= maxDia, e.dia),
    })
    .transform(({ dia, duracao, ...resto }) => ({
      ...resto,
      duracao_minutos: duracao,
      dia_liberacao: Number(dia),
    }))

export const esquemaAula = esquemaAulaAte(9999)

export const esquemaLive = z.object({
  tema: titulo(160),
  profissional: z.enum(['ana', 'clara', 'lais', '']).transform((v) => v || null),
  duracao_minutos: z
    .string()
    .trim()
    .refine((v) => /^\d{2,3}$/.test(v) && Number(v) >= 15 && Number(v) <= 300, e.duracaoLive)
    .transform(Number),
  data: quando,
  convidada: z
    .string()
    .trim()
    .max(120)
    .transform((v) => v || null),
  link_url: linkOpcional,
  gravacao_url: linkOpcional,
})

export const esquemaAviso = z.object({
  titulo: titulo(160),
  texto: z.string().trim().min(1, e.texto).max(5000, e.texto),
  publicar_em: quando,
})

export const esquemaComeceAqui = z.object({
  video_url: linkOpcional,
  texto: z.string().trim().max(5000),
})
export type EntradaComece = z.input<typeof esquemaComeceAqui>
