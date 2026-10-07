import { tomDaPosicao } from '@/domain/engajamento'
import { classeTom } from '@/components/ui'

/** Posição num círculo de vidro: 1º dourado, 2º prata, 3º coral, demais cinza claro. */
export function CirculoPosicao({ posicao }: { posicao: number }) {
  return (
    <span
      className={`brilho ${classeTom(tomDaPosicao(posicao))} grid size-8 shrink-0 place-items-center rounded-full text-[13px] font-bold`}
    >
      {posicao}
    </span>
  )
}
