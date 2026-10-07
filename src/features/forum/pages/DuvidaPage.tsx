import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Cartao } from '@/components/ui'
import { marcarVista } from '../api/forum.api'
import { Conteudo } from '../components/Conteudo'
import { Conversa } from '../components/Duvida'
import { Responder } from '../components/Responder'
import { RegrasJanela } from '../components/RegrasJanela'
import { useAcaoForum, useDuvida } from '../hooks/useForum'
import { textos as t } from '../textos'

/** Uma dúvida do fórum na tela inteira: conversa e campo de resposta. */
export function DuvidaPage() {
  const { duvidaId = '' } = useParams()
  const duvida = useDuvida(duvidaId)
  const vista = useAcaoForum(marcarVista)
  const minhaRespondida = duvida.data?.minha && duvida.data.respondida_em
  const { mutate } = vista
  useEffect(() => {
    if (minhaRespondida) mutate(duvidaId)
  }, [minhaRespondida, duvidaId, mutate])
  return (
    <section className="flex flex-col gap-4">
      <Link
        to="/app/forum"
        className="inline-flex min-h-11 items-center self-start text-sm text-suave underline underline-offset-4"
      >
        {t.voltar}
      </Link>
      <Conteudo consulta={duvida} itens={duvida.data ? [duvida.data] : []} vazio={t.naoEncontrada}>
        {([d]) =>
          d && (
            <Cartao className="flex max-w-4xl flex-col gap-6 lg:p-8">
              <Conversa d={d} linkAula={d.aula_id ? `/app/trilha/aula/${d.aula_id}` : undefined} />
              <Responder topico={d.id} />
            </Cartao>
          )
        }
      </Conteudo>
      <RegrasJanela />
    </section>
  )
}
