import { z } from 'zod'
import type { Trilha } from '@/domain/trilha'

const aula = z.object({
  id: z.string(),
  titulo: z.string(),
  profissional: z.string().nullable(),
  duracao_minutos: z.number().nullable(),
  dia_liberacao: z.number(),
  ordem: z.number(),
  liberada: z.boolean(),
  concluida: z.boolean(),
})

/** Formato do jsonb devolvido por trilha_aluna(). */
export const esquemaTrilha: z.ZodType<Trilha> = z.object({
  dia: z.number().nullable(),
  tema_atual: z.string().nullable().default(null),
  temas: z
    .array(
      z.object({
        id: z.string(),
        chave: z.string().nullable(),
        titulo: z.string(),
        frase: z.string(),
      }),
    )
    .default([]),
  preparacao: z.array(aula).default([]),
  etapas: z
    .array(
      z.object({
        id: z.string(),
        chave: z.string().nullable(),
        titulo: z.string(),
        ordem: z.number(),
        iniciada_em: z.string().nullable(),
        dia_na_etapa: z.number().nullable(),
        aulas: z.array(aula),
      }),
    )
    .default([]),
})
