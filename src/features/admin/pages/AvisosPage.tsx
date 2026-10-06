import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import type { z } from 'zod'
import { formatarDataHora, paraCampoBrasilia } from '@/lib/datas'
import { salvarAviso } from '../api/agenda.api'
import { Estado } from '../components/Estado'
import { FormAgenda, type CampoDef } from '../components/FormAgenda'
import { Linha } from '../components/Linha'
import { useAcoes, useAviso, useAvisos, useSalvar } from '../hooks/usePainel'
import { esquemaAviso } from '../schemas/formularios'
import { textos } from '../textos'

const t = textos.avisos
type Entrada = z.input<typeof esquemaAviso>
const CAMPOS: CampoDef<Entrada>[] = [
  { nome: 'titulo', rotulo: t.campoTitulo },
  { nome: 'texto', rotulo: t.campoTexto, tipo: 'area' },
  { nome: 'publicar_em', rotulo: t.campoPublicarEm, tipo: 'datahora' },
]

export function AvisosPage() {
  const avisos = useAvisos()
  const { publicar } = useAcoes()
  const lista = avisos.data ?? []
  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-titulo text-3xl text-ora">{t.titulo}</h1>
        <Link
          to="novo"
          className="inline-flex min-h-11 items-center rounded-lg bg-ora px-5 font-semibold text-white"
        >
          {t.novo}
        </Link>
      </div>
      {avisos.isPending && <Estado tipo="carregando" />}
      {avisos.isError && <Estado tipo="erro" tentar={() => avisos.refetch()} />}
      {avisos.isSuccess && lista.length === 0 && <Estado tipo="vazio" texto={t.vazio} />}
      <ul className="flex flex-col gap-2">
        {lista.map((a) => (
          <Linha
            key={a.id}
            titulo={a.titulo}
            detalhe={formatarDataHora(new Date(a.publicar_em))}
            publicado={a.publicado}
            para={a.id}
            ocupado={publicar.isPending}
            aoPublicar={() =>
              publicar.mutate({ tabela: 'avisos', id: a.id, publicado: !a.publicado })
            }
          />
        ))}
      </ul>
    </section>
  )
}

export function AvisoPage() {
  const { avisoId } = useParams()
  const aviso = useAviso(avisoId)
  const salvar = useSalvar(salvarAviso)
  const navegar = useNavigate()
  const [agora] = useState(() => new Date())
  if (avisoId && aviso.isPending) return <Estado tipo="carregando" />
  if (avisoId && aviso.isError) return <Estado tipo="erro" tentar={() => aviso.refetch()} />
  const a = aviso.data
  const inicial: Entrada = {
    titulo: a?.titulo ?? '',
    texto: a?.texto ?? '',
    publicar_em: paraCampoBrasilia(a ? new Date(a.publicar_em) : agora),
  }
  return (
    <section className="flex flex-col gap-4">
      <h1 className="font-titulo text-3xl text-ora">{avisoId ? t.editar : t.novo}</h1>
      <FormAgenda<Entrada, z.output<typeof esquemaAviso>>
        campos={CAMPOS}
        inicial={inicial}
        resolver={zodResolver(esquemaAviso)}
        aoCancelar={() => navegar('/app/admin/avisos')}
        aoSalvar={async (d) => {
          await salvar.mutateAsync({ ...d, id: avisoId })
          navegar('/app/admin/avisos')
        }}
      />
    </section>
  )
}
