import { useEffect } from 'react'
import { RotaProtegida } from '@/features/auth'
import { registrarPwa } from '@/lib/pwa'

/** Raiz de /app: exige sessão, registra o service worker (escopo /app/) e aplica a fonte do sistema (Arial). */
export function AreaAluna() {
  useEffect(() => {
    registrarPwa()
  }, [])
  return (
    <div className="font-sistema text-base leading-relaxed">
      <RotaProtegida />
    </div>
  )
}
