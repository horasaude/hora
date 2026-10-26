import type { ReactNode } from 'react'
import { useParams } from 'react-router-dom'
import { diaEMes, formatarData, formatarDataHora } from '@/lib/datas'
import { formatarPreco } from '@/lib/moeda'
import { LinkBrilho } from '@/components/ui'
import type { Configuracoes } from '../api/modulos.api'
import { ConfigDetalhe } from '../components/ConfigDetalhe'
import { CuponsDetalhe } from '../components/CuponsDetalhe'
import { Estado } from '../components/Estado'
import { Divisao, Quadro, type Numero } from '../components/Quadro'
import { celula, LinhaTabela, Tabela } from '../components/Tabela'
import { useCupons } from '../hooks/useCupons'
import { useConfiguracoes } from '../hooks/useModulos'
import { lerSecoes } from '../secoes'
import { textos } from '../textos'
import { cupons as tc } from '../textos/cupons'

const t = textos.configuracoes
const ITENS = ['precos', 'oferta', 'cupons', 'termos', 'privacidade'] as const
type Item = (typeof ITENS)[number]

function valorAtual(item: Item, c: Configuracoes, cupons: number): string {
  if (item === 'cupons') return tc.resumo(cupons)
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

/** Configurações: preços, oferta do ORA, termos e privacidade; o cartão mostra, a janela edita. */
export function ConfiguracoesPage() {
  const config = useConfiguracoes()
  const ativos = (useCupons().data ?? []).filter((x) => x.ativo).length
  const { item: param } = useParams()
  const item: Item = ITENS.find((i) => i === param) ?? 'precos'
  const aberto = item === param
  let corpo: ReactNode
  if (config.isPending) corpo = <Estado tipo="carregando" />
  else if (config.isError) corpo = <Estado tipo="erro" tentar={() => config.refetch()} />
  else {
    const c = config.data
    corpo = (
      <Divisao
        aberto={aberto}
        voltar={{ para: '/app/admin/configuracoes', rotulo: t.pagina }}
        tabela={
          <Tabela colunas={t.colunas}>
            {ITENS.map((i) => (
              <LinhaTabela
                key={i}
                ativa={i === item}
                para={`/app/admin/configuracoes/${i}`}
                titulo={i === 'cupons' ? tc.item : t.itens[i]}
              >
                <td className={celula}>{valorAtual(i, c, ativos)}</td>
              </LinhaTabela>
            ))}
          </Tabela>
        }
        detalhe={
          item === 'cupons' ? <CuponsDetalhe /> : <ConfigDetalhe key={item} item={item} c={c} />
        }
      />
    )
  }
  return (
    <Quadro
      titulo={t.pagina}
      numeros={numeros(config.data)}
      aberto={aberto}
      acao={
        <LinkBrilho tom="escuro" to="/app/admin/configuracoes/equipe">
          {t.equipe}
        </LinkBrilho>
      }
    >
      {corpo}
    </Quadro>
  )
}
