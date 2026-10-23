import { createPortal } from 'react-dom'
import { BotaoBrilho, LinkBrilho } from '@/components/ui'
import { linkPdfCardapio, type Cardapio } from '../api/cardapios.api'
import { textos } from '../textos'
import { useReceitasImpressao } from '../hooks/useImpressao'
import { CardapioImpresso } from './CardapioImpresso'
import { IconeBaixar, IconeCarrinho } from './IconesCardapio'

/** Abre o PDF da nutricionista numa aba nova (aberta antes do link para o navegador não bloquear). */
async function abrirPdf(caminho: string) {
  const aba = window.open('', '_blank')
  const link = await linkPdfCardapio(caminho)
  if (aba && link) aba.location.href = link
  else aba?.close()
}

/** Lista de compras e PDF lado a lado; com PDF enviado pela nutricionista, o botão abre ele. */
export function AcoesCardapio({ c }: { c: Cardapio }) {
  const receitas = useReceitasImpressao(c.refeicoes)
  return (
    <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
      {!c.texto && (
        <LinkBrilho to={`/app/cardapios/${c.id}/compras`} tom="cinza">
          <IconeCarrinho className="size-4" />
          {textos.compras.botao}
        </LinkBrilho>
      )}
      <BotaoBrilho
        tom="cinza"
        onClick={() => (c.pdf_path ? void abrirPdf(c.pdf_path) : window.print())}
      >
        <IconeBaixar className="size-4" />
        {textos.pdf}
      </BotaoBrilho>
      {createPortal(
        <CardapioImpresso
          titulo={c.titulo}
          descricao={c.descricao}
          guia={c.objetivo || textos.titulo}
          refeicoes={c.refeicoes}
          texto={c.texto}
          receitas={receitas}
        />,
        document.body,
      )}
    </div>
  )
}
