import { useEffect } from 'react'
import { RotaProtegida } from '@/features/auth'
import { registrarPwa } from '@/lib/pwa'

/** Raiz de /app: exige sessão e registra o service worker (escopo /app/). */
export function AreaAluna() {
  useEffect(() => {
    registrarPwa()
  }, [])
  return <RotaProtegida />
}
