import { useQuery } from '@tanstack/react-query'
import { sanitizarHtml } from '@/lib/html'
import { linkFoto } from '../api/receitas.api'
import { textos } from '../textos'
import { tReceitas as t } from '../textos2'

type Props = {
  nome: string
  foto: string | null
  porcoes: number
  ingredientes: string
  preparo: string
  kcal?: number
}

/** Como a aluna vê a receita: foto, rendimento, ingredientes e modo de preparo. */
export function ReceitaVisual({ nome, foto, porcoes, ingredientes, preparo, kcal }: Props) {
  const url = useQuery({
    queryKey: ['foto', foto],
    queryFn: () => linkFoto(foto ?? ''),
    enabled: Boolean(foto),
  })
  return (
    <article className="flex flex-col gap-4 text-[15px] leading-relaxed">
      {url.data && (
        <img src={url.data} alt="" className="aspect-[16/9] w-full rounded-2xl object-cover" />
      )}
      <h3 className="text-[22px] font-bold text-verde-escuro">{nome}</h3>
      <p className="text-[13px] text-suave">
        {t.porcoes}: {porcoes}
        {kcal !== undefined && ` · ${t.porPorcao}: ${textos.kcal(kcal)}`}
      </p>
      <section>
        <h4 className="font-bold text-verde-escuro">{t.ingredientes}</h4>
        <div
          className="texto-rico"
          dangerouslySetInnerHTML={{ __html: sanitizarHtml(ingredientes) }}
        />
      </section>
      <section>
        <h4 className="font-bold text-verde-escuro">{t.preparo}</h4>
        <div className="texto-rico" dangerouslySetInnerHTML={{ __html: sanitizarHtml(preparo) }} />
      </section>
    </article>
  )
}
