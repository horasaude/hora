import { useState } from 'react'
import { BotaoBrilho } from '@/components/ui'
import { Estado } from '../../components/Estado'
import { Tabela } from '../../components/Tabela'
import { MenuAcoes } from '../../plano/components/MenuAcoes'
import { salvarRegra, type Regra } from '../api/pontos.api'
import { useAcaoPontos, useRegras } from '../hooks/usePontos'
import { t } from '../textos'
import { DarPontosJanela } from './DarPontosJanela'
import { Interruptor } from './Interruptor'
import { RegraJanela } from './RegraJanela'

type Props = {
  r: Regra
  ocupado: boolean
  alternar: () => void
  editar: () => void
  dar: () => void
}

function LinhaRegra({ r, ocupado, alternar, editar, dar }: Props) {
  const acoes = [{ nome: t.regras.editar, aoEscolher: editar }]
  if (r.propria) acoes.push({ nome: t.regras.darPontos, aoEscolher: dar })
  return (
    <tr
      className="cursor-pointer border-b border-[#F4F5F4] last:border-b-0 hover:bg-[#F8FAF9]"
      onClick={editar}
    >
      <td className={`px-3.5 py-3 font-bold ${r.ativo ? 'text-tinta' : 'text-suave'}`}>{r.nome}</td>
      <td className="px-3.5 py-3">{r.pontos} pts</td>
      <td className="px-3.5 py-3 text-suave">{t.limite(r.limite_tipo, r.limite_qtd, r.acao)}</td>
      <td className="px-3.5 py-3">
        <Interruptor
          ligado={r.ativo}
          rotulo={t.regras.ativa(r.nome)}
          ocupado={ocupado}
          aoMudar={alternar}
        />
      </td>
      <td className="w-12 px-2 py-2">
        <MenuAcoes nome={r.nome} acoes={acoes} />
      </td>
    </tr>
  )
}

/** Regras: ação, valor, limite e liga/desliga; editar abre a janela; Nova ação cria uma própria. */
export function AbaRegras() {
  const regras = useRegras()
  const salvar = useAcaoPontos(salvarRegra)
  const [editando, setEditando] = useState<Regra | 'nova' | null>(null)
  const [dando, setDando] = useState<Regra | null>(null)
  if (regras.isPending) return <Estado tipo="carregando" />
  if (regras.isError) return <Estado tipo="erro" tentar={() => regras.refetch()} />
  return (
    <>
      <div className="flex justify-end">
        <BotaoBrilho tom="dourado" onClick={() => setEditando('nova')}>
          {t.regras.nova}
        </BotaoBrilho>
      </div>
      <Tabela colunas={t.regras.colunas}>
        {regras.data.map((r) => (
          <LinhaRegra
            key={r.acao}
            r={r}
            ocupado={salvar.isPending}
            alternar={() => salvar.mutate({ ...r, ativo: !r.ativo })}
            editar={() => setEditando(r)}
            dar={() => setDando(r)}
          />
        ))}
      </Tabela>
      {editando && (
        <RegraJanela
          regra={editando === 'nova' ? null : editando}
          aoFechar={() => setEditando(null)}
        />
      )}
      {dando && <DarPontosJanela regra={dando} aoFechar={() => setDando(null)} />}
    </>
  )
}
