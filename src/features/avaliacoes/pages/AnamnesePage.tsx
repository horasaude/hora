import { useParams } from 'react-router-dom'
import { AvisoErro, BotaoBrilho, LinkBrilho, Voltar } from '@/components/ui'
import { textoResposta } from '@/domain/anamnese'
import type { Avaliacao } from '../api/avaliacoes.api'
import { CampoResposta } from '../components/CampoResposta'
import { Estado } from '../components/Estado'
import { IconeSalvo, Passos } from '../components/Passos'
import { useAvaliacoes } from '../hooks/useAvaliacoes'
import { useResponder } from '../hooks/useResponder'
import { textos } from '../textos'

function Respostas({ a }: { a: Avaliacao }) {
  return (
    <dl className="flex flex-col gap-4 rounded-[22px] bg-white p-5 shadow-cartao">
      {a.perguntas.map((p) => (
        <div key={p.id}>
          <dt className="text-sm font-bold text-verde-escuro">{p.texto}</dt>
          <dd className="mt-1 whitespace-pre-line text-tinta">{textoResposta(p, a.respostas)}</dd>
        </div>
      ))}
    </dl>
  )
}

function Responder({ a }: { a: Avaliacao }) {
  const r = useResponder(a)
  if (r.enviada)
    return (
      <div className="flex flex-col items-start gap-4 rounded-[22px] bg-[#EAF5EE] p-6">
        <p className="text-lg font-bold text-verde-escuro">{textos.enviada}</p>
        <LinkBrilho to="/app/avaliacoes" tom="verde">
          {textos.sair}
        </LinkBrilho>
      </div>
    )
  if (!r.p) return null
  const n = a.perguntas.length
  return (
    <div className="flex flex-col gap-5 rounded-[22px] bg-white p-5 shadow-cartao sm:p-6">
      <div>
        <Passos total={n} feitos={r.passo} />
        <p className="mt-2.5 text-[13px] text-suave">{textos.perguntaDe(r.passo + 1, n)}</p>
      </div>
      <div>
        <h2 className="text-[23px] leading-snug font-bold text-verde-escuro">{r.p.texto}</h2>
        {r.p.obrigatoria && <p className="mt-1 text-xs text-suave">{textos.obrigatoria}</p>}
      </div>
      <CampoResposta p={r.p} valor={r.respostas[r.p.id] ?? ''} aoMudar={r.responder} />
      <AvisoErro texto={r.aviso} />
      <div className="flex justify-between gap-3">
        <BotaoBrilho tom="cinza" onClick={r.voltar} disabled={r.passo === 0 || r.ocupado}>
          {textos.voltar}
        </BotaoBrilho>
        <BotaoBrilho tom="verde" onClick={r.avancar} disabled={r.ocupado}>
          {r.ocupado ? textos.salvando : r.ultimo ? textos.enviar : textos.avancar}
        </BotaoBrilho>
      </div>
      <p className="flex items-center gap-1.5 text-[13px] text-suave">
        <IconeSalvo />
        {textos.salvo}
      </p>
    </div>
  )
}

/** Uma anamnese: responder uma pergunta por vez ou, depois de enviada, ver as respostas. */
export function AnamnesePage() {
  const { anamneseId = '' } = useParams()
  const q = useAvaliacoes()
  const a = q.data?.find((x) => x.id === anamneseId)
  return (
    <section className="mx-auto flex w-full max-w-2xl flex-col gap-5 font-sistema">
      <Voltar para="/app/avaliacoes" rotulo={textos.sair}>
        {textos.sair}
      </Voltar>
      {q.isPending ? (
        <Estado tipo="carregando" />
      ) : q.isError ? (
        <Estado tipo="erro" tentar={() => q.refetch()} />
      ) : !a ? (
        <Estado tipo="vazio" texto={textos.vazio} />
      ) : (
        <>
          <header>
            <h1 className="text-[26px] font-bold text-verde-escuro">{a.titulo}</h1>
            <p className="mt-1 text-sm text-suave">{a.descricao || textos.privado}</p>
          </header>
          {a.enviada_em ? <Respostas a={a} /> : <Responder a={a} />}
        </>
      )}
    </section>
  )
}
