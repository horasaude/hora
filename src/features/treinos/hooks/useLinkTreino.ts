import { usePreviaTreinos } from '../previa'

/** Busca do endereço atual sem o passo da execução; para a aluna, só o tipo de treino aberto. */
function busca(previa: boolean): string {
  const atual = new URLSearchParams(window.location.search)
  atual.delete('passo')
  const tipo = atual.get('tipo')
  const b = previa ? atual : new URLSearchParams(tipo ? { tipo } : {})
  const s = b.toString()
  return s ? `?${s}` : ''
}

/** Endereço do treino em execução (na pré-visualização, dentro dela), levando o tipo aberto. */
export function useLinkTreino() {
  const previa = Boolean(usePreviaTreinos())
  return (id: string) => `${previa ? '/app/previa/treinos' : '/app/treinos'}/${id}${busca(previa)}`
}

/** Volta da execução para os treinos, no mesmo tipo de treino. */
export function useVoltarTreinos() {
  const previa = Boolean(usePreviaTreinos())
  return `${previa ? '/app/previa/treinos' : '/app/treinos'}${busca(previa)}`
}
