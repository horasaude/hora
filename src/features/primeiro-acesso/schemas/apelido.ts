import { z } from 'zod'
import { APELIDO_VALIDO, normalizarApelido } from '@/domain/apelido'
import { textos } from '../textos'

const t = textos.apelido

/** Apelido do ranking: 2 a 20 caracteres, letras, números, ponto, traço e sublinhado. */
export const esquemaApelido = z.preprocess(
  (v) => (typeof v === 'string' ? normalizarApelido(v) : v),
  z.string().min(2, t.curto).max(20, t.curto).regex(APELIDO_VALIDO, t.invalido),
)
