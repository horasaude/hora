import { useState } from 'react'
import { BotaoBrilho } from '@/components/ui'
import { CATEGORIAS, ehCategoria, type Categoria } from '@/domain/forum'
import { Conteudo } from '../components/Conteudo'
import { CartaoDuvida } from '../components/Duvida'
import { EnviarDuvida } from '../components/EnviarDuvida'
import { RegrasJanela } from '../components/RegrasJanela'
import { useDuvidas } from '../hooks/useForum'
import { textos as t } from '../textos'

const campo = 'min-h-11 rounded-full border border-linha bg-white px-4 text-sm'

function Filtros({
  busca,
  setBusca,
  cat,
  setCat,
  minhas,
  setMinhas,
}: {
  busca: string
  setBusca: (v: string) => void
  cat: Categoria | ''
  setCat: (v: Categoria | '') => void
  minhas: boolean
  setMinhas: (v: boolean) => void
}) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
      <input
        type="search"
        aria-label={t.buscar}
        placeholder={t.buscar}
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        className={`${campo} sm:w-72`}
      />
      <select
        aria-label={t.campoCategoria}
        value={cat}
        onChange={(e) => setCat(ehCategoria(e.target.value) ? e.target.value : '')}
        className={campo}
      >
        <option value="">{t.todas}</option>
        {Object.entries(CATEGORIAS).map(([v, n]) => (
          <option key={v} value={v}>
            {n}
          </option>
        ))}
      </select>
      <button
        type="button"
        aria-pressed={minhas}
        onClick={() => setMinhas(!minhas)}
        className={`min-h-11 rounded-full px-4 text-[13px] font-bold ${minhas ? 'brilho brilho-verde' : 'border border-linha bg-white text-suave'}`}
      >
        {t.minhas}
      </button>
    </div>
  )
}

/** Fórum geral da aluna: busca, categoria, Minhas dúvidas e os cartões. */
export function ForumPage() {
  const [busca, setBusca] = useState('')
  const [cat, setCat] = useState<Categoria | ''>('')
  const [minhas, setMinhas] = useState(false)
  const [limite, setLimite] = useState(30)
  const lista = useDuvidas({ busca, categoria: cat, minhas, limite })
  return (
    <section className="flex flex-col gap-5 lg:gap-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-[28px] leading-tight font-bold text-verde-escuro lg:text-[30px]">
          {t.titulo}
        </h1>
        <div className="flex flex-col items-start gap-1 sm:items-end">
          <EnviarDuvida />
          <p className="text-xs text-suave">{t.prazo}</p>
        </div>
      </header>
      <Filtros {...{ busca, setBusca, cat, setCat, minhas, setMinhas }} />
      <Conteudo consulta={lista} itens={lista.data} vazio={t.vazio}>
        {(itens) => (
          <>
            <ul className="grid gap-4 lg:grid-cols-2">
              {itens.map((d) => (
                <li key={d.id}>
                  <CartaoDuvida d={d} />
                </li>
              ))}
            </ul>
            {itens.length >= limite && (
              <BotaoBrilho
                tom="cinza"
                className="self-center"
                onClick={() => setLimite(limite + 30)}
              >
                {t.verMais}
              </BotaoBrilho>
            )}
          </>
        )}
      </Conteudo>
      <RegrasJanela />
    </section>
  )
}
