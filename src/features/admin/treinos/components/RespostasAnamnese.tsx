import { textoResposta } from '@/domain/anamnese'
import { formatarData } from '@/lib/datas'
import { pedirDeNovo, type RespostaDaAluna } from '../api/anamnese.api'
import { useAcaoTreinos, useRespostasDaAluna } from '../hooks/useTreinosPainel'
import { t } from '../textos'

const a = t.anamnese

function Uma({ r, perfil }: { r: RespostaDaAluna; perfil: string }) {
  const refazer = useAcaoTreinos(pedirDeNovo)
  return (
    <details className="rounded-2xl bg-trilho px-4 py-3 text-sm">
      <summary className="cursor-pointer font-bold text-verde-escuro">
        {r.titulo}
        <span className="ml-2 font-normal text-suave">
          {r.enviada_em ? a.respondidaEm(formatarData(new Date(r.enviada_em))) : a.emAndamento}
        </span>
      </summary>
      <dl className="mt-3 flex flex-col gap-3">
        {r.perguntas.map((p) => (
          <div key={p.id}>
            <dt className="text-xs font-bold text-suave">{p.texto}</dt>
            <dd className="whitespace-pre-line text-tinta">{textoResposta(p, r.respostas)}</dd>
          </div>
        ))}
      </dl>
      <button
        type="button"
        disabled={refazer.isPending}
        onClick={() => refazer.mutate({ anamnese: r.anamnese_id, perfil })}
        className="mt-3 text-xs font-bold text-terracota-escuro underline"
      >
        {a.pedirDeNovo}
      </button>
    </details>
  )
}

/** Cartão da aluna em Alunas: as anamneses que ela respondeu, abrindo pergunta por pergunta. */
export function RespostasAnamnese({ perfil }: { perfil: string }) {
  const q = useRespostasDaAluna(perfil)
  return (
    <section className="flex flex-col gap-2 border-t border-linha pt-5">
      <h3 className="text-sm font-semibold text-suave">{a.daAluna}</h3>
      {(q.data ?? []).length === 0 ? (
        <p className="text-sm text-suave">{a.naoRespondeu}</p>
      ) : (
        (q.data ?? []).map((r) => <Uma key={r.anamnese_id} r={r} perfil={perfil} />)
      )}
    </section>
  )
}
