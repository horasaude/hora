import { useState } from 'react'
import { salvarRotina, type Rotina } from '../api/treinos.api'
import { t } from '../textos'
import { useAcaoTreinos } from './useTreinosPainel'

export type DadosRotina = {
  nome: string
  tema_id: string
  nivel: string
  local: string
  descricao: string
  dias: Record<number, string>
}

/** Estado da janela do modelo e o salvar (rascunho ou publicado). */
export function useRotinaForm(
  rotina: Rotina | undefined,
  temaPadrao: string,
  aoFechar: () => void,
) {
  const salvar = useAcaoTreinos(salvarRotina)
  const [erro, setErro] = useState('')
  const [d, setD] = useState<DadosRotina>({
    nome: rotina?.nome ?? '',
    tema_id: rotina?.tema_id ?? temaPadrao,
    nivel: rotina?.nivel ?? 'iniciante',
    local: rotina?.local ?? 'casa',
    descricao: rotina?.descricao ?? '',
    dias: Object.fromEntries((rotina?.dias ?? []).map((x) => [x.dia_semana, x.treino_id])),
  })
  const mudar = (x: Partial<DadosRotina>) => setD((a) => ({ ...a, ...x }))
  const gravar = async (publicado: boolean) => {
    const dias = Object.entries(d.dias)
      .filter(([, id]) => id)
      .map(([dia, treino_id]) => ({ dia_semana: Number(dia), treino_id }))
    if (d.nome.trim().length < 2) return setErro(t.erros.nome)
    if (!d.tema_id) return setErro(t.erros.tema)
    if (dias.length === 0) return setErro(t.erros.semDias)
    const { dias: _d, ...campos } = d
    try {
      await salvar.mutateAsync({
        rotina: { ...campos, nome: d.nome.trim(), id: rotina?.id, publicado },
        dias,
      })
      aoFechar()
    } catch {
      setErro(t.erros.salvar)
    }
  }
  return { d, mudar, gravar, erro, salvando: salvar.isPending }
}
