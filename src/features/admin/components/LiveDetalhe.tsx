import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { BotaoBrilho } from '@/components/ui'
import { nomesDasProfissionais, type Profissional } from '@/domain/lives'
import { formatarDataHora } from '@/lib/datas'
import type { Live } from '../api/agenda.api'
import { excluirLive } from '../api/excluir.api'
import { textos } from '../textos'
import { excluir as tx } from '../textos/excluir'
import { meet } from '../textos/meet'
import { BotaoPublicar } from './BotaoPublicar'
import { CartaoDetalhe, Dados } from './CartaoDetalhe'
import { BotaoExcluir } from './BotaoExcluir'
import { LiveForm } from './LiveForm'
import { SalaMeet } from './SalaMeet'
import { Situacao } from './Tabela'

const t = textos.lives
const opcional = (rotulo: string, valor: string | null): [string, string][] =>
  valor ? [[rotulo, valor]] : []

/** Rascunho ou live que já acabou pode ser excluída; agendada e publicada primeiro sai do ar (avisa quem tem o convite). */
const podeExcluir = (l: Live, agora = Date.now()) =>
  !l.publicado || new Date(l.data).getTime() + l.duracao_minutos * 60_000 < agora

/** Detalhes da live aberta; editar abre a janela. */
export function LiveDetalhe({ live }: { live: Live }) {
  const [editando, setEditando] = useState(false)
  const cliente = useQueryClient()
  const navegar = useNavigate()
  const excluir = async () => {
    await excluirLive(live.id)
    navegar('/app/admin/lives')
    await cliente.invalidateQueries({ queryKey: ['lives'] })
  }
  return (
    <CartaoDetalhe titulo={live.tema}>
      <Dados
        itens={[
          [t.colunaData, formatarDataHora(new Date(live.data))],
          ...opcional(
            t.campoProfissional,
            nomesDasProfissionais(live.profissionais as Profissional[]) || null,
          ),
          [t.campoDuracao, t.minutos(live.duracao_minutos)],
          ...opcional(
            meet.convidadas,
            live.convidadas.map((c) => `${c.nome} (${c.email})`).join(', ') || null,
          ),
          [meet.sala, live.sala ?? meet.semSala],
          ...opcional(t.gravacao, live.gravacao_url),
          ...opcional(t.capa, live.capa_path ? t.capaEnviada : null),
          [textos.status, <Situacao key="s" publicado={live.publicado} />],
        ]}
      />
      <div className="flex flex-wrap gap-2">
        <BotaoBrilho onClick={() => setEditando(true)}>{textos.editar}</BotaoBrilho>
        <BotaoPublicar tabela="lives" id={live.id} publicado={live.publicado} />
        {!live.sala && <SalaMeet live={live.id} />}
        {podeExcluir(live) && (
          <BotaoExcluir
            rotulo={tx.live}
            confirmar={tx.confirmarLive}
            excluindo={tx.excluindo}
            mensagemDe={() => tx.erro}
            aoExcluir={excluir}
          />
        )}
      </div>
      {editando && <LiveForm live={live} aoFechar={() => setEditando(false)} />}
    </CartaoDetalhe>
  )
}
