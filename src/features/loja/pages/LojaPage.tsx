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
      className={`min-h-9 rounded-full px-4 text-[13px] font-bold transition ${valor === c ? 'brilho brilho-verde' : 'brilho brilho-cinza'}`}
    >
      {nome}
    </button>
  )
  return (
    <div className="flex flex-wrap gap-2">
      {botao('', t.todas)}
      {ativas.map((c) => botao(c, CATEGORIAS_LOJA[c]))}
    </div>
  )
}

/** Vitrine da aluna: faixa do parceiro, filtro por categoria e a grade (3 no computador, 2 no celular). */
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
            <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 lg:gap-6">
              {visiveis.map((p) => (
                <li key={p.id}>
                  <CartaoProduto p={p} />
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </section>
  )
}
