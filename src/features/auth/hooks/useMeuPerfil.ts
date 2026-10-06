import { useQuery } from '@tanstack/react-query'
import { buscarMeuPerfil } from '../api/auth.api'

/** Perfil da usuária logada (chave ['meu-perfil']; invalide depois de editar). */
export function useMeuPerfil() {
  return useQuery({ queryKey: ['meu-perfil'], queryFn: buscarMeuPerfil, staleTime: 5 * 60_000 })
}
