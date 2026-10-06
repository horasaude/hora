import { z } from 'zod'
import type { Configuracao } from '@/domain/configuracao'
import { env } from '@/lib/env'

const esquemaSecao = z.object({ titulo: z.string(), texto: z.string() })
export type Secao = z.infer<typeof esquemaSecao>

const esquemaLinha = z.object({
  pix_cheio: z.number(),
  parcelado_cheio: z.number(),
  recorrente_cheio: z.number(),
  pix_oferta: z.number(),
  parcelado_oferta: z.number(),
  recorrente_oferta: z.number(),
  oferta_inicio: z.string(),
  oferta_fim: z.string(),
  termos: z.array(esquemaSecao),
  privacidade: z.array(esquemaSecao),
  termos_atualizado_em: z.string(),
  privacidade_atualizado_em: z.string(),
})

export type ConfiguracaoPublica = {
  config: Configuracao
  termos: { secoes: Secao[]; atualizado: Date }
  privacidade: { secoes: Secao[]; atualizado: Date }
}

/** Converte a linha do banco; null se vier fora do formato. */
export function deLinha(linha: unknown): ConfiguracaoPublica | null {
  const l = esquemaLinha.safeParse(linha)
  if (!l.success) return null
  const d = l.data
  return {
    config: {
      cheio: { pix: d.pix_cheio, parcelado: d.parcelado_cheio, recorrente: d.recorrente_cheio },
      oferta: { pix: d.pix_oferta, parcelado: d.parcelado_oferta, recorrente: d.recorrente_oferta },
      ofertaInicio: new Date(d.oferta_inicio),
      ofertaFim: new Date(d.oferta_fim),
    },
    termos: { secoes: d.termos, atualizado: new Date(d.termos_atualizado_em) },
    privacidade: { secoes: d.privacidade, atualizado: new Date(d.privacidade_atualizado_em) },
  }
}

/** Lê a configuração pública com fetch simples (sem o cliente do Supabase no pacote inicial). */
export async function buscarConfiguracaoPublica(): Promise<ConfiguracaoPublica | null> {
  const resposta = await fetch(`${env.VITE_SUPABASE_URL}/rest/v1/configuracoes?select=*&limit=1`, {
    headers: {
      apikey: env.VITE_SUPABASE_ANON_KEY,
      Authorization: `Bearer ${env.VITE_SUPABASE_ANON_KEY}`,
    },
  })
  if (!resposta.ok) return null
  const linhas: unknown = await resposta.json()
  return Array.isArray(linhas) ? deLinha(linhas[0]) : null
}
