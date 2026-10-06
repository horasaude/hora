import { Cartao } from '@/components/ui'
import { useDuvidas } from '../hooks/useForum'
import { textos as t } from '../textos'
import { Conversa } from './Duvida'
import { EnviarDuvida } from './EnviarDuvida'
import { Responder } from './Responder'

/** Embaixo do vídeo: dúvidas da aula com as respostas, e Enviar dúvida. */
export function DuvidasDaAula({ aula }: { aula: string }) {
  const lista = useDuvidas({ aula, limite: 50 })
  return (
    <section className="flex flex-col gap-4" aria-labelledby="duvidas-aula">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="duvidas-aula" className="text-xl font-bold text-verde-escuro">
          {t.daAula}
        </h2>
        <div className="flex flex-col items-start gap-1 sm:items-end">
          <EnviarDuvida aula={aula} />
          <p className="text-xs text-suave">{t.prazo}</p>
        </div>
      </div>
      {lista.isError && <p className="text-sm text-terracota-escuro">{t.erroEnviar}</p>}
      {lista.data?.length === 0 && <p className="text-sm text-suave">{t.vazioAula}</p>}
      {lista.data?.map((d) => (
        <Cartao key={d.id} className="flex flex-col gap-4">
          <Conversa d={d} />
          <Responder topico={d.id} />
        </Cartao>
      ))}
    </section>
  )
}
