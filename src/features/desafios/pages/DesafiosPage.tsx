import { useState } from 'react'
import { Abas, Carregando, ErroCarregar, Vazio } from '@/components/ui'
import { useDesafios } from '../hooks/useDesafios'
import { CartaoDesafio } from '../components/CartaoDesafio'
import { CartaoEncerrado } from '../components/CartaoEncerrado'
import { textos } from '../textos'

type Aba = 'mes' | 'encerrados'
const ABAS = [
  { id: 'mes', nome: textos.abas.mes },
  { id: 'encerrados', nome: textos.abas.encerrados },
] as const

/** Desafios do mês em cartões e, na outra aba, os encerrados de que ela participou. */
export function DesafiosPage() {
  const [aba, setAba] = useState<Aba>('mes')
  const desafios = useDesafios()
  const todos = desafios.data ?? []
  const lista =
    aba === 'mes'
      ? todos.filter((d) => !d.encerrado)
      : todos.filter((d) => d.encerrado && d.participando)
  return (
    <section className="flex flex-col gap-5 lg:gap-6">
      <h1 className="text-[28px] leading-tight font-bold text-verde-escuro lg:text-[30px]">
        {textos.titulo}
      </h1>
      <Abas opcoes={ABAS} ativa={aba} aoEscolher={setAba} rotulo={textos.abasRotulo} />
      {desafios.isPending ? (
        <Carregando texto={textos.carregando} />
      ) : desafios.isError ? (
        <ErroCarregar
          texto={textos.erro}
          tentar={textos.tentar}
          aoTentar={() => desafios.refetch()}
        />
      ) : lista.length === 0 ? (
        <Vazio>{aba === 'mes' ? textos.vazio : textos.vazioEncerrados}</Vazio>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {lista.map((d) => (
            <li key={d.id}>
              {aba === 'mes' ? <CartaoDesafio d={d} /> : <CartaoEncerrado d={d} />}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
