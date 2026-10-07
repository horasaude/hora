import { useState } from 'react'
import { BotaoBrilho, Cartao, EtiquetaBrilho } from '@/components/ui'
import { useMeuPerfil } from '@/features/auth'
import { diaEMes } from '@/lib/datas'
import { linkWhatsAppMensagem } from '@/lib/whatsapp'
import type { Indicacao } from '../api/pontos.api'
import { useIndicacoes } from '../hooks/usePerfil'
import { textos } from '../textos'

const t = textos.indicar
const TOM = { aguardando: 'dourado', confirmada: 'verde', cancelada: 'coral' } as const

/** Indicar uma amiga: link pessoal, Copiar link, Enviar no WhatsApp e a lista das indicações. */
export function Indicar() {
  const codigo = useMeuPerfil().data?.codigo_indicacao
  const indicacoes = useIndicacoes()
  const [copiado, setCopiado] = useState(false)
  const link = codigo ? `${window.location.origin}/?ind=${codigo}` : ''
  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(link)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2500)
    } catch {
      setCopiado(false)
    }
  }
  const lista = indicacoes.data?.lista ?? []
  return (
    <Cartao className="flex flex-col gap-4">
      <h2 className="text-[19px] font-bold text-verde-escuro">{t.titulo}</h2>
      {indicacoes.data && (
        <p className="text-sm text-tinta">{t.texto(indicacoes.data.pontosRegra)}</p>
      )}
      <div className="flex flex-col gap-1">
        <span className="text-[13px] font-bold text-suave">{t.link}</span>
        <p className="rounded-xl bg-trilho px-4 py-2.5 text-sm break-all text-tinta">{link}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <BotaoBrilho tom="escuro" onClick={copiar} disabled={!link}>
          {copiado ? t.copiado : t.copiar}
        </BotaoBrilho>
        <a
          href={linkWhatsAppMensagem(t.mensagem(link))}
          target="_blank"
          rel="noreferrer"
          className="brilho brilho-verde inline-flex min-h-9 items-center rounded-full px-4 text-[13px] font-bold"
        >
          {t.whatsapp}
        </a>
        <span role="status" className="sr-only">
          {copiado ? t.copiado : ''}
        </span>
      </div>
      <ListaIndicacoes lista={lista} erro={indicacoes.isError} />
    </Cartao>
  )
}

function ListaIndicacoes({ lista, erro }: { lista: Indicacao[]; erro: boolean }) {
  return (
    <>
      <h3 className="pt-2 text-base font-bold text-tinta">{t.lista}</h3>
      {lista.length === 0 ? (
        <p className="text-sm text-suave">{erro ? textos.erro : t.vazio}</p>
      ) : (
        <ul className="flex flex-col divide-y divide-linha">
          {lista.map((i) => (
            <li key={i.id} className="flex items-center gap-3 py-3">
              <span className="min-w-0 flex-1 text-sm text-tinta">
                {i.indicada_nome || t.semNome}
                <span className="block text-[13px] text-suave">
                  {diaEMes(new Date(i.created_at))}
                </span>
              </span>
              <span className="flex flex-col items-end gap-1 sm:flex-row sm:items-center sm:gap-3">
                <EtiquetaBrilho tom={TOM[i.status]}>{t.status[i.status]}</EtiquetaBrilho>
                <span className="text-sm font-bold text-verde-escuro sm:w-36 sm:text-right">
                  {t.pontos(i.pontos, i.status)}
                </span>
              </span>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
