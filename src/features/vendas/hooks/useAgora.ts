import { useEffect, useState } from 'react'

/** Hora atual, atualizada a cada segundo (contagem regressiva e troca de preço sem recarregar). */
export function useAgora(): Date {
  const [agora, setAgora] = useState(() => new Date())
  useEffect(() => {
    const id = window.setInterval(() => setAgora(new Date()), 1000)
    return () => window.clearInterval(id)
  }, [])
  return agora
}
