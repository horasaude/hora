import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { buscarProximaLive } from '../api/inicio.api'

export function useProximaLive() {
  const [agora] = useState(() => new Date())
  return useQuery({ queryKey: ['proxima-live'], queryFn: () => buscarProximaLive(agora) })
}
