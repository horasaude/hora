import { useState, type ReactNode } from 'react'
import { BotaoBrilho } from '@/components/ui'
import { formatarData, formatarDataHora } from '@/lib/datas'
import { formatarPreco } from '@/lib/moeda'
import type { Configuracoes } from '../api/modulos.api'
import { lerSecoes } from '../secoes'
import { textos } from '../textos'
import { CartaoDetalhe, Dados } from './CartaoDetalhe'
import { FormDocumento } from './FormDocumento'
import { FormOferta, FormPrecos } from './FormsConfiguracao'

const t = textos.configuracoes
export type ItemConfig = 'precos' | 'oferta' | 'termos' | 'privacidade'

function Valores({ item, c }: { item: ItemConfig; c: Configuracoes }) {
  if (item === 'precos') {
    const linha = (p: 'pix' | 'parcelado' | 'recorrente'): [string, ReactNode] => [
      p === 'pix' ? t.pix : p === 'parcelado' ? t.parcelado : t.recorrente,
      `${formatarPreco(c[`${p}_cheio`])} · ${t.oferta}: ${formatarPreco(c[`${p}_oferta`])}`,
    ]
    return <Dados itens={[linha('pix'), linha('parcelado'), linha('recorrente')]} />
  }
  if (item === 'oferta') {
    return (
      <Dados
        itens={[
          [t.inicio, formatarDataHora(new Date(c.oferta_inicio))],
          [t.fim, formatarDataHora(new Date(c.oferta_fim))],
        ]}
      />
    )
  }
  const em = item === 'termos' ? c.termos_atualizado_em : c.privacidade_atualizado_em
  return (
    <>
      <p className="text-[13px] text-suave">{t.atualizado(formatarData(new Date(em)))}</p>
      <ol className="flex list-decimal flex-col gap-1 pl-5 text-[13px] text-[#40504B]">
        {lerSecoes(c[item]).map((s, i) => (
          <li key={i}>{s.titulo}</li>
        ))}
      </ol>
    </>
  )
}

/** Valores atuais do item de configuração; editar abre a janela. */
export function ConfigDetalhe({ item, c }: { item: ItemConfig; c: Configuracoes }) {
  const [editando, setEditando] = useState(false)
  const fechar = () => setEditando(false)
  return (
    <CartaoDetalhe titulo={t.itens[item]}>
      <Valores item={item} c={c} />
      <BotaoBrilho className="self-start" onClick={() => setEditando(true)}>
        {textos.editar}
      </BotaoBrilho>
      {editando && item === 'precos' && <FormPrecos config={c} aoFechar={fechar} />}
      {editando && item === 'oferta' && <FormOferta config={c} aoFechar={fechar} />}
      {editando && (item === 'termos' || item === 'privacidade') && (
        <FormDocumento campo={item} valor={c[item]} aoFechar={fechar} />
      )}
    </CartaoDetalhe>
  )
}
