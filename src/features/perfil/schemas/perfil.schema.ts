import { z } from 'zod'
import { textos } from '../textos'

const t = textos.config

/** Apelido do ranking: a mesma regra do primeiro acesso (2 a 20, letras, números, ponto, traço e sublinhado). */
export const esquemaApelido = z
  .string()
  .trim()
  .min(2, textos.apelidoInvalido)
  .max(20, textos.apelidoInvalido)
  .regex(/^[\p{L}\p{N}._-]+$/u, textos.apelidoInvalido)

/** Nova senha: 8 ou mais caracteres e repetida igual. */
export const esquemaSenha = z
  .object({ senha: z.string().min(8, t.senhaCurta), repetir: z.string() })
  .refine((d) => d.senha === d.repetir, { message: t.senhaDiferente })
