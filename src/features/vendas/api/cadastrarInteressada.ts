import { VERSAO_CONTRATO } from '@/domain/termos'
import { env } from '@/lib/env'
import { soDigitos } from '@/lib/telefone'
import { utmsGuardadas } from '@/lib/utm'
import type { Cadastro } from '../schemas/cadastro'

const URL_FUNCAO = `${env.VITE_SUPABASE_URL}/functions/v1/cadastrar-interessada`

/** Envia para a Edge Function, que valida e grava. Lança erro se não gravou. */
export async function cadastrarInteressada(dados: Cadastro): Promise<void> {
  const resposta = await fetch(URL_FUNCAO, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nome: dados.nome,
      email: dados.email,
      whatsapp: soDigitos(dados.whatsapp),
      plano: dados.plano,
      aceite: dados.aceite,
      versaoTermos: VERSAO_CONTRATO,
      origem: document.referrer.slice(0, 500) || undefined,
      utm: utmsGuardadas(),
      site: dados.site ?? '',
    }),
  })
  const corpo: unknown = await resposta.json().catch(() => null)
  const ok = typeof corpo === 'object' && corpo !== null && 'ok' in corpo && corpo.ok === true
  if (!resposta.ok || !ok) throw new Error('cadastro não gravado')
}
