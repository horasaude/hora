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

export const esquemaAula = z
  .object({
    titulo: titulo(160),
    descricao: z.string().trim().max(5000),
    video_url: linkObrigatorio,
    material_url: linkOpcional,
    liberacao: z.enum(['compra', 'sete', 'outro']),
    dia: z.string(),
  })
  .refine((v) => v.liberacao !== 'outro' || /^[1-9]\d{0,3}$/.test(v.dia), {
    path: ['dia'],
    message: e.dia,
  })
  .transform(({ liberacao, dia, ...resto }) => ({
    ...resto,
    dia_liberacao: liberacao === 'compra' ? 1 : liberacao === 'sete' ? 8 : Number(dia),
  }))

export const esquemaLive = z.object({
  tema: titulo(160),
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

/** Como o dia de liberação aparece no formulário. */
export function liberacaoDoDia(dia: number): {
  liberacao: 'compra' | 'sete' | 'outro'
  dia: string
} {
  if (dia === 1) return { liberacao: 'compra', dia: '1' }
  if (dia === 8) return { liberacao: 'sete', dia: '8' }
  return { liberacao: 'outro', dia: String(dia) }
}
