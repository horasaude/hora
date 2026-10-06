import { Link, useNavigate, useParams } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import type { z } from 'zod'
import { formatarDataHora, paraCampoBrasilia } from '@/lib/datas'
import { salvarLive } from '../api/agenda.api'
import { Estado } from '../components/Estado'
import { FormAgenda, type CampoDef } from '../components/FormAgenda'
import { Linha } from '../components/Linha'
import { useAcoes, useLive, useLives, useSalvar } from '../hooks/usePainel'
import { esquemaLive } from '../schemas/formularios'
import { textos } from '../textos'

const t = textos.lives
type Entrada = z.input<typeof esquemaLive>
const CAMPOS: CampoDef<Entrada>[] = [
  { nome: 'tema', rotulo: t.campoTema },
  { nome: 'data', rotulo: t.campoData, tipo: 'datahora' },
  { nome: 'convidada', rotulo: t.campoConvidada },
  { nome: 'link_url', rotulo: t.campoLink, tipo: 'link' },
  { nome: 'gravacao_url', rotulo: t.campoGravacao, tipo: 'link' },
]

export function LivesPage() {
  const lives = useLives()
  const { publicar } = useAcoes()
  const lista = lives.data ?? []
  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-titulo text-3xl text-ora">{t.titulo}</h1>
        <Link
          to="nova"
          className="inline-flex min-h-11 items-center rounded-lg bg-ora px-5 font-semibold text-white"
        >
          {t.nova}
        </Link>
      </div>
      {lives.isPending && <Estado tipo="carregando" />}
      {lives.isError && <Estado tipo="erro" tentar={() => lives.refetch()} />}
      {lives.isSuccess && lista.length === 0 && <Estado tipo="vazio" texto={t.vazio} />}
      <ul className="flex flex-col gap-2">
        {lista.map((l) => (
          <Linha
            key={l.id}
            titulo={l.tema}
            detalhe={[formatarDataHora(new Date(l.data)), l.convidada].filter(Boolean).join(' · ')}
            publicado={l.publicado}
            para={l.id}
            ocupado={publicar.isPending}
            aoPublicar={() =>
              publicar.mutate({ tabela: 'lives', id: l.id, publicado: !l.publicado })
            }
          />
        ))}
      </ul>
    </section>
  )
}

export function LivePage() {
  const { liveId } = useParams()
  const live = useLive(liveId)
  const salvar = useSalvar(salvarLive)
  const navegar = useNavigate()
  if (liveId && live.isPending) return <Estado tipo="carregando" />
  if (liveId && live.isError) return <Estado tipo="erro" tentar={() => live.refetch()} />
  const l = live.data
  const inicial: Entrada = {
    tema: l?.tema ?? '',
    data: l ? paraCampoBrasilia(new Date(l.data)) : '',
    convidada: l?.convidada ?? '',
    link_url: l?.link_url ?? '',
    gravacao_url: l?.gravacao_url ?? '',
  }
  return (
    <section className="flex flex-col gap-4">
      <h1 className="font-titulo text-3xl text-ora">{liveId ? t.editar : t.nova}</h1>
      <FormAgenda<Entrada, z.output<typeof esquemaLive>>
        campos={CAMPOS}
        inicial={inicial}
        resolver={zodResolver(esquemaLive)}
        aoCancelar={() => navegar('/app/admin/lives')}
        aoSalvar={async (d) => {
          await salvar.mutateAsync({ ...d, id: liveId })
          navegar('/app/admin/lives')
        }}
      />
    </section>
  )
}
