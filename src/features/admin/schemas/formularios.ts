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
const c = textos.conteudo

/** Aula: onde fica (tema e etapa), conteúdo e dia de liberação; na preparação, o dia vai até 7. */
export const esquemaAulaPara = (temasPreparacao: string[]) =>
  z
    .object({
      tema: z.string().min(1, c.erroTema),
      etapa: z.string().min(1, c.erroEtapa),
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
        .refine((v) => /^[1-9]\d{0,3}$/.test(v), e.dia),
    })
    .refine((d) => !temasPreparacao.includes(d.tema) || Number(d.dia) <= 7, {
      message: e.dia,
      path: ['dia'],
    })
    .transform(({ dia, duracao, tema: _tema, etapa, ...resto }) => ({
      ...resto,
      etapa_id: etapa,
      duracao_minutos: duracao,
      dia_liberacao: Number(dia),
    }))

export const esquemaAula = esquemaAulaPara([])

const ordem = z
  .string()
  .trim()
  .refine((v) => /^[1-9]\d?$/.test(v), c.erroOrdem)
  .transform(Number)
const cor = z.enum(['verde', 'coral', 'dourado', 'lilas', 'rosa', 'escuro'])

/** Novo tema: nome, frase, cor e ordem. */
export const esquemaNovoTema = z.object({
  titulo: titulo(120),
  descricao: z.string().trim().max(300),
  cor,
  ordem,
})

/** Nova etapa: o tema dela, nome, frase, cor e ordem. */
export const esquemaNovaEtapa = esquemaNovoTema.extend({ tema_id: z.string().min(1, c.erroTema) })

export const esquemaLive = z.object({
  tema: titulo(160),
  duracao_minutos: z
    .string()
    .trim()
    .refine((v) => /^\d{2,3}$/.test(v) && Number(v) >= 15 && Number(v) <= 300, e.duracaoLive)
    .transform(Number),
  data: quando,
  gravacao_url: linkOpcional,
})

/** Convidada da live: nome no cartão e e-mail para entrar na sala e receber o convite. */
export const esquemaConvidada = z.object({
  nome: z.string().trim().min(1).max(120),
  email: z.string().trim().toLowerCase().max(254).pipe(z.email()),
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
