import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { BotaoBrilho, Janela } from '@/components/ui'
import { Estado } from '../../components/Estado'
import type { CardapioLinha } from '../api/cardapios.api'
import { refeicoesDoCardapio } from '../cardapioForm'
import { BarraTopo } from '../components/BarraTopo'
import { CardapioCampos } from '../components/CardapioCampos'
import { CardapioVisual } from '../components/CardapioVisual'
import { CarregarJanela } from '../components/CarregarJanela'
import { Impressao } from '../components/Impressao'
import { ListaComprasEditor } from '../components/ListaComprasEditor'
import { RefeicoesCardapio } from '../components/RefeicoesCardapio'
import { ResumoNutrientes } from '../components/ResumoNutrientes'
import { LISTA_CARDAPIOS, useEditorCardapio } from '../hooks/useEditorCardapio'
import { useCardapio } from '../hooks/usePlano'
import { textos } from '../textos'
import { tCardapios as t } from '../textos2'

type Ed = ReturnType<typeof useEditorCardapio>
type Aberta = 'ver' | 'carregar' | 'pdf' | null

function Janelas({ aberta, fechar, e }: { aberta: Aberta; fechar: () => void; e: Ed }) {
  if (aberta === 'pdf') return <Impressao f={e.f} aoTerminar={fechar} />
  if (aberta === 'carregar') {
    return (
      <CarregarJanela
        titulo={t.carregarSalvo}
        tipo="cardapio"
        aviso={t.carregarAviso}
        aoFechar={fechar}
        aoEscolher={async (id) => e.mudar(await refeicoesDoCardapio(id))}
      />
    )
  }
  if (aberta !== 'ver') return null
  return (
    <Janela
      larga
      titulo={t.visualizarAluna}
      aoFechar={fechar}
      rotuloFechar={textos.fechar}
      rodape={
        <BotaoBrilho tom="cinza" onClick={fechar}>
          {textos.fechar}
        </BotaoBrilho>
      }
    >
      <CardapioVisual f={e.f} />
    </Janela>
  )
}

/** Ações do topo: duplicar, carregar salvo, visualizar como aluna, PDF, publicar e salvar. */
function Topo({
  e,
  cardapio,
  abrir,
}: {
  e: Ed
  cardapio?: CardapioLinha
  abrir: (a: Aberta) => void
}) {
  const { f } = e
  return (
    <BarraTopo
      voltar={LISTA_CARDAPIOS}
      titulo={f.titulo || t.novo}
      aviso={e.alterado ? textos.naoSalvo : undefined}
    >
      <BotaoBrilho tom="cinza" disabled={!cardapio} onClick={e.duplicar}>
        {textos.duplicar}
      </BotaoBrilho>
      <BotaoBrilho tom="cinza" onClick={() => abrir('carregar')}>
        {t.carregarSalvo}
      </BotaoBrilho>
      <BotaoBrilho tom="cinza" onClick={() => abrir('ver')}>
        {t.visualizarAluna}
      </BotaoBrilho>
      <BotaoBrilho tom="cinza" onClick={() => abrir('pdf')}>
        {t.pdf}
      </BotaoBrilho>
      <BotaoBrilho
        tom={f.publicado ? 'coral' : 'verde'}
        disabled={e.salvando}
        onClick={() => e.gravar({ ...f, publicado: !f.publicado })}
      >
        {f.publicado ? textos.tirarDoAr : textos.publicar}
      </BotaoBrilho>
      <BotaoBrilho disabled={e.salvando} onClick={() => e.gravar(f)}>
        {e.salvando ? textos.salvando : textos.salvar}
      </BotaoBrilho>
    </BarraTopo>
  )
}

function Editor({ cardapio }: { cardapio?: CardapioLinha }) {
  const e = useEditorCardapio(cardapio)
  const { f } = e
  const [aberta, setAberta] = useState<Aberta>(null)
  const calculado = f.modelo === 'calculado'
  return (
    <div className="flex flex-col gap-5">
      <Topo e={e} cardapio={cardapio} abrir={setAberta} />
      {e.erro === 'salvar' && (
        <p role="alert" className="text-sm text-terracota-escuro">
          {textos.erro}
        </p>
      )}
      <div
        className={`grid items-start gap-5 ${calculado ? 'lg:grid-cols-[minmax(0,1fr)_20rem]' : ''}`}
      >
        <div className="flex min-w-0 flex-col gap-5">
          <CardapioCampos f={f} mudar={e.mudar} erroNome={e.erro === 'nome'} />
          <RefeicoesCardapio
            refeicoes={f.refeicoes}
            textoLivre={!calculado}
            mudar={e.mudarRefeicoes}
          />
          <ListaComprasEditor
            lista={f.lista}
            textoLivre={!calculado}
            aoGerar={e.gerarLista}
            aoMudar={(lista) => e.mudar({ lista })}
          />
        </div>
        {calculado && <ResumoNutrientes refeicoes={f.refeicoes} />}
      </div>
      <Janelas aberta={aberta} fechar={() => setAberta(null)} e={e} />
    </div>
  )
}

/** Cardápio em página inteira (novo ou existente). */
export function CardapioPage() {
  const { cardapioId } = useParams()
  const cardapio = useCardapio(cardapioId)
  if (cardapioId && cardapio.isPending) return <Estado tipo="carregando" />
  if (cardapioId && cardapio.isError)
    return <Estado tipo="erro" tentar={() => cardapio.refetch()} />
  return <Editor key={cardapioId ?? 'novo'} cardapio={cardapio.data} />
}
