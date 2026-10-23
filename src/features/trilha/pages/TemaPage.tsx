import { useParams, useSearchParams } from 'react-router-dom'
import { BarraProgresso, Cartao, IconeCadeado, Vazio } from '@/components/ui'
import { diasParaAbrir, progresso, type TemaTrilha } from '@/domain/trilha'
import { ListaCardapios, ListaMateriais, ListaReceitas, useMateriais } from '@/features/cardapios'
import { DesafiosDoTema } from '@/features/desafios'
import { TreinosDoTema } from '@/features/treinos'
import { AbasTema } from '../components/AbasTema'
import { ehAbaTema, type AbaTema } from '../components/abasDoTema'
import { CapaTema } from '../components/CapaTema'
import { ListaAulas } from '../components/CartaoAula'
import { EstadoAluna } from '../components/EstadoAluna'
import { TopoVoltar } from '../components/TopoVoltar'
import { MateriaisDaAula } from '../components/MateriaisDaAula'
import { useMateriaisAula, useTrilha } from '../hooks/useTrilha'
import { usePrevia } from '../previa'
import { textos } from '../textos'

const t = textos.sequencia

/** Arquivos do tema e os materiais da nutricionista ligados a ele; sem nenhum dos dois, o aviso. */
function Materiais({ tema }: { tema: string }) {
  const lista = useMateriaisAula(`tema:${tema}`, true)
  const nutricao = useMateriais()
  const semArquivos = lista.isSuccess && lista.data.length === 0
  const semNutricao =
    nutricao.isSuccess && !nutricao.data.some((m) => m.tema_id === tema && m.area === 'nutricao')
  if (semArquivos && semNutricao) return <Vazio>{textos.materiais.vazioTema}</Vazio>
  return (
    <div className="flex flex-col gap-4">
      {!semArquivos && <MateriaisDaAula aula={`tema:${tema}`} titulo={t.abas.materiais} />}
      <ListaMateriais temaId={tema} anexos={anexos} />
    </div>
  )
}

/** Anexos do material (PDF, Word, foto, link de vídeo), com links assinados pela função materiais-aula. */
const anexos = (id: string) => <MateriaisDaAula aula={`apoio:${id}`} titulo={t.anexos} />

/** Aba Saúde: orientações da Dra. Clara para o tema; sem nenhuma, o aviso. */
function Saude({ tema }: { tema: string }) {
  const m = useMateriais()
  if (m.isSuccess && !m.data.some((x) => x.tema_id === tema && x.area === 'saude'))
    return <Vazio>{textos.materiais.vazioSaude}</Vazio>
  return <ListaMateriais temaId={tema} area="saude" anexos={anexos} />
}

function Conteudo({ tema, aba }: { tema: TemaTrilha; aba: AbaTema }) {
  if (aba === 'cardapio') return <ListaCardapios temaId={tema.id} />
  if (aba === 'receitas') return <ListaReceitas temaId={tema.id} />
  if (aba === 'treinos') return <TreinosDoTema temaId={tema.id} />
  if (aba === 'desafio') return <DesafiosDoTema temaId={tema.id} />
  if (aba === 'saude') return <Saude tema={tema.id} />
  if (aba === 'materiais') return <Materiais tema={tema.id} />
  if (tema.aulas.length === 0) return <Vazio>{t.semAulas}</Vazio>
  return <ListaAulas aulas={tema.aulas} tema={tema} fechada={() => textos.emBreve} />
}

/** Cartão com a barra de progresso: "X de Y aulas concluídas · Z%". */
function Progresso({ tema }: { tema: TemaTrilha }) {
  const feitas = tema.aulas.filter((a) => a.concluida).length
  const pct = progresso(tema.aulas)
  return (
    <Cartao className="px-4 py-3">
      <BarraProgresso
        pct={pct}
        rotulo={textos.rotuloTema}
        legenda={textos.concluidasDoTema(feitas, tema.aulas.length, pct)}
      />
    </Cartao>
  )
}

function Fechado({ tema, dia }: { tema: TemaTrilha; dia: number }) {
  return (
    <Cartao className="flex items-center gap-3">
      <span className="brilho brilho-cinza grid size-10 shrink-0 place-items-center rounded-full">
        <IconeCadeado />
      </span>
      <p className="text-[15px] text-tinta">
        {tema.em_breve ? t.fechadoBreve : t.fechado(diasParaAbrir(tema, dia))}
      </p>
    </Cartao>
  )
}

/** Página do tema: capa e, quando aberto, aulas, cardápio, receitas, treinos, desafio, saúde e materiais em abas. */
export function TemaPage() {
  const { temaId } = useParams()
  const trilha = useTrilha()
  const previa = usePrevia()
  const [busca, setBusca] = useSearchParams()
  const pedida = busca.get('aba')
  const aba: AbaTema = ehAbaTema(pedida) ? pedida : 'aulas'
  const lista = previa ? `/app/previa${previa.sufixo}` : '/app/trilha'
  if (trilha.isPending || trilha.isError)
    return (
      <section className="flex flex-col gap-4">
        <TopoVoltar para={lista}>{t.voltar}</TopoVoltar>
        {trilha.isPending ? (
          <EstadoAluna tipo="carregando" />
        ) : (
          <EstadoAluna tipo="erro" tentar={() => trilha.refetch()} />
        )}
      </section>
    )
  const tema = trilha.data.temas.find((x) => x.id === temaId)
  if (!tema)
    return (
      <section className="flex flex-col gap-4">
        <TopoVoltar para={lista}>{t.voltar}</TopoVoltar>
        <EstadoAluna tipo="aviso" texto={t.naoEncontrado} />
      </section>
    )
  const mudar = (id: AbaTema) => {
    const nova = new URLSearchParams(busca)
    if (id === 'aulas') nova.delete('aba')
    else nova.set('aba', id)
    setBusca(nova, { replace: true })
  }
  return (
    <section className="flex flex-col gap-4">
      <TopoVoltar para={lista}>{tema.titulo}</TopoVoltar>
      <CapaTema tema={tema} />
      {tema.aberto ? (
        <>
          {tema.aulas.length > 0 && <Progresso tema={tema} />}
          <AbasTema ativa={aba} aoEscolher={mudar} />
          <Conteudo tema={tema} aba={aba} />
        </>
      ) : (
        <Fechado tema={tema} dia={trilha.data.dia ?? 0} />
      )}
    </section>
  )
}
