import { LinkBrilho } from '@/components/ui'
import { useAvaliacoesPendentes } from '../hooks/useAvaliacoes'
import { textos } from '../textos'

/** Aviso no Início e em Treinos enquanto houver anamnese sem enviar (aparece desde o dia 1). */
export function AvisoAnamnese() {
  const pendentes = useAvaliacoesPendentes()
  const primeira = pendentes[0]
  if (!primeira) return null
  return (
    <section className="flex flex-wrap items-center justify-between gap-3 rounded-[20px] bg-[#FFF6E5] p-4">
      <p className="text-sm font-bold text-tinta">{textos.aviso}</p>
      <LinkBrilho to={`/app/avaliacoes/${primeira.id}`} tom="dourado">
        {textos.responder}
      </LinkBrilho>
    </section>
  )
}
