import { z } from 'zod'
import { textos } from '../textos'

const t = textos.apelido

/** Apelido do ranking: 2 a 20 caracteres, letras, números, ponto, traço e sublinhado. */
export const esquemaApelido = z
  .string()
  .trim()
  .min(2, t.curto)
  .max(20, t.curto)
  .regex(/^[\p{L}\p{N}._-]+$/u, t.invalido)
