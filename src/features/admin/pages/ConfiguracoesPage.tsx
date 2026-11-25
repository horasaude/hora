import type { ReactNode } from 'react'
import { useParams } from 'react-router-dom'
import { diaEMes, formatarData, formatarDataHora } from '@/lib/datas'
import { formatarPreco } from '@/lib/moeda'
import type { Configuracoes } from '../api/modulos.api'
import { ConfigDetalhe } from '../components/ConfigDetalhe'
import { CuponsDetalhe } from '../components/CuponsDetalhe'
import { Estado } from '../components/Estado'
import { Divisao, Quadro, type Numero } from '../components/Quadro'
import { celula, LinhaTabela, Tabela } from '../components/Tabela'
import { caminhoAba, type AbaConfig } from '../configuracoes/abas'
import { AbasConfig } from '../configuracoes/AbasConfig'
import { ParceirasConfig } from '../configuracoes/ParceirasConfig'
import { useConfiguracoes } from '../hooks/useModulos'
import { lerSecoes } from '../secoes'
import { textos } from '../textos'

const t = textos.configuracoes
const GRUPOS = { planos: ['precos', 'oferta'], documentos: ['termos', 'privacidade'] } as const
type Grupo = keyof typeof GRUPOS
type Item = (typeof GRUPOS)[Grupo][number]
const ITENS: Item[] = [...GRUPOS.planos, ...GRUPOS.documentos]

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

/** Em que aba está o endereço e se é um item aberto (preços, oferta, termos ou privacidade). */
function lerEndereco(param?: string): { aba: AbaConfig; item?: Item } {
  const item = ITENS.find((i) => i === param)
  if (item) return { aba: GRUPOS.planos.some((i) => i === item) ? 'planos' : 'documentos', item }
  if (param === 'cupons' || param === 'parceiras' || param === 'documentos') return { aba: param }
  return { aba: 'planos' }
}

function ListaItens({ grupo, c }: { grupo: Grupo; c: Configuracoes }) {
  return (
    <Tabela colunas={t.colunas}>
      {GRUPOS[grupo].map((i) => (
        <LinhaTabela
          key={i}
          ativa={false}
          para={`/app/admin/configuracoes/${i}`}
          titulo={t.itens[i]}
        >
          <td className={celula}>{valorAtual(i, c)}</td>
        </LinhaTabela>
      ))}
    </Tabela>
  )
}

/** Configurações com menu próprio: planos e oferta, cupons, parceiras, equipe, termos e privacidade. */
export function ConfiguracoesPage() {
  const config = useConfiguracoes()
  const { aba, item } = lerEndereco(useParams().item)
  let corpo: ReactNode
  if (aba === 'cupons') corpo = <CuponsDetalhe />
  else if (aba === 'parceiras') corpo = <ParceirasConfig />
  else if (config.isPending) corpo = <Estado tipo="carregando" />
  else if (config.isError) corpo = <Estado tipo="erro" tentar={() => config.refetch()} />
  else
    corpo = (
      <Divisao
        aberto={Boolean(item)}
        voltar={{ para: caminhoAba(aba), rotulo: t.pagina }}
        tabela={
          <ListaItens grupo={aba === 'documentos' ? 'documentos' : 'planos'} c={config.data} />
        }
        detalhe={item && <ConfigDetalhe key={item} item={item} c={config.data} />}
      />
    )
  return (
    <Quadro
      titulo={t.pagina}
      numeros={aba === 'planos' ? numeros(config.data) : []}
      aberto={Boolean(item)}
    >
      {!item && <AbasConfig atual={aba} />}
      {corpo}
    </Quadro>
  )
}
