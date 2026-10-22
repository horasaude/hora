import { criarBanco } from './harness.mjs'
import { ID, MENSAL, montar, pedido } from './pagamentos.test.mjs'

const ALUNA = ID(2)
const ADMIN = ID(1)
const etapas = `select coalesce(string_agg(etapa, ','), '') from public.cobrancas_pendentes()`
const atrasar = (dias) =>
  `update public.assinaturas set status = 'inadimplente', inadimplente_desde = now() - interval '${dias} days', fatura_url = 'https://asaas.t/f1' where pedido_id = '${MENSAL}'`
const marcar = `insert into public.avisos_cobranca (pedido_id, etapa, desde) select pedido, etapa, desde from public.cobrancas_pendentes()`

async function preparar(t) {
  await montar(t.db)
  await t.db.exec(`${pedido(MENSAL, 'recorrente', false)};`)
  await t.comoServico()
  await t.db.query(`select public.registrar_assinatura('${MENSAL}', 'mp-a1', now() + interval '1 month')`)
  await t.db.query(`select public.aprovar_pedido('${MENSAL}', '${ALUNA}', now() - interval '40 days')`)
}

async function regua(t) {
  const { esperaValor, db } = t
  await esperaValor('em dia: nada a avisar', etapas, '')
  await esperaValor(
    'assinatura viva entra na conferência diária',
    `select assinatura from public.assinaturas_para_conferir()`,
    'mp-a1',
  )
  await db.query(atrasar(1))
  await esperaValor('1º dia: o e-mail da recusa já foi, régua espera', etapas, '')
  await db.query(atrasar(3))
  await esperaValor('3º dia: lembrete', etapas, 'lembrete')
  await db.query(marcar)
  await esperaValor('lembrete não repete', etapas, '')
  await db.query(atrasar(6))
  await esperaValor('6º dia: véspera da pausa', etapas, 'vespera')
  await db.query(marcar)
  await db.query(atrasar(8))
  await esperaValor('7º dia: suspende', `select public.suspender_inadimplentes()`, 1)
  await esperaValor('acesso pausado avisa', etapas, 'pausado')
  await db.query(marcar)
  await esperaValor('aviso de pausa só uma vez', etapas, '')
}

async function telas(t) {
  const { esperaValor, esperaErro } = t
  await t.comoAluna(ALUNA)
  await esperaValor(
    'aluna pausada vê a fatura para pagar',
    `select pausado::text || ' ' || fatura_url from public.minha_pendencia()`,
    'true https://asaas.t/f1',
  )
  await esperaErro('aluna não lê a régua', etapas, '42501')
  await t.comoAluna(ADMIN)
  await esperaValor(
    'painel mostra a aluna pausada',
    `select cobranca from public.painel_alunas() where id = '${ALUNA}'`,
    'suspensa',
  )
  await t.comoServico()
  await t.db.query(`update public.assinaturas set status = 'ativa', inadimplente_desde = null, fatura_url = null`)
  await t.comoAluna(ALUNA)
  await esperaValor('em dia: sem pendência', `select count(*)::int from public.minha_pendencia()`, 0)
}

export async function testarReguaCobranca() {
  const t = await criarBanco()
  await preparar(t)
  await regua(t)
  await telas(t)
  return t.fim('régua da mensalidade')
}
