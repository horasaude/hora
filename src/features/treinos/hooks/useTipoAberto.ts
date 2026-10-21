import { useSearchParams } from 'react-router-dom'

/** Tipo de treino aberto fica no endereço (?tipo=), para voltar da execução no mesmo lugar. */
export function useTipoAberto() {
  const [busca, setBusca] = useSearchParams()
  const abrir = (id: string | null) =>
    setBusca((atual) => {
      const nova = new URLSearchParams(atual)
      if (id) nova.set('tipo', id)
      else nova.delete('tipo')
      return nova
    })
  return { id: busca.get('tipo'), abrir }
}
