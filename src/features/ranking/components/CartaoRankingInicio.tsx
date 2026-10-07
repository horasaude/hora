import { Cartao, LinkBrilho } from '@/components/ui'
import { useMinhaPosicao, useUltimoPonto } from '../hooks/useRanking'
import { textos } from '../textos'

const t = textos.inicio

/** Início: posição real no mês e os pontos da última ação. */
export function CartaoRankingInicio({ children }: { children?: React.ReactNode }) {
  const { eu, isPending } = useMinhaPosicao('mes')
  const ultimo = useUltimoPonto()
  return (
    <Cartao className="flex flex-col gap-1" aria-busy={isPending}>
      <h2 className="text-base font-bold text-tinta">{t.titulo}</h2>
      {eu && eu.pontos > 0 ? (
        <>
          <p className="text-[40px] leading-tight font-bold text-verde-escuro">
            {textos.posicaoDe(eu.posicao)}
          </p>
          {ultimo.data && (
            <p className="text-sm font-bold text-terracota-escuro">
              {textos.ultimo(ultimo.data.pontos, ultimo.data.acao, ultimo.data.motivo)}
            </p>
          )}
        </>
      ) : (
        !isPending && <p className="py-2 text-sm text-suave">{t.semPontos}</p>
      )}
      {children}
      <LinkBrilho to="/app/ranking" className="mt-4 self-start">
        {t.ver}
      </LinkBrilho>
    </Cartao>
  )
}
