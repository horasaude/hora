import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import type { z } from 'zod'
import { paraCampoBrasilia } from '@/lib/datas'
import { salvarAviso, type Aviso } from '../api/agenda.api'
import { useSalvar } from '../hooks/usePainel'
import { esquemaAviso } from '../schemas/formularios'
import { textos } from '../textos'
import { FormAgenda, type CampoDef } from './FormAgenda'

const t = textos.avisos
type Entrada = z.input<typeof esquemaAviso>
const CAMPOS: CampoDef<Entrada>[] = [
  { nome: 'titulo', rotulo: t.campoTitulo },
  { nome: 'publicar_em', rotulo: t.campoPublicarEm, tipo: 'datahora' },
  { nome: 'texto', rotulo: t.campoTexto, tipo: 'area' },
]

/** Janela de criar ou editar aviso. Ao criar, abre o aviso novo na lista. */
export function AvisoForm({ aviso, aoFechar }: { aviso?: Aviso; aoFechar: () => void }) {
  const salvar = useSalvar(salvarAviso)
  const navegar = useNavigate()
  const [agora] = useState(() => new Date())
  return (
    <FormAgenda<Entrada, z.output<typeof esquemaAviso>>
      titulo={aviso ? t.editar : t.novo}
      campos={CAMPOS}
      inicial={{
        titulo: aviso?.titulo ?? '',
        texto: aviso?.texto ?? '',
        publicar_em: paraCampoBrasilia(aviso ? new Date(aviso.publicar_em) : agora),
      }}
      resolver={zodResolver(esquemaAviso)}
      aoCancelar={aoFechar}
      aoSalvar={async (d) => {
        const salvo = await salvar.mutateAsync({ ...d, id: aviso?.id })
        if (aviso) aoFechar()
        else navegar(`/app/admin/avisos/${salvo.id}`)
      }}
    />
  )
}
