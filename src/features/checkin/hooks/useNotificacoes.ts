import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { inscricaoAtual } from '@/lib/push'
import { preferenciasPush, salvarPreferenciasPush, type PreferenciasPush } from '../api/checkin.api'

/** Preferências deste aparelho: lembrete de água e lembrete da live. */
export function usePreferenciasPush() {
  const cliente = useQueryClient()
  const q = useQuery({
    queryKey: ['lembrete-agua', 'preferencias'],
    queryFn: async () => {
      const i = await inscricaoAtual()
      return i ? { endpoint: i.endpoint, ...(await preferenciasPush(i.endpoint)) } : null
    },
  })
  const salvar = useMutation({
    mutationFn: (campos: Partial<PreferenciasPush>) =>
      q.data ? salvarPreferenciasPush({ endpoint: q.data.endpoint, ...campos }) : Promise.resolve(),
    onSettled: () => cliente.invalidateQueries({ queryKey: ['lembrete-agua'] }),
  })
  return { prefs: q.data, salvar }
}
