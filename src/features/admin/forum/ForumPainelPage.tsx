import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { BotaoBrilho } from '@/components/ui'
import { Quadro } from '../components/Quadro'
import type { FiltroFila } from './api/forum.api'
import { AbaDenuncias } from './components/AbaDenuncias'
import { FiltrosFila, TabelaFila } from './components/Fila'
import { PerfilEquipeJanela } from './components/PerfilEquipeJanela'
import { useMeuPerfilEquipe, useResumoForum } from './hooks/useForumPainel'
import { t } from './textos'

const ABAS = ['fila', 'denuncias'] as const

function AbaFila({ abrirPerfil }: { abrirPerfil: () => void }) {
  const perfil = useMeuPerfilEquipe().data
  const [paraMim, setParaMim] = useState(false)
  const [f, setF] = useState<FiltroFila>({
    categoria: '',
    aula: '',
    situacao: 'abertas',
    pagina: 1,
    tamanho: 10,
  })
  const efetivo = paraMim && perfil?.especialidade ? { ...f, categoria: perfil.especialidade } : f
  const alternar = () => (perfil?.especialidade ? setParaMim(!paraMim) : abrirPerfil())
  return (
    <>
      <FiltrosFila
        f={efetivo}
        mudar={(p) => setF((x) => ({ ...x, pagina: 1, ...p }))}
        paraMim={paraMim}
        alternarParaMim={alternar}
      />
      <TabelaFila f={efetivo} setF={(n) => setF({ ...n, categoria: f.categoria })} />
    </>
  )
}

/** Fórum no painel: resumo, fila de dúvidas pelo prazo e denúncias. */
export function ForumPainelPage() {
  const [busca, setBusca] = useSearchParams()
  const aba = ABAS.find((a) => a === busca.get('aba')) ?? 'fila'
  const r = useResumoForum().data
  const perfil = useMeuPerfilEquipe().data
  const [editando, setEditando] = useState(false)
  const n = (v?: number) => (v === undefined ? '-' : String(v))
  return (
    <Quadro
      titulo={t.titulo}
      acao={
        <BotaoBrilho tom="cinza" disabled={!perfil} onClick={() => setEditando(true)}>
          {t.meuPerfil}
        </BotaoBrilho>
      }
      numeros={[
        { valor: n(r?.abertas), rotulo: t.cartoes.abertas, tom: 'salvia' },
        { valor: n(r?.perto), rotulo: t.cartoes.perto, tom: 'salvia' },
        { valor: n(r?.vencidas), rotulo: t.cartoes.vencidas, tom: 'ocre' },
        { valor: n(r?.respondidas_semana), rotulo: t.cartoes.semana, tom: 'terracota' },
      ]}
    >
      <div role="tablist" aria-label={t.titulo} className="flex flex-wrap gap-1.5">
        {ABAS.map((a) => (
          <button
            key={a}
            type="button"
            role="tab"
            aria-selected={aba === a}
            onClick={() => setBusca({ aba: a }, { replace: true })}
            className={`min-h-9 rounded-full px-4 text-[13px] font-bold ${aba === a ? 'brilho brilho-verde' : 'border border-[#ECEFED] bg-white text-suave hover:bg-trilho'}`}
          >
            {t.abas[a]}
          </button>
        ))}
      </div>
      {aba === 'fila' ? <AbaFila abrirPerfil={() => setEditando(true)} /> : <AbaDenuncias />}
      {editando && perfil && (
        <PerfilEquipeJanela perfil={perfil} aoFechar={() => setEditando(false)} />
      )}
    </Quadro>
  )
}
