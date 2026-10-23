import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { resumoVendas } from '@/domain/crm'
import { formatarData } from '@/lib/datas'
import { formatarCentavos } from '@/lib/moeda'
import { Estado } from '../components/Estado'
import { Quadro } from '../components/Quadro'
import { celula, Etiqueta, Tabela } from '../components/Tabela'
import { AbasCrm } from './AbasCrm'
import { listarVendas, type Venda } from './financeiro.api'
import { t } from './textos'

const f = t.financeiro

function Linhas({ lista }: { lista: Venda[] }) {
  return (
    <Tabela colunas={f.colunas}>
      {lista.map((v) => (
        <tr key={v.id} className="border-b border-[#F4F5F4] last:border-b-0">
          <td className={celula}>
            <span className="block font-bold text-tinta">{v.nome}</span>
            <span className="text-xs text-suave">{v.email}</span>
          </td>
          <td className={celula}>{f.planos[v.plano] ?? v.plano}</td>
          <td className={`${celula} whitespace-nowrap`}>{formatarCentavos(v.valor_centavos)}</td>
          <td className={`${celula} whitespace-nowrap`}>
            {v.aprovado_em ? formatarData(new Date(v.aprovado_em)) : '-'}
          </td>
          <td className={celula}>
            <Etiqueta tom={v.status === 'aprovado' ? 'verde' : 'rosa'}>
              {f.situacoes[v.status] ?? v.status}
            </Etiqueta>
          </td>
        </tr>
      ))}
    </Tabela>
  )
}

/** CRM > Financeiro: vendido no mês e no total, por forma de pagamento, e a lista das vendas. */
export function FinanceiroPage() {
  const q = useQuery({ queryKey: ['admin', 'vendas'], queryFn: listarVendas })
  const [agora] = useState(() => new Date())
  const lista = q.data ?? []
  const r = resumoVendas(lista, agora)
  const c = t.cartoes
  return (
    <Quadro
      titulo={f.titulo}
      numeros={[
        { valor: formatarCentavos(r.valorMes), rotulo: c.valorMes, tom: 'salvia' },
        { valor: String(r.vendasMes), rotulo: c.vendasMes, tom: 'salvia' },
        { valor: formatarCentavos(r.valor), rotulo: c.valor, tom: 'ocre' },
        { valor: String(r.devolvidas), rotulo: c.devolvidas, tom: 'terracota' },
      ]}
    >
      <AbasCrm />
      <p className="text-sm text-suave">
        {f.porPlano(r.porPlano.pix, r.porPlano.parcelado, r.porPlano.recorrente)}
      </p>
      {q.isPending && <Estado tipo="carregando" />}
      {q.isError && <Estado tipo="erro" tentar={() => q.refetch()} />}
      {q.isSuccess && !lista.length && <Estado tipo="vazio" texto={f.vazio} />}
      {q.isSuccess && lista.length > 0 && <Linhas lista={lista} />}
    </Quadro>
  )
}
