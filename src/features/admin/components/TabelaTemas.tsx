import type { Tema } from '../api/conteudo.api'
import { useAcoes } from '../hooks/usePainel'
import { textos } from '../textos'
import { Ordem } from './Ordem'
import { CelulaAcao, LinhaTabela, Situacao, Tabela } from './Tabela'

/** Temas em tabela: abrir à direita, mudar a ordem e ver a situação. */
export function TabelaTemas({ temas, ativo }: { temas: Tema[]; ativo?: string }) {
  const { ordenar } = useAcoes()
  return (
    <Tabela colunas={[textos.temas.coluna, textos.ordem, textos.status]}>
      {temas.map((tema, i) => (
        <LinhaTabela
          key={tema.id}
          ativa={tema.id === ativo}
          para={`/app/admin/conteudo/${tema.id}`}
          titulo={tema.titulo}
        >
          <CelulaAcao>
            <Ordem
              titulo={tema.titulo}
              ocupado={ordenar.isPending}
              aoSubir={
                i > 0 ? () => ordenar.mutate({ tipo: 'tema', id: tema.id, direcao: -1 }) : undefined
              }
              aoDescer={
                i < temas.length - 1
                  ? () => ordenar.mutate({ tipo: 'tema', id: tema.id, direcao: 1 })
                  : undefined
              }
            />
          </CelulaAcao>
          <td className="px-5 py-4">
            <Situacao publicado={tema.publicado} />
          </td>
        </LinhaTabela>
      ))}
    </Tabela>
  )
}
