import { Cartao } from '@/components/ui'
import { useRegrasPontos } from '../hooks/useRanking'
import { textos } from '../textos'

const t = textos.comoGanhar

/** Como ganhar pontos: as regras ligadas no painel, com os pontos de cada uma. */
export function ComoGanhar() {
  const regras = useRegrasPontos()
  if (regras.isError || (regras.data && regras.data.length === 0)) return null
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-[19px] font-bold text-verde-escuro">{t.titulo}</h2>
      <Cartao className="flex flex-col gap-2.5 py-4 text-[14px]" aria-busy={regras.isPending}>
        {regras.isPending ? (
          <p className="text-suave">{textos.carregando}</p>
        ) : (
          <ul className="flex flex-col gap-2.5">
            {regras.data.map((r) => (
              <li key={r.acao} className="flex items-center justify-between gap-3">
                <span className="text-tinta">{r.nome}</span>
                <b className="text-verde-vivo">{t.pontos(r.pontos)}</b>
              </li>
            ))}
          </ul>
        )}
      </Cartao>
    </section>
  )
}
