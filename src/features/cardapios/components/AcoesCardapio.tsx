import { createPortal } from 'react-dom'
import { BotaoBrilho, LinkBrilho } from '@/components/ui'
import { rotuloOpcao } from '@/domain/nutricao'
import type { Cardapio } from '../api/cardapios.api'
import { textos } from '../textos'
import { IconeBaixar, IconeCarrinho } from './IconesCardapio'

/** Versão limpa do cardápio para o papel (Salvar como PDF na janela de impressão). */
function ImpressaoCardapio({ c }: { c: Cardapio }) {
  return (
    <div className="area-impressao font-sistema text-black">
      <h1 className="mb-4 text-xl font-bold">{c.titulo}</h1>
      {c.refeicoes.map((r) => (
        <section key={r.id} className="mb-4 break-inside-avoid">
          <h2 className="mb-1 text-sm font-bold">
            {r.nome}
            {r.horario && ` · ${r.horario}`}
          </h2>
          {c.texto ? (
            <p className="text-sm whitespace-pre-line">{r.texto}</p>
          ) : (
            <ul>
              {r.itens.map((it, i) => (
                <li key={i} className="text-sm">
                  {it.opcoes.map((o) => `${o.nome} · ${rotuloOpcao(o)}`).join(` ${textos.ou} `)}
                </li>
              ))}
            </ul>
          )}
          {r.observacao && <p className="text-xs italic">{r.observacao}</p>}
        </section>
      ))}
    </div>
  )
}

/** Lista de compras e PDF lado a lado, no fim do cardápio. */
export function AcoesCardapio({ c }: { c: Cardapio }) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
      {!c.texto && (
        <LinkBrilho to={`/app/cardapios/${c.id}/compras`} tom="cinza">
          <IconeCarrinho className="size-4" />
          {textos.compras.botao}
        </LinkBrilho>
      )}
      <BotaoBrilho tom="cinza" onClick={() => window.print()}>
        <IconeBaixar className="size-4" />
        {textos.pdf}
      </BotaoBrilho>
      {createPortal(<ImpressaoCardapio c={c} />, document.body)}
    </div>
  )
}
