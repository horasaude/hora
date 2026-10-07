import { useParams } from 'react-router-dom'
import { BotaoBrilho, EtiquetaBrilho } from '@/components/ui'
import { CATEGORIAS_LOJA, ehCategoriaLoja, percentualDesconto } from '@/domain/loja'
import { formatarPreco } from '@/lib/moeda'
import { CartaoDetalhe, Dados } from '../../components/CartaoDetalhe'
import { Estado } from '../../components/Estado'
import { Divisao } from '../../components/Quadro'
import { celula, LinhaTabela, Tabela } from '../../components/Tabela'
import type { Produto } from '../api/loja.api'
import { useLinksFotos, useProdutos } from '../hooks/useLoja'
import { t } from '../textos'
import { CliquesSemana } from './CliquesSemana'
import { Miniatura } from './Miniatura'

const categoria = (c: string) => (ehCategoriaLoja(c) ? CATEGORIAS_LOJA[c] : c)
const Situacao = ({ p }: { p: Produto }) => (
  <EtiquetaBrilho tom={p.publicado ? 'verde' : 'dourado'}>
    {p.publicado ? t.publicado : t.rascunho}
  </EtiquetaBrilho>
)

function Detalhe({ p, foto, editar }: { p: Produto; foto?: string; editar: () => void }) {
  return (
    <CartaoDetalhe titulo={p.nome}>
      <Miniatura src={foto} tamanho="size-28" />
      <Dados
        itens={[
          [t.dados.parceiro, p.loja_parceiros?.nome ?? '-'],
          [t.dados.categoria, categoria(p.categoria)],
          [t.dados.preco, formatarPreco(p.preco_centavos)],
          [
            t.dados.final,
            `${formatarPreco(p.preco_final_centavos)} (${percentualDesconto(p.preco_centavos, p.preco_final_centavos)}%)`,
          ],
          [t.dados.cupom, p.cupom ?? '-'],
          [
            t.dados.link,
            <span key="l" className="break-all">
              {p.link_url}
            </span>,
          ],
          [t.dados.situacao, <Situacao key="s" p={p} />],
        ]}
      />
      <BotaoBrilho className="self-start" onClick={editar}>
        {t.editar}
      </BotaoBrilho>
      <CliquesSemana produto={p.id} />
    </CartaoDetalhe>
  )
}

function TabelaProdutos({
  lista,
  atual,
  foto,
}: {
  lista: Produto[]
  atual: string
  foto: (p: Produto) => string | undefined
}) {
  return (
    <Tabela colunas={t.colunasProdutos}>
      {lista.map((p) => (
        <LinhaTabela
          key={p.id}
          ativa={p.id === atual}
          para={`/app/admin/loja/${p.id}`}
          titulo={p.nome}
          marca={
            <span className="flex items-center gap-2">
              <Miniatura src={foto(p)} tamanho="size-9" />
              {p.destaque && <EtiquetaBrilho tom="dourado">{t.destaque}</EtiquetaBrilho>}
            </span>
          }
        >
          <td className={celula}>{p.loja_parceiros?.nome}</td>
          <td className={`${celula} text-suave line-through`}>{formatarPreco(p.preco_centavos)}</td>
          <td className={`${celula} font-bold`}>{formatarPreco(p.preco_final_centavos)}</td>
          <td className={celula}>{categoria(p.categoria)}</td>
          <td className="px-3.5 py-3">
            <Situacao p={p} />
          </td>
        </LinhaTabela>
      ))}
    </Tabela>
  )
}

/** Produtos: tabela com miniatura e o produto aberto à direita com os cliques por semana. */
export function AbaProdutos({
  editar,
  criar,
}: {
  editar: (p: Produto) => void
  criar: () => void
}) {
  const produtos = useProdutos()
  const { produtoId } = useParams()
  const fotos =
    useLinksFotos((produtos.data ?? []).flatMap((p) => (p.foto_path ? [p.foto_path] : []))).data ??
    {}
  if (produtos.isPending) return <Estado tipo="carregando" />
  if (produtos.isError) return <Estado tipo="erro" tentar={() => produtos.refetch()} />
  const lista = produtos.data
  const atual = lista.find((p) => p.id === produtoId) ?? lista[0]
  if (!atual)
    return (
      <Estado
        tipo="vazio"
        texto={t.vazioProdutos}
        acao={
          <BotaoBrilho tom="dourado" onClick={criar}>
            {t.novoProduto}
          </BotaoBrilho>
        }
      />
    )
  const foto = (p: Produto) => (p.foto_path ? fotos[p.foto_path] : undefined)
  return (
    <Divisao
      tabela={<TabelaProdutos lista={lista} atual={atual.id} foto={foto} />}
      detalhe={<Detalhe p={atual} foto={foto(atual)} editar={() => editar(atual)} />}
    />
  )
}
