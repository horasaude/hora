import { useParams } from 'react-router-dom'
import { BotaoBrilho, Carregando, Cartao, ErroCarregar, LinkBrilho, Vazio } from '@/components/ui'
import { macros } from '@/domain/nutricao'
import { sanitizarHtml } from '@/lib/html'
import { useFavoritar, useReceita } from '../hooks/useCardapios'
import { textos } from '../textos'

const t = textos.receitas

type R = NonNullable<ReturnType<typeof useReceita>['data']>

function Cabecalho({ r }: { r: R }) {
  const favoritar = useFavoritar(r.id)
  return (
    <header className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="text-[28px] leading-tight font-bold text-verde-escuro">{r.nome}</h1>
        <p className="text-sm text-suave">
          {[r.tempo_minutos && t.tempo(r.tempo_minutos), t.rende(r.porcoes)]
            .filter(Boolean)
            .join(' · ')}
        </p>
      </div>
      <BotaoBrilho
        tom={r.favorita ? 'dourado' : 'cinza'}
        aria-pressed={r.favorita}
        disabled={favoritar.isPending}
        onClick={() => favoritar.mutate(!r.favorita)}
      >
        {r.favorita ? `★ ${t.favorita}` : t.favoritar}
      </BotaoBrilho>
    </header>
  )
}

function Lateral({ r }: { r: R }) {
  const m = r.porPorcao ? macros(r.porPorcao) : null
  return (
    <aside className="flex flex-col gap-4 lg:sticky lg:top-8">
      <Cartao className="flex flex-col gap-2">
        <h2 className="text-[17px] font-bold text-verde-escuro">{t.ingredientes}</h2>
        <div
          className="texto-rico text-[15px] leading-relaxed"
          dangerouslySetInnerHTML={{ __html: sanitizarHtml(r.ingredientes) }}
        />
      </Cartao>
      {r.porPorcao && m && (
        <Cartao className="flex flex-col gap-1 text-sm">
          <h2 className="mb-1 text-[15px] font-bold text-tinta">{t.nutricao}</h2>
          <p className="text-suave">
            {textos.totais(
              r.porPorcao.kcal,
              m.proteina.gramas,
              m.carboidrato.gramas,
              m.gordura.gramas,
            )}
          </p>
        </Cartao>
      )}
    </aside>
  )
}

/** Receita aberta: foto, ingredientes, modo de preparo numerado, rendimento, nutrição por porção e favoritar. */
export function ReceitaPage() {
  const { receitaId = '' } = useParams()
  const receita = useReceita(receitaId)
  const voltar = (
    <LinkBrilho to="/app/cardapios?aba=receitas" tom="cinza" tamanho="sm" className="self-start">
      {t.voltar}
    </LinkBrilho>
  )
  if (receita.isPending) return <Carregando texto={textos.carregando} />
  if (receita.isError)
    return (
      <ErroCarregar texto={textos.erro} tentar={textos.tentar} aoTentar={() => receita.refetch()} />
    )
  const r = receita.data
  if (!r)
    return (
      <section className="flex flex-col gap-4">
        {voltar}
        <Vazio>{t.naoEncontrada}</Vazio>
      </section>
    )
  return (
    <article className="flex flex-col gap-5 lg:gap-6">
      {voltar}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
        <div className="flex flex-col gap-5">
          {r.foto && (
            <img
              src={r.foto}
              alt={t.fotoDe(r.nome)}
              className="aspect-[16/9] w-full rounded-[22px] object-cover shadow-cartao"
            />
          )}
          <Cabecalho r={r} />
          <Cartao className="flex flex-col gap-2">
            <h2 className="text-[17px] font-bold text-verde-escuro">{t.preparo}</h2>
            <div
              className="texto-rico preparo-numerado flex flex-col gap-2 text-[15px] leading-relaxed"
              dangerouslySetInnerHTML={{ __html: sanitizarHtml(r.preparo) }}
            />
          </Cartao>
        </div>
        <Lateral r={r} />
      </div>
    </article>
  )
}
