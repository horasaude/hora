import { useState } from 'react'
import type { Exercicio } from '../api/treinos.api'
import { t } from '../textos'
import { EscolherExercicios } from './EscolherExercicios'

/** "Adicionar exercício": abre a biblioteca e devolve todos os escolhidos de uma vez. */
export function AdicionarExercicio({ aoEscolher }: { aoEscolher: (lista: Exercicio[]) => void }) {
  const [aberto, setAberto] = useState(false)
  if (!aberto)
    return (
      <button
        type="button"
        onClick={() => setAberto(true)}
        className="brilho brilho-coral inline-flex min-h-9 items-center self-start rounded-full px-4 text-[13px] font-bold"
      >
        + {t.itens.adicionar}
      </button>
    )
  return (
    <EscolherExercicios
      titulo={t.itens.adicionar}
      multiplo
      aoConfirmar={(lista) => {
        aoEscolher(lista)
        setAberto(false)
      }}
      aoFechar={() => setAberto(false)}
    />
  )
}
