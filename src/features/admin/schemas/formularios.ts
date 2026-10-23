import { z } from 'zod'
import { liberacaoPara } from '@/domain/liberacao'
import { deCampoBrasilia } from '@/lib/datas'
import { textos } from '../textos'
import { liberacao as tl } from '../textos/liberacao'

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
/** Disponível, Em breve ou Liberar em (data e hora de Brasília), já nas colunas do banco. */
export const esquemaLiberacao = z
  .object({ modo: z.enum(['aberta', 'breve', 'data']), quando: z.string() })
  .refine((l) => l.modo !== 'data' || deCampoBrasilia(l.quando) !== null, {
    message: tl.erroData,
    path: ['quando'],
  })
  .transform((l) => liberacaoPara(l.modo, deCampoBrasilia(l.quando)))

const quando = z
  .string()
  .refine((v) => deCampoBrasilia(v) !== null, e.data)
  .transform((v) => (deCampoBrasilia(v) ?? new Date()).toISOString())

export const esquemaTema = z.object({
  titulo: titulo(120),
  descricao: z.string().trim().max(2000),
})

export const esquemaEtapa = esquemaTema

/** Nome e descrição; no tema também a liberação para a aluna. */
export const esquemaNome = esquemaTema
  .extend({
    liberacao: esquemaLiberacao.optional(),
    dias: z
      .string()
      .trim()
      .refine((v) => /^\d{1,3}$/.test(v) && Number(v) >= 0 && Number(v) <= 365, tl.erroDias)
      .optional(),
  })
  .transform(({ liberacao, dias, ...resto }) => ({
    ...resto,
    ...liberacao,
    ...(dias ? { dias_liberado: Number(dias) } : {}),
  }))

/** Aula: o dia de liberação é o dia da preparação (1 a 7) ou o dia dentro da etapa do tema. */
const c = textos.conteudo

/** Aula: o tema dela, o conteúdo e a liberação (abre junto com o tema, salvo Em breve ou data). */
export const esquemaAula = z
  .object({
    tema: z.string().min(1, c.erroTema),
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
    liberacao: esquemaLiberacao,
  })
  .transform(({ duracao, liberacao, ...resto }) => ({
    ...resto,
    ...liberacao,
    duracao_minutos: duracao,
  }))

const cor = z.enum(['verde', 'coral', 'dourado', 'lilas', 'rosa', 'escuro'])

/** Novo tema: nome, frase, cor e quantos dias dura até abrir o próximo. Entra no fim da sequência. */
export const esquemaNovoTema = z
  .object({
    titulo: titulo(120),
    descricao: z.string().trim().max(300),
    cor,
    dias: z
      .string()
      .trim()
      .refine((v) => /^\d{1,3}$/.test(v) && Number(v) >= 0 && Number(v) <= 365, tl.erroDias),
  })
  .transform(({ dias, ...resto }) => ({ ...resto, dias_liberado: Number(dias) }))

export const esquemaLive = z.object({
  tema: titulo(160),
  duracao_minutos: z
    .string()
    .trim()
    .refine((v) => /^\d{2,3}$/.test(v) && Number(v) >= 15 && Number(v) <= 300, e.duracaoLive)
    .transform(Number),
  data: quando,
  gravacao_url: linkOpcional,
  descricao: z.string().trim().max(2000),
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
