import { useState } from 'react'
import { trazerTreinos } from '../../api/usarExistente.api'
import { salvarRotina, type DiaRotina, type Rotina } from '../api/treinos.api'
import { t } from '../textos'
import { useAcaoTreinos } from './useTreinosPainel'

/** Aeróbico do tipo de treino: num dia da semana ou, na rotina numérica, sem dia. */
export type AerobicoDaRotina = { dia: number | null; treino_id: string }

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
  aerobicos: AerobicoDaRotina[]
}

function inicial(r: Rotina | undefined, temaPadrao: string): DadosRotina {
  const lidos = r?.dias ?? []
  const musculacao = lidos.filter((x) => x.categoria !== 'aerobico')
  const numerica = r?.tipo === 'numerico'
  return {
    nome: r?.nome ?? '',
    tema_id: r?.tema_id ?? temaPadrao,
    nivel: r?.nivel ?? 'iniciante',
    local: r?.local ?? 'casa',
    descricao: r?.descricao ?? '',
    tipo: numerica ? 'numerico' : 'semana',
    objetivo: r?.objetivo ?? '',
    orientacoes: r?.orientacoes ?? '',
    dias: numerica
      ? {}
      : Object.fromEntries(
          musculacao.flatMap((x) => (x.dia_semana === null ? [] : [[x.dia_semana, x.treino_id]])),
        ),
    sequencia: numerica
      ? [...musculacao].sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0)).map((x) => x.treino_id)
      : [],
    aerobicos: lidos
      .filter((x) => x.categoria === 'aerobico')
      .map((x) => ({ dia: numerica ? null : x.dia_semana, treino_id: x.treino_id })),
  }
}

/** Treinos da rotina no formato do banco: musculação primeiro, depois os aeróbicos. */
function diasParaSalvar(d: DadosRotina): DiaRotina[] {
  const numerica = d.tipo === 'numerico'
  const musculacao = numerica
    ? d.sequencia.filter(Boolean).map((treino_id) => ({ treino_id, dia_semana: null }))
    : Object.entries(d.dias)
        .filter(([, id]) => id)
        .map(([dia, treino_id]) => ({ dia_semana: Number(dia), treino_id }))
  const vistos = new Set<string>()
  const aerobicos = d.aerobicos
    .filter((a) => numerica || a.dia !== null)
    .map((a) => ({ treino_id: a.treino_id, dia_semana: numerica ? null : a.dia }))
    .filter((a) => {
      const chave = `${a.dia_semana}-${a.treino_id}`
      return vistos.has(chave) ? false : Boolean(vistos.add(chave))
    })
  return [...musculacao, ...aerobicos].map((x) => ({ ...x, ordem: null }))
}

/** Estado da janela do tipo de treino e o salvar (rascunho ou publicado). */
export function useRotinaForm(
  rotina: Rotina | undefined,
  temaPadrao: string,
  aoFechar: () => void,
) {
  const salvar = useAcaoTreinos(async (x: Parameters<typeof salvarRotina>[0]) =>
    salvarRotina({ ...x, dias: await trazerTreinos(x.dias, x.rotina.tema_id) }),
  )
  const [erro, setErro] = useState('')
  const [d, setD] = useState<DadosRotina>(() => inicial(rotina, temaPadrao))
  const mudar = (x: Partial<DadosRotina>) => setD((a) => ({ ...a, ...x }))
  const gravar = async (publicado: boolean) => {
    const dias = diasParaSalvar(d)
    if (d.nome.trim().length < 2) return setErro(t.erros.nome)
    if (!d.tema_id) return setErro(t.erros.tema)
    if (dias.length === 0)
      return setErro(d.tipo === 'numerico' ? t.erros.semSequencia : t.erros.semDias)
    const { dias: _d, sequencia: _s, aerobicos: _a, ...campos } = d
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
