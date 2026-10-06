import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { BotaoBrilho, Cartao, EtiquetaBrilho } from '@/components/ui'
import { Conversa, Responder, type Duvida } from '@/features/forum'
import { Estado } from '../components/Estado'
import { marcarUtil } from './api/forum.api'
import { OcultarJanela } from './components/OcultarJanela'
import { Prazo } from './components/Prazo'
import { useAcaoForumPainel, useDuvidaPainel } from './hooks/useForumPainel'
import { t } from './textos'

function Acoes({ d }: { d: Duvida }) {
  const util = useAcaoForumPainel(marcarUtil)
  const [ocultando, setOcultando] = useState(false)
  if (d.oculto) return null
  return (
    <div className="flex flex-wrap gap-2">
      {d.util ? (
        <EtiquetaBrilho tom="verde">{t.marcadaUtil}</EtiquetaBrilho>
      ) : (
        <BotaoBrilho tom="dourado" disabled={util.isPending} onClick={() => util.mutate(d.id)}>
          {t.util}
        </BotaoBrilho>
      )}
      <BotaoBrilho tom="coral" onClick={() => setOcultando(true)}>
        {t.ocultar}
      </BotaoBrilho>
      {ocultando && <OcultarJanela topico={d.id} aoFechar={() => setOcultando(false)} />}
    </div>
  )
}

/** Dúvida aberta no painel: conversa inteira, aula de origem, resposta, útil e ocultar. */
export function DuvidaPainelPage() {
  const { duvidaId = '' } = useParams()
  const duvida = useDuvidaPainel(duvidaId)
  const voltar = (
    <Link to="/app/admin/forum" className="text-sm text-suave underline underline-offset-4">
      {t.voltar}
    </Link>
  )
  if (duvida.isPending) return <Estado tipo="carregando" />
  if (duvida.isError) return <Estado tipo="erro" tentar={() => duvida.refetch()} />
  const d = duvida.data
  if (!d) return <Estado tipo="vazio" texto={t.vazio} acao={voltar} />
  return (
    <section className="flex flex-col gap-4">
      {voltar}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-[26px] leading-tight font-bold text-verde-escuro">{t.titulo}</h1>
        <Prazo
          d={{
            prazo_em: d.prazo_em,
            respondida_em: d.respondida_em,
            oculto_em: d.oculto ? d.prazo_em : null,
          }}
        />
      </div>
      <Cartao className="flex flex-col gap-6 lg:p-8">
        <Conversa d={d} painel linkAula={d.aula_id ? `/app/admin/aulas/${d.aula_id}` : undefined} />
        {!d.oculto && <Responder topico={d.id} />}
        <Acoes d={d} />
      </Cartao>
    </section>
  )
}
