import { usePreviaTreinos } from '../previa'

/** Volta só para dentro do app (nunca para outro site). */
const dentroDoApp = (v: string | null): v is string =>
  Boolean(v?.startsWith('/app/') && !v.startsWith('//'))

/** Busca do endereço atual sem o passo da execução e sem a volta. */
function buscaAtual(): string {
  const busca = new URLSearchParams(window.location.search)
  busca.delete('passo')
  busca.delete('volta')
  const s = busca.toString()
  return s ? `?${s}` : ''
}

/** Endereço do treino em execução. A aluna leva de onde veio (?volta=); a prévia leva a própria busca. */
export function useLinkTreino() {
  const previa = Boolean(usePreviaTreinos())
  return (id: string) =>
    previa
      ? `/app/previa/treinos/${id}${buscaAtual()}`
      : `/app/treinos/${id}?volta=${encodeURIComponent(window.location.pathname + buscaAtual())}`
}

/** Volta da execução para onde ela estava (tema, tipo de treino ou a página de Treinos). */
export function useVoltarTreinos() {
  const previa = Boolean(usePreviaTreinos())
  if (previa) return `/app/previa/treinos${buscaAtual()}`
  const volta = new URLSearchParams(window.location.search).get('volta')
  return dentroDoApp(volta) ? volta : '/app/treinos'
}
