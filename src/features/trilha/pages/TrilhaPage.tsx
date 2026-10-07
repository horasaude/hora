import { useState } from 'react'
import { Cartao, classeBrilho, Vazio } from '@/components/ui'
import { diasParaEscolha, etapaAtual, precisaEscolherTema, type Trilha } from '@/domain/trilha'
import { ListaAulas } from '../components/CartaoAula'
import { ComeceAqui } from '../components/ComeceAqui'
import { EscolhaTema } from '../components/EscolhaTema'
import { AbasEtapas, ConteudoEtapa } from '../components/Etapas'
import { EstadoAluna } from '../components/EstadoAluna'
import { TopoTrilha } from '../components/TopoTrilha'
import { useTrilha } from '../hooks/useTrilha'
import { textos } from '../textos'

function Preparacao({ trilha }: { trilha: Trilha }) {
  const t = textos.preparacao
  return (
    <section className="flex flex-col gap-4">
      <div>
        <h2 className="text-[19px] font-bold text-verde-escuro">{t.titulo}</h2>
        <p className="text-sm text-suave">{t.subtitulo}</p>
      </div>
      {trilha.preparacao.length === 0 ? (
        <Vazio>{t.vazio}</Vazio>
      ) : (
        <ListaAulas
          aulas={trilha.preparacao}
          fechada={(a) => textos.liberaNoDia(a.dia_liberacao)}
        />
      )}
    </section>
  )
}

function AguardandoEscolha({ dia }: { dia: number }) {
  return (
    <Cartao className="flex flex-col gap-1 border-2 border-dourado/40">
      <p className="text-[17px] font-bold text-tinta">{textos.escolhaEm(diasParaEscolha(dia))}</p>
      <p className="text-sm text-suave">{textos.escolhaTexto}</p>
    </Cartao>
  )
}

function DoTema({ trilha }: { trilha: Trilha }) {
  const [aba, setAba] = useState(() => etapaAtual(trilha.etapas)?.id ?? trilha.etapas[0]?.id ?? '')
  const [preparo, setPreparo] = useState(false)
  const etapa = trilha.etapas.find((e) => e.id === aba) ?? trilha.etapas[0]
  return (
    <section className="flex flex-col gap-5">
      <AbasEtapas etapas={trilha.etapas} ativa={etapa?.id ?? ''} aoEscolher={setAba} />
      {etapa && <ConteudoEtapa key={etapa.id} etapa={etapa} etapas={trilha.etapas} />}
      <button
        type="button"
        onClick={() => setPreparo((v) => !v)}
        className={`${classeBrilho('cinza', 'sm')} self-start`}
      >
        {textos.verPreparacao}
      </button>
      {preparo && <Preparacao trilha={trilha} />}
    </section>
  )
}

/** Trilha: topo com o dia, Comece por aqui, preparação (dias 1 a 7), escolha do tema e etapas. */
export function TrilhaPage() {
  const trilha = useTrilha()
  if (trilha.isPending) return <EstadoAluna tipo="carregando" />
  if (trilha.isError) return <EstadoAluna tipo="erro" tentar={() => trilha.refetch()} />
  const t = trilha.data
  if (t.dia === null) return <EstadoAluna tipo="aviso" texto={textos.semAcesso} />
  const tema = t.temas.find((x) => x.id === t.tema_atual) ?? null
  const atual = etapaAtual(t.etapas)
  return (
    <section className="flex flex-col gap-6 lg:gap-8">
      <TopoTrilha dia={t.dia} tema={tema} aulas={tema ? (atual?.aulas ?? []) : t.preparacao} />
      <ComeceAqui />
      {tema ? (
        <DoTema trilha={t} />
      ) : precisaEscolherTema(t) ? (
        <section className="flex flex-col gap-4">
          <div>
            <h2 className="text-[19px] font-bold text-verde-escuro">{textos.tema.titulo}</h2>
            <p className="text-sm text-suave">{textos.tema.texto}</p>
          </div>
          <EscolhaTema temas={t.temas} />
          <Preparacao trilha={t} />
        </section>
      ) : (
        <>
          <AguardandoEscolha dia={t.dia} />
          <Preparacao trilha={t} />
        </>
      )}
    </section>
  )
}
