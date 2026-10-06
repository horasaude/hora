import { useState } from 'react'
import { BotaoBrilho } from '@/components/ui'
import type { Cardapio } from '../api/modulos.api'
import { REFEICOES, refeicoesPreenchidas } from '../refeicoes'
import { ROTULOS_REFEICOES } from '../rotulosRefeicoes'
import { textos } from '../textos'
import { BotaoPublicar } from './BotaoPublicar'
import { CardapioForm } from './CardapioForm'
import { CartaoDetalhe, Dados } from './CartaoDetalhe'
import { Situacao } from './Tabela'

const t = textos.cardapios

function Bloco({ titulo, texto }: { titulo: string; texto: string }) {
  if (!texto.trim()) return null
  return (
    <div>
      <p className="text-[11px] font-bold tracking-[0.08em] text-[#8A9692] uppercase">{titulo}</p>
      <p className="mt-0.5 text-[13px] leading-relaxed whitespace-pre-line text-[#40504B]">
        {texto}
      </p>
    </div>
  )
}

/** Detalhes do cardápio: dados, refeições e lista de compras; editar abre a janela. */
export function CardapioDetalhe({ cardapio: c }: { cardapio: Cardapio }) {
  const [editando, setEditando] = useState(false)
  return (
    <CartaoDetalhe titulo={c.titulo}>
      <Dados
        itens={[
          [t.campoObjetivo, c.objetivo],
          [t.colunaRefeicoes, t.refeicoes(refeicoesPreenchidas(c))],
          [textos.status, <Situacao key="s" publicado={c.publicado} />],
        ]}
      />
      <div className="flex flex-wrap gap-2">
        <BotaoBrilho onClick={() => setEditando(true)}>{textos.editar}</BotaoBrilho>
        <BotaoPublicar tabela="cardapios" id={c.id} publicado={c.publicado} />
      </div>
      <div className="flex flex-col gap-3 border-t border-[#F0F2F1] pt-4">
        <Bloco titulo={t.campoDescricao} texto={c.descricao} />
        {REFEICOES.map((r, i) => (
          <Bloco key={r} titulo={ROTULOS_REFEICOES[i] ?? r} texto={c[r]} />
        ))}
        <Bloco titulo={t.listaCompras} texto={c.lista_compras} />
      </div>
      {editando && <CardapioForm cardapio={c} aoFechar={() => setEditando(false)} />}
    </CartaoDetalhe>
  )
}
