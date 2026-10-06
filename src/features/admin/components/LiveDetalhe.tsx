import { useNavigate } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import type { z } from 'zod'
import { formatarDataHora, paraCampoBrasilia } from '@/lib/datas'
import { salvarLive, type Live } from '../api/agenda.api'
import { useSalvar } from '../hooks/usePainel'
import { esquemaLive } from '../schemas/formularios'
import { textos } from '../textos'
import { BotaoPublicar } from './BotaoPublicar'
import { CartaoDetalhe, Dados } from './CartaoDetalhe'
import { FormAgenda, type CampoDef } from './FormAgenda'
import { Situacao } from './Tabela'

const t = textos.lives
type Entrada = z.input<typeof esquemaLive>
const CAMPOS: CampoDef<Entrada>[] = [
  { nome: 'tema', rotulo: t.campoTema },
  { nome: 'data', rotulo: t.campoData, tipo: 'datahora' },
  { nome: 'convidada', rotulo: t.campoConvidada },
  { nome: 'link_url', rotulo: t.campoLink, tipo: 'link' },
  { nome: 'gravacao_url', rotulo: t.campoGravacao, tipo: 'link' },
]

/** Cartão da live aberta (ou nova): dados, publicar e o formulário. */
export function LiveDetalhe({ live }: { live?: Live }) {
  const salvar = useSalvar(salvarLive)
  const navegar = useNavigate()
  const inicial: Entrada = {
    tema: live?.tema ?? '',
    data: live ? paraCampoBrasilia(new Date(live.data)) : '',
    convidada: live?.convidada ?? '',
    link_url: live?.link_url ?? '',
    gravacao_url: live?.gravacao_url ?? '',
  }
  return (
    <CartaoDetalhe titulo={live ? live.tema : t.nova}>
      {live && (
        <>
          <Dados
            itens={[
              [t.colunaData, formatarDataHora(new Date(live.data))],
              ...(live.convidada ? [[t.convidada, live.convidada] as [string, string]] : []),
              [textos.status, <Situacao key="s" publicado={live.publicado} />],
            ]}
          />
          <BotaoPublicar tabela="lives" id={live.id} publicado={live.publicado} />
          <hr className="border-linha" />
        </>
      )}
      <FormAgenda<Entrada, z.output<typeof esquemaLive>>
        campos={CAMPOS}
        inicial={inicial}
        resolver={zodResolver(esquemaLive)}
        aoCancelar={() => navegar('/app/admin/lives')}
        aoSalvar={async (d) => {
          const salva = await salvar.mutateAsync({ ...d, id: live?.id })
          navegar(`/app/admin/lives/${salva.id}`)
        }}
      />
    </CartaoDetalhe>
  )
}
