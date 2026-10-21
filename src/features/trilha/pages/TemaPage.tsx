import { Link, useParams, useSearchParams } from 'react-router-dom'
import { Abas, Cartao, IconeCadeado, Vazio } from '@/components/ui'
import { diasParaAbrir, type TemaTrilha } from '@/domain/trilha'
import { ListaCardapios } from '@/features/cardapios'
import { DesafiosDoTema } from '@/features/desafios'
import { TreinosDoTema } from '@/features/treinos'
import { CapaTema } from '../components/CapaTema'
import { ListaAulas } from '../components/CartaoAula'
import { EstadoAluna } from '../components/EstadoAluna'
import { MateriaisDaAula } from '../components/MateriaisDaAula'
import { useMateriaisAula, useTrilha } from '../hooks/useTrilha'
import { usePrevia } from '../previa'
import { textos } from '../textos'

const t = textos.sequencia
const ABAS = (['aulas', 'cardapio', 'treinos', 'desafio', 'materiais'] as const).map((id) => ({
  id,
  nome: t.abas[id],
}))
type Aba = (typeof ABAS)[number]['id']
const ehAba = (v: string | null): v is Aba => ABAS.some((a) => a.id === v)

function Materiais({ tema }: { tema: string }) {
  const lista = useMateriaisAula(`tema:${tema}`, true)
  if (lista.isSuccess && lista.data.length === 0) return <Vazio>{textos.materiais.vazioTema}</Vazio>
  return <MateriaisDaAula aula={`tema:${tema}`} titulo={t.abas.materiais} />
}

function Conteudo({ tema, aba }: { tema: TemaTrilha; aba: Aba }) {
  if (aba === 'cardapio')
    return (
      <div className="flex flex-col gap-4">
        <ListaCardapios temaId={tema.id} />
        <Link
          to="/app/cardapios?aba=receitas"
          className="self-start text-sm font-bold text-ora underline"
        >
          {textos.receitasEMateriais}
        </Link>
      </div>
    )
  if (aba === 'treinos') return <TreinosDoTema temaId={tema.id} />
  if (aba === 'desafio') return <DesafiosDoTema temaId={tema.id} />
  if (aba === 'materiais') return <Materiais tema={tema.id} />
  if (tema.aulas.length === 0) return <Vazio>{t.semAulas}</Vazio>
  return <ListaAulas aulas={tema.aulas} capaTema={tema.capa} fechada={() => textos.emBreve} />
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

/** Página do tema: capa e, quando aberto, aulas, cardápio, treinos, desafio e materiais em abas. */
export function TemaPage() {
  const { temaId } = useParams()
  const trilha = useTrilha()
  const previa = usePrevia()
  const [busca, setBusca] = useSearchParams()
  const pedida = busca.get('aba')
  const aba: Aba = ehAba(pedida) ? pedida : 'aulas'
  if (trilha.isPending) return <EstadoAluna tipo="carregando" />
  if (trilha.isError) return <EstadoAluna tipo="erro" tentar={() => trilha.refetch()} />
  const i = trilha.data.temas.findIndex((x) => x.id === temaId)
  const tema = trilha.data.temas[i]
  const voltar = (
    <Link
      to={previa ? `/app/previa${previa.sufixo}` : '/app/trilha'}
      className="self-start text-sm font-bold text-ora underline"
    >
      {t.voltar}
    </Link>
  )
  if (!tema) return <EstadoAluna tipo="aviso" texto={t.naoEncontrado} />
  const mudar = (id: Aba) => {
    const nova = new URLSearchParams(busca)
    if (id === 'aulas') nova.delete('aba')
    else nova.set('aba', id)
    setBusca(nova, { replace: true })
  }
  return (
    <section className="flex flex-col gap-5">
      {voltar}
      <CapaTema tema={tema} rotulo={t.temaN(i + 1)} />
      {tema.aberto ? (
        <>
          <Abas opcoes={ABAS} ativa={aba} aoEscolher={mudar} rotulo={t.abasRotulo} />
          <Conteudo tema={tema} aba={aba} />
        </>
      ) : (
        <Fechado tema={tema} dia={trilha.data.dia ?? 0} />
      )}
    </section>
  )
}
