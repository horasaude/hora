import { Link } from 'react-router-dom'
import { Retrato } from '@/components/ui'
import { useMeuPerfil } from '@/features/auth'
import { useLugarNoPodio, useRetratos } from '@/features/ranking'
import { textos } from '../textos'
import { IconeSino } from './Icones'

/** Foto de perfil (ou a inicial), com a coroinha se ela estiver no pódio do mês. */
function FotoComCoroa({ nome }: { nome: string }) {
  const caminho = useMeuPerfil().data?.avatar_path
  const foto = useRetratos([caminho]).data?.get(caminho ?? '') ?? null
  return (
    <Retrato
      nome={nome}
      foto={foto}
      lugar={useLugarNoPodio()}
      tamanho="size-11 lg:size-14"
      texto="lg:text-lg"
    />
  )
}

/** Topo do Início: foto, "Dia N da sua jornada", "Oi, Nome" e o sino das notificações. */
export function Topo({ nome, dia }: { nome: string; dia: number | null }) {
  return (
    <header className="flex items-center gap-3">
      {nome && <FotoComCoroa nome={nome} />}
      <div className="min-w-0 flex-1">
        {dia !== null && <p className="text-[13px] text-suave">{textos.topo.dia(dia)}</p>}
        <h1 className="truncate text-[24px] leading-tight font-bold text-verde-escuro lg:text-[28px]">
          {textos.topo.oi(nome)}
        </h1>
      </div>
      <Link
        to="/app/perfil/conta"
        aria-label={textos.topo.sino}
        className="grid size-10 shrink-0 place-items-center rounded-full border border-linha bg-white text-verde-escuro shadow-painel transition hover:bg-areia"
      >
        <IconeSino />
      </Link>
    </header>
  )
}
