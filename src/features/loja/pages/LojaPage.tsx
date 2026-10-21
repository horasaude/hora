import { useState } from 'react'
import { CATEGORIAS_LOJA, type CategoriaLoja } from '@/domain/loja'
import type { ProdutoVitrine } from '../api/loja.api'
import { CartaoProduto } from '../components/CartaoProduto'
import { EstadoLoja } from '../components/Estado'
import { Faixa } from '../components/Faixa'
import { useVitrine } from '../hooks/useLoja'
import { textos as t } from '../textos'

function parceirosDe(lista: ProdutoVitrine[]) {
  const m = new Map<string, { id: string; nome: string; logo?: string }>()
  for (const p of lista)
    if (p.loja_parceiros)
      m.set(p.loja_parceiros.id, {
        id: p.loja_parceiros.id,
        nome: p.loja_parceiros.nome,
        logo: p.logo,
      })
  return [...m.values()]
}

function Filtro({
  ativas,
  valor,
  aoMudar,
}: {
  ativas: CategoriaLoja[]
  valor: CategoriaLoja | ''
  aoMudar: (c: CategoriaLoja | '') => void
}) {
  const botao = (c: CategoriaLoja | '', nome: string) => (
    <button
      key={c || 'todas'}
      type="button"
      aria-pressed={valor === c}
      onClick={() => aoMudar(c)}
      className={`min-h-9 shrink-0 rounded-full px-4 text-[13px] font-bold transition ${valor === c ? 'brilho brilho-verde' : 'brilho brilho-cinza'}`}
    >
      {nome}
    </button>
  )
  return (
    <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0">
      {botao('', t.todas)}
      {ativas.map((c) => botao(c, CATEGORIAS_LOJA[c]))}
    </div>
  )
}

/** Vitrine da aluna: faixa do parceiro, filtro que desliza no celular e a grade (2 no celular, 4 no computador). */
export function LojaPage() {
  const vitrine = useVitrine()
  const [cat, setCat] = useState<CategoriaLoja | ''>('')
  const lista = vitrine.data ?? []
  const ativas = (Object.keys(CATEGORIAS_LOJA) as CategoriaLoja[]).filter((c) =>
    lista.some((p) => p.categoria === c),
  )
  const visiveis = cat ? lista.filter((p) => p.categoria === cat) : lista
  return (
    <section className="flex flex-col gap-5 lg:gap-6">
      <h1 className="text-[28px] leading-tight font-bold text-verde-escuro lg:text-[30px]">
        {t.titulo}
      </h1>
      {vitrine.isPending ? (
        <EstadoLoja tipo="carregando" />
      ) : vitrine.isError ? (
        <EstadoLoja tipo="erro" tentar={() => vitrine.refetch()} />
      ) : lista.length === 0 ? (
        <EstadoLoja tipo="aviso" texto={t.semLoja} />
      ) : (
        <>
          <Faixa parceiros={parceirosDe(lista)} />
          <Filtro ativas={ativas} valor={cat} aoMudar={setCat} />
          {visiveis.length === 0 ? (
            <EstadoLoja tipo="aviso" texto={t.vazio} />
          ) : (
            <ul className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 lg:gap-5">
              {visiveis.map((p, i) => (
                <li key={p.id}>
                  <CartaoProduto p={p} indice={i} />
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </section>
  )
}
