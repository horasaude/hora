import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  desinscreverAparelho,
  inscreverAparelho,
  inscricaoAtual,
  precisaInstalarNoIphone,
  suportaPush,
} from '@/lib/push'
import { removerInscricao, salvarInscricao } from '../api/checkin.api'

/** Lembrete de água neste aparelho: se está ligado, ligar (pede permissão) e desligar. */
export function useLembreteAgua() {
  const cliente = useQueryClient()
  const atual = useQuery({ queryKey: ['lembrete-agua'], queryFn: inscricaoAtual })
  const atualizar = () => cliente.invalidateQueries({ queryKey: ['lembrete-agua'] })
  const ligar = useMutation({
    mutationFn: async () => {
      const i = await inscreverAparelho()
      if (!i) throw new Error('sem permissão')
      await salvarInscricao(i)
    },
    onSettled: atualizar,
  })
  const desligar = useMutation({
    mutationFn: async () => {
      const endpoint = await desinscreverAparelho()
      if (endpoint) await removerInscricao(endpoint)
    },
    onSettled: atualizar,
  })
  return {
    suporta: suportaPush(),
    instalar: suportaPush() && precisaInstalarNoIphone(),
    ligado: Boolean(atual.data),
    ligar,
    desligar,
  }
}
