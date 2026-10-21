import { AvisoErro, BotaoBrilho, PontosGanhos } from '@/components/ui'
import { janelaDaLive } from '@/domain/lives'
import { formatarDataHora } from '@/lib/datas'
import type { Live } from '../api/lives.api'
import { useEntrarLive } from '../hooks/useLives'
import { textos } from '../textos'
import { IconeVideo } from './IconesLive'

/** "Entrar na live" em vidro dourado só de 30 min antes até o fim.
 * Fora disso: o horário; no destaque (rotulo), o botão aparece apagado até a sala abrir. */
export function BotaoEntrar({
  live,
  agora,
  rotulo,
  claro = false,
}: {
  live: Live
  agora: Date
  rotulo?: string
  claro?: boolean
}) {
  const entrar = useEntrarLive()
  const inicio = new Date(live.data)
  const aberta = janelaDaLive(inicio, live.duracao_minutos, agora) === 'aberta'
  if (!aberta && !rotulo)
    return <span className="text-sm font-bold text-suave">{formatarDataHora(inicio)}</span>
  const r = entrar.data
  const nota = claro ? 'text-white/85' : 'text-suave'
  return (
    <div className="relative flex flex-col gap-1">
      <BotaoBrilho
        tom="dourado"
        tamanho="lg"
        className="self-start"
        title={aberta ? undefined : textos.abreAntes}
        disabled={!aberta || entrar.isPending}
        onClick={() => entrar.mutate(live.id)}
      >
        {rotulo && <IconeVideo />}
        {entrar.isPending ? textos.entrando : (rotulo ?? textos.entrar)}
      </BotaoBrilho>
      {r && <PontosGanhos pontos={r.pontos} chave={1} />}
      {r && !r.link && (
        <p className={`text-sm ${claro ? 'text-white' : 'text-terracota-escuro'}`}>
          {textos.semSala}
        </p>
      )}
      {(live.presente || r) && (
        <p className={`text-[13px] ${nota}`}>
          {r && r.pontos > 0 ? textos.pontos(r.pontos) : textos.presente}
        </p>
      )}
      <AvisoErro texto={entrar.isError ? textos.erroEntrar : null} />
    </div>
  )
}
