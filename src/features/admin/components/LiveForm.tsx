import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import type { z } from 'zod'
import { paraCampoBrasilia } from '@/lib/datas'
import { salvarLive, type Live } from '../api/agenda.api'
import { useSalvar } from '../hooks/usePainel'
import { esquemaLive } from '../schemas/formularios'
import { textos } from '../textos'
import { CapaLive, type EstadoCapa } from './CapaLive'
import { FormAgenda, type CampoDef } from './FormAgenda'

const t = textos.lives
type Entrada = z.input<typeof esquemaLive>
const CAMPOS: CampoDef<Entrada>[] = [
  { nome: 'tema', rotulo: t.campoTema, largura: 'inteira' },
  {
    nome: 'gravacao_url',
    rotulo: t.campoGravacao,
    tipo: 'link',
    largura: 'inteira',
    ajuda: textos.aulas.ajudaVideo,
    previaVideo: true,
  },
  {
    nome: 'profissional',
    rotulo: t.campoProfissional,
    tipo: 'escolha',
    opcoes: [
      { valor: '', nome: t.semProfissional },
      { valor: 'ana', nome: 'Ana Milhomem' },
      { valor: 'clara', nome: 'Dra. Clara Maria' },
      { valor: 'lais', nome: 'Laís Moraes' },
    ],
  },
  { nome: 'data', rotulo: t.campoData, tipo: 'datahora' },
  { nome: 'duracao_minutos', rotulo: t.campoDuracao, tipo: 'numero' },
  { nome: 'link_url', rotulo: t.campoLink, tipo: 'link' },
  { nome: 'convidada', rotulo: t.campoConvidada, largura: 'inteira' },
]

/** Janela de criar ou editar live. Ao criar, abre a live nova na lista. */
export function LiveForm({ live, aoFechar }: { live?: Live; aoFechar: () => void }) {
  const salvar = useSalvar(salvarLive)
  const navegar = useNavigate()
  const [capa, setCapa] = useState<EstadoCapa>({
    caminho: live?.capa_path ?? null,
    enviando: false,
  })
  return (
    <FormAgenda<Entrada, z.output<typeof esquemaLive>>
      titulo={live ? t.editar : t.nova}
      campos={CAMPOS}
      inicial={{
        tema: live?.tema ?? '',
        profissional: (live?.profissional ?? '') as Entrada['profissional'],
        duracao_minutos: String(live?.duracao_minutos ?? 60),
        data: live ? paraCampoBrasilia(new Date(live.data)) : '',
        convidada: live?.convidada ?? '',
        link_url: live?.link_url ?? '',
        gravacao_url: live?.gravacao_url ?? '',
      }}
      resolver={zodResolver(esquemaLive)}
      aoCancelar={aoFechar}
      extra={<CapaLive inicial={live?.capa_path ?? null} aoMudar={setCapa} />}
      aoSalvar={async (d) => {
        if (capa.enviando) throw new Error(textos.arquivos.esperar)
        const salva = await salvar.mutateAsync({ ...d, capa_path: capa.caminho, id: live?.id })
        if (live) aoFechar()
        else navegar(`/app/admin/lives/${salva.id}`)
      }}
    />
  )
}
