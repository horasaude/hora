import { z } from 'zod'
import { TIPOS_TREINO, textos } from '../textos'

const t = textos.foto
const tipos = TIPOS_TREINO.map((x) => x.id) as [string, ...string[]]

/** Treino: foto obrigatória, tipo da lista e duração opcional de 1 a 600 minutos. */
export const esquemaTreino = z.object({
  arquivo: z.instanceof(File, { message: t.falta }),
  tipoTreino: z.enum(tipos, { message: t.faltaTipo }),
  duracao: z
    .string()
    .trim()
    .transform((v) => (v === '' ? null : Number(v)))
    .refine((v) => v === null || (Number.isInteger(v) && v >= 1 && v <= 600), t.duracaoInvalida),
})

/** Refeição: só a foto. */
export const esquemaRefeicao = z.object({ arquivo: z.instanceof(File, { message: t.falta }) })
