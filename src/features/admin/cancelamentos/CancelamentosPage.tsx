import { useQuery } from '@tanstack/react-query'
import { formatarData } from '@/lib/datas'
import { Estado } from '../components/Estado'
import { Quadro } from '../components/Quadro'
import { AbasCrm } from '../crm/AbasCrm'
import { celula, Etiqueta, Tabela } from '../components/Tabela'
import { estornoPendente, listarCancelamentos, type Cancelamento } from './cancelamentos.api'
import { t } from './textos'

function Tipo({ c }: { c: Cancelamento }) {
  if (c.cancelamento_tipo === 'nao_renovar')
    return <Etiqueta tom="neutro">{t.tipos.naoRenovar}</Etiqueta>
  if (estornoPendente(c)) return <Etiqueta tom="rosa">{t.tipos.pendente}</Etiqueta>
  return <Etiqueta tom="verde">{t.tipos.estornado}</Etiqueta>
}

function Linhas({ lista }: { lista: Cancelamento[] }) {
  return (
    <Tabela colunas={t.colunas}>
      {lista.map((c) => (
        <tr key={c.id} className="border-b border-[#F4F5F4] last:border-b-0">
          <td className={celula}>
            <span className="block font-semibold">{c.nome}</span>
            <span className="text-suave">{c.email}</span>
          </td>
          <td className={`${celula} whitespace-nowrap`}>{t.planos[c.plano] ?? c.plano}</td>
          <td className={`${celula} whitespace-nowrap`}>
            {formatarData(new Date(c.cancelamento_pedido_em))}
          </td>
          <td className="px-3.5 py-3">
            <Tipo c={c} />
          </td>
          <td className={`${celula} max-w-72`}>{c.cancelamento_motivo || '-'}</td>
        </tr>
      ))}
    </Tabela>
  )
}

/**
 * Pedidos de cancelamento das alunas (só leitura). Até 7 dias o sistema já estornou; se o Asaas
 * falhou, a linha pede estorno à mão. Depois dos 7 dias, o plano segue e não é renovado.
 */
export function CancelamentosPage() {
  const q = useQuery({ queryKey: ['admin', 'cancelamentos'], queryFn: listarCancelamentos })
  const lista = q.data ?? []
  const arrependimento = lista.filter((c) => c.cancelamento_tipo === 'arrependimento')
  const pendentes = lista.filter(estornoPendente)
  return (
    <Quadro
      titulo={t.titulo}
      numeros={[
        { valor: String(lista.length), rotulo: t.cartoes.total, tom: 'salvia' },
        {
          valor: String(arrependimento.length - pendentes.length),
          rotulo: t.cartoes.estornados,
          tom: 'ocre',
        },
        { valor: String(pendentes.length), rotulo: t.cartoes.pendentes, tom: 'terracota' },
      ]}
    >
      <AbasCrm />
      {q.isPending && <Estado tipo="carregando" />}
      {q.isError && <Estado tipo="erro" tentar={() => q.refetch()} />}
      {q.isSuccess && !lista.length && <Estado tipo="vazio" texto={t.vazio} />}
      {q.isSuccess && lista.length > 0 && <Linhas lista={lista} />}
    </Quadro>
  )
}
