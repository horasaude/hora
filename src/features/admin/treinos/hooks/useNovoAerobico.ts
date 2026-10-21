import { salvarTreino } from '../api/treinos.api'
import { t } from '../textos'
import { useAcaoTreinos } from './useTreinosPainel'

export type DadosAerobico = {
  exercicio: { id: string; nome: string }
  minutos: number
  intensidade: string
  observacao: string
}

type Base = { tema_id: string; nivel: string; local: string }

/** Cria o treino aeróbico (uma modalidade, duração e intensidade) no tema, nível e local do tipo de treino. */
export function useNovoAerobico(base: Base) {
  const salvar = useAcaoTreinos(salvarTreino)
  const criar = (d: DadosAerobico) =>
    salvar.mutateAsync({
      treino: {
        ...base,
        nome: t.aerobicos.nome(d.exercicio.nome, d.minutos),
        categoria: 'aerobico',
        duracao_minutos: d.minutos,
        publicado: true,
      },
      itens: [
        {
          chave: crypto.randomUUID(),
          nome: d.exercicio.nome,
          alternativo_nome: '',
          exercicio_id: d.exercicio.id,
          series: 1,
          repeticoes: `${d.minutos} min`,
          carga: d.intensidade,
          descanso_segundos: 0,
          observacao: d.observacao.trim(),
          series_detalhe: [],
          alternativo_id: null,
          combinado: null,
        },
      ],
    })
  return { criar, criando: salvar.isPending }
}
