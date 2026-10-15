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
  tipo: 'semana' | 'numerico'
  objetivo: string
  orientacoes: string
  dias: Record<number, string>
  sequencia: string[]
}

const inicial = (r: Rotina | undefined, temaPadrao: string): DadosRotina => ({
  nome: r?.nome ?? '',
  tema_id: r?.tema_id ?? temaPadrao,
  nivel: r?.nivel ?? 'iniciante',
  local: r?.local ?? 'casa',
  descricao: r?.descricao ?? '',
  tipo: r?.tipo === 'numerico' ? 'numerico' : 'semana',
  objetivo: r?.objetivo ?? '',
  orientacoes: r?.orientacoes ?? '',
  dias: Object.fromEntries(
    (r?.dias ?? []).flatMap((x) => (x.dia_semana === null ? [] : [[x.dia_semana, x.treino_id]])),
  ),
  sequencia: (r?.dias ?? [])
    .filter((x) => x.ordem !== null)
    .sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0))
    .map((x) => x.treino_id),
})

/** Treinos da rotina no formato do banco: dia da semana ou a ordem (Treino 1, 2, 3). */
function diasParaSalvar(d: DadosRotina) {
  if (d.tipo === 'numerico')
    return d.sequencia
      .filter(Boolean)
      .map((treino_id) => ({ treino_id, dia_semana: null, ordem: null }))
  return Object.entries(d.dias)
    .filter(([, id]) => id)
    .map(([dia, treino_id]) => ({ dia_semana: Number(dia), treino_id, ordem: null }))
}

/** Estado da janela do modelo e o salvar (rascunho ou publicado). */
export function useRotinaForm(
  rotina: Rotina | undefined,
  temaPadrao: string,
  aoFechar: () => void,
) {
  const salvar = useAcaoTreinos(salvarRotina)
  const [erro, setErro] = useState('')
  const [d, setD] = useState<DadosRotina>(() => inicial(rotina, temaPadrao))
  const mudar = (x: Partial<DadosRotina>) => setD((a) => ({ ...a, ...x }))
  const gravar = async (publicado: boolean) => {
    const dias = diasParaSalvar(d)
    if (d.nome.trim().length < 2) return setErro(t.erros.nome)
    if (!d.tema_id) return setErro(t.erros.tema)
    if (dias.length === 0)
      return setErro(d.tipo === 'numerico' ? t.erros.semSequencia : t.erros.semDias)
    const { dias: _d, sequencia: _s, ...campos } = d
    try {
      await salvar.mutateAsync({
        rotina: {
          ...campos,
          objetivo: d.objetivo || null,
          nome: d.nome.trim(),
          id: rotina?.id,
          publicado,
        },
        dias,
      })
      aoFechar()
    } catch {
      setErro(t.erros.salvar)
    }
  }
  return { d, mudar, gravar, erro, salvando: salvar.isPending }
}
