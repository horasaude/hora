// Mensalidade em atraso, de hora em hora pelo pg_cron (x-cron-segredo).
// Às 8h (Brasília) confere no Asaas cada assinatura viva e as compras avulsas dos últimos 60 dias
// (estorno e chargeback), sem depender do aviso do webhook;
// das 8h às 20h manda a régua: lembrete no 3º dia, véspera no 6º e acesso pausado no 7º.
import { asaas } from '../_shared/asaas.ts'
import { emailCobranca, type EtapaCobranca } from '../_shared/email/cobranca.ts'
import { enviarEmail } from '../_shared/email/enviar.ts'
import { linkWhatsApp } from '../_shared/email/modelos.ts'
import { situacaoDaCobranca } from '../_shared/pagamento/status.ts'
import { json, servico, SITE } from '../_shared/servico.ts'
import { avulsa, mensal } from '../pagamento-webhook/processar.ts'

type Pendente = {
  pedido: string
  email: string
  nome: string
  etapa: EtapaCobranca
  desde: string
  fatura_url: string | null
}

const espera = (ms: number) => new Promise((r) => setTimeout(r, ms))
const FUSO = 'America/Sao_Paulo'
const horaEmBrasilia = () =>
  Number(
    new Intl.DateTimeFormat('en-US', { hour: 'numeric', hourCycle: 'h23', timeZone: FUSO }).format(
      new Date(),
    ),
  )
const dataBr = (d: Date) => new Intl.DateTimeFormat('pt-BR', { timeZone: FUSO }).format(d)

/** Passa cada cobrança da assinatura pelo mesmo caminho do webhook; o que já foi tratado volta como repetido. */
async function conferir(): Promise<number> {
  const { data, error } = await servico.rpc('assinaturas_para_conferir')
  if (error) throw new Error(error.message)
  let falhas = 0
  for (const a of (data ?? []) as { pedido: string; assinatura: string }[]) {
    try {
      const { data: cobrancas } = await asaas.cobrancasDaAssinatura(a.assinatura)
      const ordem = [...cobrancas].sort((x, y) => (x.dueDate ?? '').localeCompare(y.dueDate ?? ''))
      for (const c of ordem)
        await mensal(
          { ...c, subscription: c.subscription ?? a.assinatura },
          situacaoDaCobranca('', c),
        )
    } catch (e) {
      falhas++
      console.error('cobranca-diaria conferir', a.pedido, e instanceof Error ? e.message : e)
    }
    await espera(100)
  }
  return falhas
}

/** Pix e parcelado aprovados nos últimos 60 dias: pega estorno ou chargeback cujo aviso se perdeu. */
async function conferirAvulsas(): Promise<number> {
  const { data, error } = await servico.rpc('avulsas_para_conferir')
  if (error) throw new Error(error.message)
  let falhas = 0
  for (const p of (data ?? []) as { pedido: string; cobranca: string }[]) {
    try {
      const c = await asaas.cobranca(p.cobranca)
      await avulsa(c, situacaoDaCobranca('', c))
    } catch (e) {
      falhas++
      console.error('cobranca-diaria avulsa', p.pedido, e instanceof Error ? e.message : e)
    }
    await espera(100)
  }
  return falhas
}

async function regua(): Promise<number> {
  const { data, error } = await servico.rpc('cobrancas_pendentes')
  if (error) throw new Error(error.message)
  let enviados = 0
  for (const c of (data ?? []) as Pendente[]) {
    const email = emailCobranca(c.etapa, {
      site: SITE,
      nome: c.nome,
      whatsapp: linkWhatsApp(Deno.env.get('WHATSAPP_NUMERO')),
      link: c.fatura_url ?? `${SITE}/entrar`,
      pausaEm: dataBr(new Date(Date.parse(c.desde) + 7 * 86_400_000)),
    })
    if (!(await enviarEmail(c.email, email, `cobranca-${c.pedido}-${c.etapa}-${c.desde}`))) continue
    const { error: e } = await servico
      .from('avisos_cobranca')
      .insert({ pedido_id: c.pedido, etapa: c.etapa, desde: c.desde })
    if (e) console.error('cobranca-diaria aviso', c.pedido, e.message)
    enviados++
    await espera(600)
  }
  return enviados
}

Deno.serve(async (req) => {
  const segredo = Deno.env.get('CRON_SEGREDO') ?? ''
  if (req.method !== 'POST' || !segredo || req.headers.get('x-cron-segredo') !== segredo)
    return json({ ok: false }, 401)
  const corpo = (await req.json().catch(() => ({}))) as { conferir?: boolean }
  const hora = horaEmBrasilia()
  try {
    const falhas =
      hora === 8 || corpo.conferir ? (await conferir()) + (await conferirAvulsas()) : null
    const enviados = hora >= 8 && hora <= 20 ? await regua() : 0
    return json({ ok: true, falhas, enviados })
  } catch (e) {
    console.error('cobranca-diaria', e instanceof Error ? e.message : e)
    return json({ ok: false }, 500)
  }
})
