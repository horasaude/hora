import type { ReactNode } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import type { TabelaConteudo } from '../api/conteudo.api'
import type { ItemDoTema } from '../api/doTema.api'
import { excluirDoTema, podeExcluir } from '../api/excluirDoTema.api'
import { useAcoes } from '../hooks/usePainel'
import { doTema as t } from '../textos/doTema'
import { ExcluirLinha } from './ExcluirLinha'
import { BotaoSituacao } from './Linha'

type Props = {
  lista: ItemDoTema[]
  tabela: TabelaConteudo
  abrir: (i: ItemDoTema) => ReactNode
}

/** Itens do tema: o nome abre o editor, a chave publica ou tira do ar e Excluir apaga, como nas aulas. */
export function ItensDoTema({ lista, tabela, abrir }: Props) {
  const { publicar } = useAcoes()
  const cliente = useQueryClient()
  if (lista.length === 0) return <p className="text-sm text-suave">{t.vazio}</p>
  const excluir = async (id: string) => {
    await excluirDoTema(tabela, id)
    await cliente.invalidateQueries()
  }
  return (
    <ul className="flex flex-col divide-y divide-linha">
      {lista.map((i) => (
        <li key={i.id} className="flex flex-wrap items-center gap-2 py-2 text-sm">
          <span className="min-w-0 flex-1">{abrir(i)}</span>
          {i.detalhe && <span className="text-xs text-suave">{i.detalhe}</span>}
          <BotaoSituacao
            publicado={i.publicado}
            ocupado={publicar.isPending}
            aoPublicar={() => publicar.mutate({ tabela, id: i.id, publicado: !i.publicado })}
          />
          {podeExcluir(tabela) && <ExcluirLinha aoExcluir={() => excluir(i.id)} />}
        </li>
      ))}
    </ul>
  )
}
