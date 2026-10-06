import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BotaoBrilho } from '@/components/ui'
import { formatarDataHora } from '@/lib/datas'
import { Estado } from '../../components/Estado'
import { celula, Tabela } from '../../components/Tabela'
import { manter } from '../api/forum.api'
import { useAcaoForumPainel, useDenuncias } from '../hooks/useForumPainel'
import { t } from '../textos'
import { OcultarJanela } from './OcultarJanela'

type Post = { topico: string; resposta?: string }

/** Posts denunciados ainda sem decisão: manter ou ocultar. */
export function AbaDenuncias() {
  const lista = useDenuncias()
  const manterPost = useAcaoForumPainel(manter)
  const [ocultando, setOcultando] = useState<Post | null>(null)
  if (lista.isPending) return <Estado tipo="carregando" />
  if (lista.isError) return <Estado tipo="erro" tentar={() => lista.refetch()} />
  if (lista.data.length === 0) return <Estado tipo="vazio" texto={t.denunciasVazio} />
  return (
    <>
      <Tabela colunas={t.colunasDenuncias}>
        {lista.data.map((d) => {
          const post = { topico: d.topico_id, resposta: d.resposta_id ?? undefined }
          return (
            <tr
              key={d.resposta_id ?? d.topico_id}
              className="border-b border-[#F4F5F4] last:border-b-0"
            >
              <td className={`${celula} max-w-md`}>
                <span className="block text-[11px] font-bold tracking-wide text-suave uppercase">
                  {t.tipoPost(Boolean(d.resposta_id))}
                </span>
                <span className="line-clamp-2">{d.texto}</span>
                {d.motivos.length > 0 && (
                  <span className="mt-1 block text-xs text-suave">{d.motivos.join(' · ')}</span>
                )}
                <Link
                  to={`/app/admin/forum/${d.topico_id}`}
                  className="mt-1 block text-xs font-bold text-verde-escuro underline underline-offset-4"
                >
                  {t.verConversa}
                </Link>
              </td>
              <td className={celula}>{d.autora}</td>
              <td className={`${celula} font-bold`}>{d.total}</td>
              <td className={`${celula} text-suave`}>{formatarDataHora(new Date(d.ultima))}</td>
              <td className="px-3.5 py-3">
                <div className="flex justify-end gap-2">
                  <BotaoBrilho
                    tom="cinza"
                    disabled={manterPost.isPending}
                    onClick={() => manterPost.mutate(post)}
                  >
                    {t.manter}
                  </BotaoBrilho>
                  <BotaoBrilho tom="coral" onClick={() => setOcultando(post)}>
                    {t.ocultar}
                  </BotaoBrilho>
                </div>
              </td>
            </tr>
          )
        })}
      </Tabela>
      {ocultando && <OcultarJanela {...ocultando} aoFechar={() => setOcultando(null)} />}
    </>
  )
}
