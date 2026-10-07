import { semanaDoAcesso } from '@/domain/trilha'
import { useMeuPerfil } from '@/features/auth'
import { useTrilha } from '@/features/trilha'
import { useAvatar } from '../hooks/usePerfil'
import { textos } from '../textos'

/** Foto (ou a inicial) num círculo. */
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
  return foto.data ? (
    <img
      src={foto.data}
      alt={textos.fotoDe(nome)}
      className={`${tamanho} shrink-0 rounded-full object-cover`}
    />
  ) : (
    <span
      aria-hidden
      className={`${tamanho} grid shrink-0 place-items-center rounded-full bg-terracota-suave text-2xl font-bold text-terracota-escuro`}
    >
      {nome[0]?.toUpperCase()}
    </span>
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
