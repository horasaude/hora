import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apagarMedida, buscarMedidas, registrarMedida, type NovaMedida } from '../api/medidas.api'

export const useMedidas = () => useQuery({ queryKey: ['medidas'], queryFn: buscarMedidas })

export function useRegistrarMedida() {
  const cliente = useQueryClient()
  return useMutation({
    mutationFn: (d: NovaMedida) => registrarMedida(d),
    onSuccess: () => {
      cliente.invalidateQueries({ queryKey: ['medidas'] })
      cliente.invalidateQueries({ queryKey: ['comece-aqui'] })
    },
  })
}

export function useApagarMedida() {
  const cliente = useQueryClient()
  return useMutation({
    mutationFn: apagarMedida,
    onSuccess: () => cliente.invalidateQueries({ queryKey: ['medidas'] }),
  })
}
