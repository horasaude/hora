import { usePreviaTreinos } from '../previa'

/** Endereço do treino em execução (na pré-visualização, dentro dela). */
export function useLinkTreino() {
  const previa = usePreviaTreinos()
  return (id: string) =>
    previa ? `/app/previa/treinos/${id}${window.location.search}` : `/app/treinos/${id}`
}
