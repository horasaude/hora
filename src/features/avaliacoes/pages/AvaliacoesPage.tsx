import { Link } from 'react-router-dom'
import { BarraProgresso } from '@/components/ui'
import { progresso } from '@/domain/anamnese'
import { formatarData } from '@/lib/datas'
import type { Avaliacao } from '../api/avaliacoes.api'
import { Estado } from '../components/Estado'
import { useAvaliacoes } from '../hooks/useAvaliacoes'
import { textos } from '../textos'

function Cartao({ a }: { a: Avaliacao }) {
  const pct = progresso(a.perguntas, a.respostas)
  return (
    <Link
      to={`/app/avaliacoes/${a.id}`}
      className="flex flex-col gap-3 rounded-[20px] bg-white p-5 shadow-cartao"
    >
      <span className="text-[17px] font-bold text-verde-escuro">{a.titulo}</span>
      {a.descricao && <span className="text-sm text-suave">{a.descricao}</span>}
      {a.enviada_em ? (
        <span className="text-sm font-bold text-ora">
          {textos.respondidaEm(formatarData(new Date(a.enviada_em)))} · {textos.ver}
        </span>
      ) : (
        <BarraProgresso pct={pct} legenda={pct ? textos.pct(pct) : textos.responder} />
      )}
    </Link>
  )
}

function Lista({ titulo, lista }: { titulo: string; lista: Avaliacao[] }) {
  if (lista.length === 0) return null
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-[19px] font-bold text-verde-escuro">{titulo}</h2>
      <ul className="grid gap-3 lg:grid-cols-2">
        {lista.map((a) => (
          <li key={a.id}>
            <Cartao a={a} />
          </li>
        ))}
      </ul>
    </section>
  )
}

/** Avaliações da aluna: anamneses para responder e as já enviadas. */
export function AvaliacoesPage() {
  const q = useAvaliacoes()
  const lista = (q.data ?? []).filter((a) => a.perguntas.length > 0)
  return (
    <section className="flex flex-col gap-6 font-sistema">
      <h1 className="text-[26px] font-bold text-verde-escuro">{textos.titulo}</h1>
      {q.isPending ? (
        <Estado tipo="carregando" />
      ) : q.isError ? (
        <Estado tipo="erro" tentar={() => q.refetch()} />
      ) : lista.length === 0 ? (
        <Estado tipo="vazio" texto={textos.vazio} />
      ) : (
        <>
          <Lista titulo={textos.pendentes} lista={lista.filter((a) => !a.enviada_em)} />
          <Lista titulo={textos.respondidas} lista={lista.filter((a) => a.enviada_em)} />
        </>
      )}
    </section>
  )
}
