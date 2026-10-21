import { Vazio } from '@/components/ui'
import { temaAtual } from '@/domain/trilha'
import { ComeceAqui } from '../components/ComeceAqui'
import { EstadoAluna } from '../components/EstadoAluna'
import { ListaTemas } from '../components/ListaTemas'
import { TopoTrilha } from '../components/TopoTrilha'
import { useTrilha } from '../hooks/useTrilha'
import { textos } from '../textos'

/** Comece por aqui: o dia da aluna, os passos iniciais e os temas em sequência (abrem pela data de assinatura). */
export function TrilhaPage() {
  const trilha = useTrilha()
  if (trilha.isPending) return <EstadoAluna tipo="carregando" />
  if (trilha.isError) return <EstadoAluna tipo="erro" tentar={() => trilha.refetch()} />
  const t = trilha.data
  if (t.dia === null) return <EstadoAluna tipo="aviso" texto={textos.semAcesso} />
  const atual = temaAtual(t)
  return (
    <section className="flex flex-col gap-6 lg:gap-8">
      <TopoTrilha dia={t.dia} tema={atual} aulas={atual?.aulas ?? []} />
      <ComeceAqui />
      {t.temas.length === 0 ? (
        <Vazio>{textos.sequencia.vazio}</Vazio>
      ) : (
        <ListaTemas temas={t.temas} dia={t.dia} />
      )}
    </section>
  )
}
