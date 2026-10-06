import { useState } from 'react'
import { BotaoBrilho } from '@/components/ui'
import { formatarDataHora } from '@/lib/datas'
import type { Aviso } from '../api/agenda.api'
import { textos } from '../textos'
import { AvisoForm } from './AvisoForm'
import { BotaoPublicar } from './BotaoPublicar'
import { CartaoDetalhe, Dados } from './CartaoDetalhe'
import { Situacao } from './Tabela'

const t = textos.avisos

/** Detalhes do aviso aberto, com o texto; editar abre a janela. */
export function AvisoDetalhe({ aviso }: { aviso: Aviso }) {
  const [editando, setEditando] = useState(false)
  return (
    <CartaoDetalhe titulo={aviso.titulo}>
      <Dados
        itens={[
          [t.colunaData, formatarDataHora(new Date(aviso.publicar_em))],
          [textos.status, <Situacao key="s" publicado={aviso.publicado} />],
        ]}
      />
      <p className="text-[13px] leading-relaxed whitespace-pre-line text-[#40504B]">
        {aviso.texto}
      </p>
      <div className="flex flex-wrap gap-2">
        <BotaoBrilho onClick={() => setEditando(true)}>{textos.editar}</BotaoBrilho>
        <BotaoPublicar tabela="avisos" id={aviso.id} publicado={aviso.publicado} />
      </div>
      {editando && <AvisoForm aviso={aviso} aoFechar={() => setEditando(false)} />}
    </CartaoDetalhe>
  )
}
