import { useState } from 'react'
import { createPortal } from 'react-dom'
import { useParams } from 'react-router-dom'
import { Abas, BotaoBrilho, Carregando, ErroCarregar, LinkBrilho, Vazio } from '@/components/ui'
import type { ListaCompras } from '@/domain/listaCompras'
import { linkWhatsAppMensagem } from '@/lib/whatsapp'
import { ImpressaoCompras, ItensCompra } from '../components/ItensCompra'
import { useMarcarItem } from '../hooks/useCardapios'
import { useListaCompras } from '../hooks/useListaCompras'
import { textos } from '../textos'

const t = textos.compras
type Dias = '3' | '7' | '14'
const PERIODOS = (['3', '7', '14'] as const).map((d) => ({ id: d, nome: t.dias(Number(d)) }))

/** Texto do WhatsApp: título e os itens por categoria. */
const mensagem = (titulo: string, dias: number, lista: ListaCompras) =>
  [
    t.mensagem(titulo, dias),
    ...lista.map(
      (g) => `\n*${g.grupo}*\n${g.itens.map((i) => `- ${i.nome}: ${i.quantidade}`).join('\n')}`,
    ),
  ].join('\n')

function Barra({
  dias,
  setDias,
  texto,
}: {
  dias: Dias
  setDias: (d: Dias) => void
  texto: string
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <Abas opcoes={PERIODOS} ativa={dias} aoEscolher={setDias} rotulo={t.periodo} />
      <div className="flex flex-wrap gap-2">
        <a
          href={linkWhatsAppMensagem(texto)}
          target="_blank"
          rel="noreferrer"
          className="brilho brilho-verde inline-flex min-h-9 items-center rounded-full px-4 text-[13px] font-bold"
        >
          {t.whatsapp}
        </a>
        <BotaoBrilho tom="cinza" onClick={() => window.print()}>
          {t.imprimir}
        </BotaoBrilho>
      </div>
    </div>
  )
}

function Cabecalho({ titulo }: { titulo: string }) {
  return (
    <header className="flex flex-col gap-1">
      <h1 className="text-[28px] leading-tight font-bold text-verde-escuro lg:text-[30px]">
        {t.titulo}
      </h1>
      <p className="text-[15px] text-suave">{titulo}</p>
    </header>
  )
}

/** Lista de compras do cardápio: soma do período, marcar itens (salvo no banco), WhatsApp e imprimir. */
export function ListaComprasPage() {
  const { cardapioId = '' } = useParams()
  const [dias, setDias] = useState<Dias>('7')
  const {
    cardapios,
    carregando,
    cardapio: c,
    lista,
    marcados,
  } = useListaCompras(cardapioId, Number(dias))
  const marcar = useMarcarItem(cardapioId)
  if (carregando) return <Carregando texto={textos.carregando} />
  if (cardapios.isError)
    return (
      <ErroCarregar
        texto={textos.erro}
        tentar={textos.tentar}
        aoTentar={() => cardapios.refetch()}
      />
    )
  if (!c) return <Vazio>{textos.naoEncontrado}</Vazio>
  const todos = lista.flatMap((g) => g.itens)
  const feitos = todos.filter((i) => marcados.includes(i.nome)).length
  return (
    <section className="flex flex-col gap-5 lg:gap-6">
      <LinkBrilho
        to={`/app/cardapios/${cardapioId}`}
        tom="cinza"
        tamanho="sm"
        className="self-start"
      >
        {t.voltar}
      </LinkBrilho>
      <Cabecalho titulo={c.titulo} />
      {todos.length === 0 ? (
        <Vazio>{t.vazio}</Vazio>
      ) : (
        <>
          <Barra dias={dias} setDias={setDias} texto={mensagem(c.titulo, Number(dias), lista)} />
          <p className="text-sm text-suave" role="status">
            {t.marcados(feitos, todos.length)}
          </p>
          <ItensCompra
            lista={lista}
            marcados={marcados}
            aoMarcar={(item, marcado) => marcar.mutate({ item, marcado })}
          />
          {createPortal(
            <ImpressaoCompras
              titulo={`${t.titulo} · ${c.titulo} · ${t.dias(Number(dias))}`}
              lista={lista}
            />,
            document.body,
          )}
        </>
      )}
    </section>
  )
}
