import { semanaDoAcesso } from '@/domain/trilha'
import { Retrato } from '@/components/ui'
import { useMeuPerfil } from '@/features/auth'
import { useLugarNoPodio } from '@/features/ranking'
import { useTrilha } from '@/features/trilha'
import { useAvatar } from '../hooks/usePerfil'
import { textos } from '../textos'

/** Foto (ou a inicial) num círculo; com a coroinha quando ela está no pódio do mês. */
export function Avatar({
  nome,
  caminho,
  tamanho = 'size-16 lg:size-20',
}: {
  nome: string
  caminho: string | null | undefined
  tamanho?: string
}) {
  const foto = useAvatar(caminho)
  return (
    <Retrato
      nome={nome}
      foto={foto.data ?? null}
      lugar={useLugarNoPodio()}
      tamanho={tamanho}
      texto="text-2xl"
    />
  )
}

/** Topo do perfil: foto ou inicial, nome, apelido e o dia do acesso. */
export function Topo() {
  const p = useMeuPerfil().data
  const dia = useTrilha().data?.dia
  const nome = p?.nome || p?.apelido || ''
  return (
    <header className="flex items-center gap-4 lg:gap-5">
      <Avatar nome={nome} caminho={p?.avatar_path} />
      <div className="min-w-0">
        <h1 className="truncate text-[26px] leading-tight font-bold text-verde-escuro lg:text-[30px]">
          {nome}
        </h1>
        {p?.apelido && <p className="text-[15px] text-tinta">@{p.apelido}</p>}
        {dia && <p className="text-sm text-suave">{textos.dia(dia, semanaDoAcesso(dia))}</p>}
      </div>
    </header>
  )
}
