// Contas do CRM (Membros) no painel: como estão as alunas e o que entrou de dinheiro.
import { diaEmBrasilia } from '@/lib/datas'
import { acessoAtivo, statusAluna } from './painel'

type Membro = {
  acesso_inicio_em: string | null
  acesso_fim_em: string | null
  ultimo_acesso_em: string | null
  cobranca: string | null
}

export type ResumoMembros = {
  inscritas: number
  ativas: number
  fazendo: number
  atencao: number
  paradas: number
  semAcesso: number
  emAtraso: number
  pausadas: number
}

/** Inscritas = todas; fazendo o processo = entrou nos últimos 3 dias; atenção = 3 a 6 dias sem entrar;
 * paradas = 7 dias ou mais sem entrar (todas com acesso valendo). */
export function resumoMembros(lista: Membro[], agora: Date): ResumoMembros {
  const status = lista.map((m) => statusAluna(m, agora))
  const conta = (s: string) => status.filter((x) => x === s).length
  return {
    inscritas: lista.length,
    ativas: lista.filter((m) => acessoAtivo(m, agora)).length,
    fazendo: conta('em_dia'),
    atencao: conta('atencao'),
    paradas: conta('sumiu'),
    semAcesso: conta('sem_acesso'),
    emAtraso: lista.filter((m) => m.cobranca === 'inadimplente').length,
    pausadas: lista.filter((m) => m.cobranca === 'suspensa').length,
  }
}

type Venda = { status: string; plano: string; valor_centavos: number; aprovado_em: string | null }

export type ResumoVendas = {
  vendasMes: number
  valorMes: number
  vendas: number
  valor: number
  porPlano: Record<'pix' | 'parcelado' | 'recorrente', number>
  devolvidas: number
}

const DEVOLVIDO = ['reembolsado', 'cancelado', 'chargeback']

/** Vendas aprovadas (no mês de hoje em Brasília e no total), por forma de pagamento, e as devolvidas.
 * Valor em centavos, o da compra (na mensal, a primeira cobrança). */
export function resumoVendas(pedidos: Venda[], agora: Date): ResumoVendas {
  const mes = diaEmBrasilia(agora).slice(0, 7)
  const aprovadas = pedidos.filter((p) => p.status === 'aprovado' && p.aprovado_em)
  const doMes = aprovadas.filter((p) =>
    diaEmBrasilia(new Date(p.aprovado_em ?? '')).startsWith(mes),
  )
  const soma = (l: Venda[]) => l.reduce((s, p) => s + p.valor_centavos, 0)
  const porPlano = { pix: 0, parcelado: 0, recorrente: 0 }
  for (const p of aprovadas) if (p.plano in porPlano) porPlano[p.plano as keyof typeof porPlano]++
  return {
    vendasMes: doMes.length,
    valorMes: soma(doMes),
    vendas: aprovadas.length,
    valor: soma(aprovadas),
    porPlano,
    devolvidas: pedidos.filter((p) => DEVOLVIDO.includes(p.status)).length,
  }
}
