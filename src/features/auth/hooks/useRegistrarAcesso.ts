import { useEffect } from 'react'
import { registrarAcesso } from '../api/auth.api'

/** Registra o último acesso uma vez ao abrir a área da aluna. */
export function useRegistrarAcesso() {
  useEffect(() => {
    void registrarAcesso().catch(() => undefined)
  }, [])
}
