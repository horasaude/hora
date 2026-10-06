import { useNavigate } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import type { z } from 'zod'
import { paraCampoBrasilia } from '@/lib/datas'
import { salvarLive, type Live } from '../api/agenda.api'
import { useSalvar } from '../hooks/usePainel'
import { esquemaLive } from '../schemas/formularios'
import { textos } from '../textos'
import { FormAgenda, type CampoDef } from './FormAgenda'

const t = textos.lives
type Entrada = z.input<typeof esquemaLive>
const CAMPOS: CampoDef<Entrada>[] = [
  { nome: 'tema', rotulo: t.campoTema },
  { nome: 'data', rotulo: t.campoData, tipo: 'datahora' },
  { nome: 'convidada', rotulo: t.campoConvidada },
  { nome: 'link_url', rotulo: t.campoLink, tipo: 'link' },
  { nome: 'gravacao_url', rotulo: t.campoGravacao, tipo: 'link', largura: 'inteira' },
]

/** Janela de criar ou editar live. Ao criar, abre a live nova na lista. */
export function LiveForm({ live, aoFechar }: { live?: Live; aoFechar: () => void }) {
  const salvar = useSalvar(salvarLive)
  const navegar = useNavigate()
  return (
    <FormAgenda<Entrada, z.output<typeof esquemaLive>>
      titulo={live ? t.editar : t.nova}
      campos={CAMPOS}
      inicial={{
        tema: live?.tema ?? '',
        data: live ? paraCampoBrasilia(new Date(live.data)) : '',
        convidada: live?.convidada ?? '',
        link_url: live?.link_url ?? '',
        gravacao_url: live?.gravacao_url ?? '',
      }}
      resolver={zodResolver(esquemaLive)}
      aoCancelar={aoFechar}
      aoSalvar={async (d) => {
        const salva = await salvar.mutateAsync({ ...d, id: live?.id })
        if (live) aoFechar()
        else navegar(`/app/admin/lives/${salva.id}`)
      }}
    />
  )
}
