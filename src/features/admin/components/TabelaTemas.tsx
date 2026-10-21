import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { iniciosDosTemas } from '@/domain/liberacao'
import { ordenarTemas, type Tema } from '../api/conteudo.api'
import { useAcoes } from '../hooks/usePainel'
import { textos } from '../textos'
import { liberacao as tl } from '../textos/liberacao'
import { EtiquetaLiberacao } from './CampoLiberacao'
import { Ordem } from './Ordem'
import { CelulaAcao, LinhaTabela, Situacao, Tabela } from './Tabela'

/** Lista com o item arrastado movido para a posição de outro. */
function moverPara(ids: string[], de: string, para: string): string[] {
  const sem = ids.filter((id) => id !== de)
  sem.splice(ids.indexOf(para), 0, de)
  return sem
}

/** Arrastar e soltar no computador; enquanto arrasta, a lista já mostra a nova ordem. */
function useArrastar(temas: Tema[]) {
  const cliente = useQueryClient()
  const salvar = useMutation({
    mutationFn: ordenarTemas,
    onSettled: () => cliente.invalidateQueries(),
  })
  const [arrastando, setArrastando] = useState<string | null>(null)
  const [previa, setPrevia] = useState<string[] | null>(null)
  const ids = temas.map((t) => t.id)
  const ordem = previa ?? ids
  const soltar = () => {
    if (previa && previa.join() !== ids.join()) salvar.mutate(previa)
    setArrastando(null)
    setPrevia(null)
  }
  const linha = (id: string) => ({
    draggable: !salvar.isPending,
    onDragStart: (e: React.DragEvent) => {
      e.dataTransfer.effectAllowed = 'move'
      setArrastando(id)
    },
    onDragOver: (e: React.DragEvent) => {
      e.preventDefault()
      if (arrastando && arrastando !== id) setPrevia(moverPara(ordem, arrastando, id))
    },
    onDrop: (e: React.DragEvent) => {
      e.preventDefault()
      soltar()
    },
    onDragEnd: soltar,
    className: arrastando === id ? 'opacity-50' : 'cursor-grab',
    title: tl.arrastar,
  })
  const lista = ordem.map((id) => temas.find((t) => t.id === id)).filter((t) => t !== undefined)
  return { lista, linha, ocupado: salvar.isPending, erro: salvar.isError }
}

/** Temas em tabela: abrir à direita, arrastar ou usar as setas para mudar a ordem e ver a situação. */
export function TabelaTemas({ temas, ativo }: { temas: Tema[]; ativo?: string }) {
  const { ordenar } = useAcoes()
  const arrastar = useArrastar(temas)
  const ocupado = ordenar.isPending || arrastar.ocupado
  const inicios = iniciosDosTemas(arrastar.lista)
  return (
    <>
      {arrastar.erro && (
        <p role="alert" className="text-sm text-terracota-escuro">
          {tl.erroOrdem}
        </p>
      )}
      <Tabela colunas={[textos.temas.coluna, tl.abre, textos.ordem, textos.status]}>
        {arrastar.lista.map((tema, i, lista) => (
          <LinhaTabela
            key={tema.id}
            ativa={tema.id === ativo}
            para={`/app/admin/conteudo/${tema.id}`}
            titulo={tema.titulo}
            linha={arrastar.linha(tema.id)}
          >
            <td className="px-3.5 py-3 whitespace-nowrap text-tinta">
              {inicios[tema.id] ? tl.diaEDuracao(inicios[tema.id] ?? 1, tema.dias_liberado) : '-'}
            </td>
            <CelulaAcao>
              <Ordem
                titulo={tema.titulo}
                ocupado={ocupado}
                aoSubir={
                  i > 0
                    ? () => ordenar.mutate({ tipo: 'tema', id: tema.id, direcao: -1 })
                    : undefined
                }
                aoDescer={
                  i < lista.length - 1
                    ? () => ordenar.mutate({ tipo: 'tema', id: tema.id, direcao: 1 })
                    : undefined
                }
              />
            </CelulaAcao>
            <td className="px-3.5 py-3">
              <span className="flex flex-wrap gap-1.5">
                <Situacao publicado={tema.publicado} />
                <EtiquetaLiberacao l={tema} />
              </span>
            </td>
          </LinhaTabela>
        ))}
      </Tabela>
    </>
  )
}
