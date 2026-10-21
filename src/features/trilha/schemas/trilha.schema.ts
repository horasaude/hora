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
  em_breve: z.boolean().default(false),
  capa: z.string().nullable().default(null),
  miniatura: z.string().nullable().default(null),
  concluida: z.boolean(),
})

/** Formato do jsonb devolvido por trilha_aluna() e trilha_previa(). */
export const esquemaTrilha: z.ZodType<Trilha> = z.object({
  dia: z.number().nullable(),
  temas: z
    .array(
      z.object({
        id: z.string(),
        chave: z.string().nullable(),
        cor: z.string().nullable().default(null),
        titulo: z.string(),
        frase: z.string(),
        capa: z.string().nullable().default(null),
        inicio: z.number(),
        dias: z.number(),
        aberto: z.boolean(),
        em_breve: z.boolean().default(false),
        aulas: z.array(aula),
      }),
    )
    .default([]),
})
