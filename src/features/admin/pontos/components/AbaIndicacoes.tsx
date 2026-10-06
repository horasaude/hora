import { EtiquetaBrilho } from '@/components/ui'
import { formatarData } from '@/lib/datas'
import { Estado } from '../../components/Estado'
import { Tabela } from '../../components/Tabela'
import { useIndicacoes } from '../hooks/usePontos'
import { t } from '../textos'

const i = t.indicacoes
const TOM = { aguardando: 'dourado', confirmada: 'verde', cancelada: 'coral' } as const

/** Indicações: quem indicou, quem entrou, data e situação (150 pontos só depois da garantia). */
export function AbaIndicacoes() {
  const lista = useIndicacoes()
  if (lista.isPending) return <Estado tipo="carregando" />
  if (lista.isError) return <Estado tipo="erro" tentar={() => lista.refetch()} />
  if (lista.data.length === 0) return <Estado tipo="vazio" texto={i.vazio} />
  return (
    <Tabela colunas={i.colunas}>
      {lista.data.map((x) => (
        <tr key={x.id} className="border-b border-[#F4F5F4] last:border-b-0">
          <td className="px-3.5 py-3">
            <span className="block font-bold text-tinta">{x.indicadora?.nome ?? '-'}</span>
            <span className="block text-xs text-suave">{x.indicadora?.codigo_indicacao}</span>
          </td>
          <td className="px-3.5 py-3">
            <span className="block text-tinta">
              {x.indicada?.nome || x.indicada_nome || x.indicada_email}
            </span>
            <span className="block text-xs text-suave">{x.indicada_email}</span>
          </td>
          <td className="px-3.5 py-3 text-suave">
            {formatarData(new Date(x.compra_confirmada_em))}
          </td>
          <td className="px-3.5 py-3 text-suave">{formatarData(new Date(x.garantia_ate))}</td>
          <td className="px-3.5 py-3">
            <EtiquetaBrilho tom={TOM[x.status as keyof typeof TOM] ?? 'cinza'}>
              {i.status[x.status] ?? x.status}
            </EtiquetaBrilho>
          </td>
        </tr>
      ))}
    </Tabela>
  )
}
