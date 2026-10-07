import { AvisoErro, BotaoBrilho, PontosGanhos } from '@/components/ui'
import { janelaDaLive } from '@/domain/lives'
import { formatarDataHora } from '@/lib/datas'
import type { Live } from '../api/lives.api'
import { useEntrarLive } from '../hooks/useLives'
import { textos } from '../textos'

/** "Entrar na live" em vidro dourado só de 30 min antes até o fim; fora disso, o horário. */
export function BotaoEntrar({ live, agora }: { live: Live; agora: Date }) {
  const entrar = useEntrarLive()
  const inicio = new Date(live.data)
  if (janelaDaLive(inicio, live.duracao_minutos, agora) !== 'aberta')
    return <span className="text-sm font-bold text-suave">{formatarDataHora(inicio)}</span>
  const r = entrar.data
  return (
    <div className="relative flex flex-col gap-1">
      <BotaoBrilho
        tom="dourado"
        tamanho="lg"
        className="self-start"
        disabled={entrar.isPending}
        onClick={() => entrar.mutate(live.id)}
      >
        {entrar.isPending ? textos.entrando : textos.entrar}
      </BotaoBrilho>
      {r && <PontosGanhos pontos={r.pontos} chave={1} />}
      {r && !r.link && <p className="text-sm text-terracota-escuro">{textos.semSala}</p>}
      {(live.presente || r) && (
        <p className="text-[13px] text-suave">
          {r && r.pontos > 0 ? textos.pontos(r.pontos) : textos.presente}
        </p>
      )}
      <AvisoErro texto={entrar.isError ? textos.erroEntrar : null} />
    </div>
  )
}
