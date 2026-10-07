import { useState } from 'react'
import { BotaoBrilho } from '@/components/ui'
import { formatarDataHora } from '@/lib/datas'
import type { Live } from '../api/agenda.api'
import { textos } from '../textos'
import { BotaoPublicar } from './BotaoPublicar'
import { CartaoDetalhe, Dados } from './CartaoDetalhe'
import { LiveForm } from './LiveForm'
import { Situacao } from './Tabela'

const t = textos.lives
const opcional = (rotulo: string, valor: string | null): [string, string][] =>
  valor ? [[rotulo, valor]] : []

/** Detalhes da live aberta; editar abre a janela. */
export function LiveDetalhe({ live }: { live: Live }) {
  const [editando, setEditando] = useState(false)
  return (
    <CartaoDetalhe titulo={live.tema}>
      <Dados
        itens={[
          [t.colunaData, formatarDataHora(new Date(live.data))],
          ...opcional(
            t.campoProfissional,
            live.profissional ? t.nomes[live.profissional as keyof typeof t.nomes] : null,
          ),
          [t.campoDuracao, t.minutos(live.duracao_minutos)],
          ...opcional(t.convidada, live.convidada),
          ...opcional(t.link, live.link_url),
          ...opcional(t.gravacao, live.gravacao_url),
          ...opcional(t.capa, live.capa_path ? t.capaEnviada : null),
          [textos.status, <Situacao key="s" publicado={live.publicado} />],
        ]}
      />
      <div className="flex flex-wrap gap-2">
        <BotaoBrilho onClick={() => setEditando(true)}>{textos.editar}</BotaoBrilho>
        <BotaoPublicar tabela="lives" id={live.id} publicado={live.publicado} />
      </div>
      {editando && <LiveForm live={live} aoFechar={() => setEditando(false)} />}
    </CartaoDetalhe>
  )
}
