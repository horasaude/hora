import type { ReactNode } from 'react'
import { useParams } from 'react-router-dom'
import { diaEMes, formatarData, formatarDataHora } from '@/lib/datas'
import { formatarPreco } from '@/lib/moeda'
import type { Configuracoes } from '../api/modulos.api'
import { CartaoDetalhe } from '../components/CartaoDetalhe'
import { Estado } from '../components/Estado'
import { FormDocumento } from '../components/FormDocumento'
import { FormOferta, FormPrecos } from '../components/FormsConfiguracao'
import { Divisao, Quadro, type Numero } from '../components/Quadro'
import { celula, LinhaTabela, Tabela } from '../components/Tabela'
import { useConfiguracoes } from '../hooks/useModulos'
import { lerSecoes } from '../secoes'
import { textos } from '../textos'

const t = textos.configuracoes
const ITENS = ['precos', 'oferta', 'termos', 'privacidade'] as const
type Item = (typeof ITENS)[number]

function valorAtual(item: Item, c: Configuracoes): string {
  if (item === 'precos')
    return `Pix ${formatarPreco(c.pix_cheio)} · 12x ${formatarPreco(c.parcelado_cheio)}`
  if (item === 'oferta')
    return `${formatarDataHora(new Date(c.oferta_inicio))} a ${formatarDataHora(new Date(c.oferta_fim))}`
  const em = item === 'termos' ? c.termos_atualizado_em : c.privacidade_atualizado_em
  return `${t.secoes(lerSecoes(c[item]).length)} · ${formatarData(new Date(em))}`
}

function numeros(c?: Configuracoes): Numero[] {
  return [
    { valor: c ? formatarPreco(c.pix_cheio) : '-', rotulo: t.pixCheio, tom: 'salvia' },
    { valor: c ? formatarPreco(c.pix_oferta) : '-', rotulo: t.pixOferta, tom: 'ocre' },
    { valor: c ? diaEMes(new Date(c.oferta_inicio)) : '-', rotulo: t.diaOferta, tom: 'terracota' },
  ]
}

function Formulario({ item, c }: { item: Item; c: Configuracoes }) {
  if (item === 'precos') return <FormPrecos config={c} />
  if (item === 'oferta') return <FormOferta config={c} />
  return <FormDocumento campo={item} valor={c[item]} />
}

/** Configurações: preços, oferta do ORA, termos e privacidade, editados no cartão da direita. */
export function ConfiguracoesPage() {
  const config = useConfiguracoes()
  const { item: param } = useParams()
  const item: Item = ITENS.find((i) => i === param) ?? 'precos'
  let corpo: ReactNode
  if (config.isPending) corpo = <Estado tipo="carregando" />
  else if (config.isError) corpo = <Estado tipo="erro" tentar={() => config.refetch()} />
  else {
    const c = config.data
    corpo = (
      <Divisao
        tabela={
          <Tabela colunas={t.colunas}>
            {ITENS.map((i) => (
              <LinhaTabela
                key={i}
                ativa={i === item}
                para={`/app/admin/configuracoes/${i}`}
                titulo={t.itens[i]}
              >
                <td className={celula}>{valorAtual(i, c)}</td>
              </LinhaTabela>
            ))}
          </Tabela>
        }
        detalhe={
          <CartaoDetalhe titulo={t.itens[item]}>
            <Formulario key={`${item}-${c.updated_at}`} item={item} c={c} />
          </CartaoDetalhe>
        }
      />
    )
  }
  return (
    <Quadro titulo={t.pagina} numeros={numeros(config.data)}>
      {corpo}
    </Quadro>
  )
}
