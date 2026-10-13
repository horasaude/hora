import { useCallback, useRef, useState } from 'react'
import { useConcluida, useMarcarConcluida, useRegras } from './useTrilha'

/** Conclusão da aula, pelo botão ou pelo vídeo: pede uma vez só e mostra os pontos ganhos. */
export function useConclusao(id: string) {
  const concluida = useConcluida(id)
  const marcar = useMarcarConcluida(id)
  const regras = useRegras()
  const [ganho, setGanho] = useState({ pontos: 0, chave: 0 })
  const pedido = useRef(false)
  const pontos = regras.data?.find((r) => r.acao === 'aula_concluida')?.pontos ?? 0
  const feita = Boolean(concluida.data)
  const concluir = useCallback(() => {
    if (feita || pedido.current) return
    pedido.current = true
    marcar.mutate(true, {
      onSuccess: () => setGanho({ pontos, chave: Date.now() }),
      onError: () => {
        pedido.current = false
      },
    })
  }, [feita, marcar, pontos])
  return {
    concluida: feita,
    carregando: concluida.isPending,
    ocupado: marcar.isPending,
    erro: marcar.isError,
    concluir,
    ganho,
  }
}

export type Conclusao = ReturnType<typeof useConclusao>
