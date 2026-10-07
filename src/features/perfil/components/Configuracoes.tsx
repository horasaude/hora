import { useState } from 'react'
import { BotaoBrilho, Cartao, LinkBrilho } from '@/components/ui'
import { useMeuPerfil, useSair } from '@/features/auth'
import { useSalvarRanking } from '../hooks/usePerfil'
import { textos } from '../textos'
import { JanelaEditar } from './JanelaEditar'
import { JanelaSenha } from './JanelaSenha'

const t = textos.config

/** Chave liga e desliga em vidro: verde ligada, cinza desligada. */
function Chave({
  ligada,
  aoMudar,
  rotulo,
  ajuda,
}: {
  ligada: boolean
  aoMudar: (v: boolean) => void
  rotulo: string
  ajuda: string
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p id="chave-ranking" className="text-sm font-bold text-tinta">
          {rotulo}
        </p>
        <p className="text-[13px] text-suave">{ajuda}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={ligada}
        aria-labelledby="chave-ranking"
        onClick={() => aoMudar(!ligada)}
        className={`brilho ${ligada ? 'brilho-verde' : 'brilho-cinza'} relative h-7 w-12 shrink-0 rounded-full`}
      >
        <span
          className={`absolute top-0.5 size-[22px] rounded-full bg-white shadow transition-all ${ligada ? 'left-[22px]' : 'left-0.5'}`}
        />
      </button>
    </div>
  )
}

/** Configurações: apelido e foto, aparecer no ranking, trocar senha, painel (admin) e sair. */
export function Configuracoes() {
  const p = useMeuPerfil().data
  const ranking = useSalvarRanking()
  const sair = useSair()
  const [janela, setJanela] = useState<'editar' | 'senha' | null>(null)
  if (!p) return null
  const aparecer = ranking.isPending ? Boolean(ranking.variables) : !p.ocultar_ranking
  return (
    <Cartao className="flex flex-col gap-5">
      <h2 className="text-[19px] font-bold text-verde-escuro">{t.titulo}</h2>
      <Chave
        ligada={aparecer}
        aoMudar={(v) => ranking.mutate(v)}
        rotulo={t.ranking}
        ajuda={t.rankingAjuda}
      />
      {ranking.isError && (
        <p role="alert" className="text-sm text-terracota-escuro">
          {textos.erroSalvar}
        </p>
      )}
      <div className="flex flex-wrap gap-2">
        <BotaoBrilho onClick={() => setJanela('editar')}>{t.editar}</BotaoBrilho>
        <BotaoBrilho tom="cinza" onClick={() => setJanela('senha')}>
          {t.senha}
        </BotaoBrilho>
        {p.papel === 'admin' && (
          <LinkBrilho to="/app/admin" tom="cinza">
            {textos.painel}
          </LinkBrilho>
        )}
        <BotaoBrilho tom="cinza" onClick={() => sair.mutate()} disabled={sair.isPending}>
          {sair.isPending ? t.saindo : t.sair}
        </BotaoBrilho>
      </div>
      {janela === 'editar' && (
        <JanelaEditar
          nome={p.nome || p.apelido || ''}
          apelido={p.apelido ?? ''}
          avatar={p.avatar_path}
          aoFechar={() => setJanela(null)}
        />
      )}
      {janela === 'senha' && <JanelaSenha aoFechar={() => setJanela(null)} />}
    </Cartao>
  )
}
