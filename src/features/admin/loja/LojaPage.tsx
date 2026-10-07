import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { BotaoBrilho } from '@/components/ui'
import { Quadro } from '../components/Quadro'
import type { Parceiro, Produto } from './api/loja.api'
import { AbaParceiros } from './components/AbaParceiros'
import { AbaProdutos } from './components/AbaProdutos'
import { ParceiroJanela } from './components/ParceiroJanela'
import { ProdutoJanela } from './components/ProdutoJanela'
import { useResumoLoja } from './hooks/useLoja'
import { t } from './textos'

const ABAS = ['produtos', 'parceiros'] as const
type Aberta = { tipo: 'produto'; p: Produto | null } | { tipo: 'parceiro'; p: Parceiro | null }

/** Loja no painel: resumo, abas Produtos e Parceiros, criar e editar em janela grande. */
export function LojaPage() {
  const [busca, setBusca] = useSearchParams()
  const aba = ABAS.find((a) => a === busca.get('aba')) ?? 'produtos'
  const r = useResumoLoja().data
  const [aberta, setAberta] = useState<Aberta | null>(null)
  const criar = () =>
    setAberta(aba === 'produtos' ? { tipo: 'produto', p: null } : { tipo: 'parceiro', p: null })
  const n = (v?: number) => (v === undefined ? '-' : v.toLocaleString('pt-BR'))
  return (
    <Quadro
      titulo={t.titulo}
      acao={
        <BotaoBrilho tom="dourado" onClick={criar}>
          {aba === 'produtos' ? t.novoProduto : t.novoParceiro}
        </BotaoBrilho>
      }
      numeros={[
        { valor: n(r?.publicados), rotulo: t.cartoes.publicados, tom: 'salvia' },
        { valor: n(r?.parceiros_ativos), rotulo: t.cartoes.parceiros, tom: 'salvia' },
        { valor: n(r?.cliques_mes), rotulo: t.cartoes.cliques, tom: 'ocre' },
        {
          valor: r ? n(r.mais_clicado_cliques) : '-',
          rotulo: t.cartoes.maisClicado(r?.mais_clicado ?? null),
          tom: 'terracota',
        },
      ]}
    >
      <div role="tablist" aria-label={t.titulo} className="flex flex-wrap gap-1.5">
        {ABAS.map((a) => (
          <button
            key={a}
            type="button"
            role="tab"
            aria-selected={aba === a}
            onClick={() => setBusca({ aba: a }, { replace: true })}
            className={`min-h-9 rounded-full px-4 text-[13px] font-bold ${aba === a ? 'brilho brilho-verde' : 'border border-[#ECEFED] bg-white text-suave hover:bg-trilho'}`}
          >
            {t.abas[a]}
          </button>
        ))}
      </div>
      {aba === 'produtos' ? (
        <AbaProdutos criar={criar} editar={(p) => setAberta({ tipo: 'produto', p })} />
      ) : (
        <AbaParceiros criar={criar} editar={(p) => setAberta({ tipo: 'parceiro', p })} />
      )}
      {aberta?.tipo === 'produto' && (
        <ProdutoJanela p={aberta.p} aoFechar={() => setAberta(null)} />
      )}
      {aberta?.tipo === 'parceiro' && (
        <ParceiroJanela p={aberta.p} aoFechar={() => setAberta(null)} />
      )}
    </Quadro>
  )
}
