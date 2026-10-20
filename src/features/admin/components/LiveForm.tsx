import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import type { z } from 'zod'
import type { Profissional } from '@/domain/lives'
import { paraCampoBrasilia } from '@/lib/datas'
import { salvarLive, type Live } from '../api/agenda.api'
import { useCriarSala } from '../hooks/useMeet'
import { useSalvar } from '../hooks/usePainel'
import { esquemaLive } from '../schemas/formularios'
import { textos } from '../textos'
import { meet } from '../textos/meet'
import { CapaLive, type EstadoCapa } from './CapaLive'
import { AvisoForm } from '../schemas/avisoForm'
import { convidadasValidas } from '../schemas/convidadas'
import { FormAgenda, type CampoDef } from './FormAgenda'
import { ParticipantesLive, type Participantes } from './ParticipantesLive'

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
  { nome: 'data', rotulo: t.campoData, tipo: 'datahora' },
  { nome: 'duracao_minutos', rotulo: t.campoDuracao, tipo: 'numero' },
]

/**
 * Janela de criar ou editar live. Ao salvar, a sala do Meet é criada (restrita) ou atualizada com
 * equipe e convidadas; ao criar, abre a live nova na lista.
 */
export function LiveForm({ live, aoFechar }: { live?: Live; aoFechar: () => void }) {
  const salvar = useSalvar(salvarLive)
  const sala = useCriarSala()
  const navegar = useNavigate()
  const [capa, setCapa] = useState<EstadoCapa>({
    caminho: live?.capa_path ?? null,
    enviando: false,
  })
  const [quem, setQuem] = useState<Participantes>({
    profissionais: (live?.profissionais ?? []) as Profissional[],
    convidadas: live?.convidadas ?? [],
  })
  return (
    <FormAgenda<Entrada, z.output<typeof esquemaLive>>
      titulo={live ? t.editar : t.nova}
      campos={CAMPOS}
      inicial={{
        tema: live?.tema ?? '',
        duracao_minutos: String(live?.duracao_minutos ?? 60),
        data: live ? paraCampoBrasilia(new Date(live.data)) : '',
        gravacao_url: live?.gravacao_url ?? '',
      }}
      resolver={zodResolver(esquemaLive)}
      aoCancelar={aoFechar}
      extra={
        <div className="flex flex-col gap-6">
          <ParticipantesLive valor={quem} aoMudar={setQuem} />
          <CapaLive inicial={live?.capa_path ?? null} aoMudar={setCapa} />
        </div>
      }
      aoSalvar={async (d) => {
        if (capa.enviando) throw new Error(textos.arquivos.esperar)
        const convidadas = convidadasValidas(quem.convidadas)
        if (!convidadas) throw new AvisoForm(meet.erroConvidada)
        const salva = await salvar.mutateAsync({
          ...d,
          profissionais: quem.profissionais,
          convidadas,
          capa_path: capa.caminho,
          id: live?.id,
        })
        // Cria a sala ou põe as convidadas novas nela; se falhar, o botão fica no detalhe.
        await sala.mutateAsync(salva.id).catch(() => null)
        if (live) aoFechar()
        else navegar(`/app/admin/lives/${salva.id}`)
      }}
    />
  )
}
