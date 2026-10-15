import { useState } from 'react'
import { seriesDoItem, type Serie } from '@/domain/series'
import { MenuAcoes, type Acao } from '../../plano/components/MenuAcoes'
import type { Exercicio, ItemTreino } from '../api/treinos.api'
import { t } from '../textos'
import { Texto } from './CamposItem'
import { EscolherExercicios } from './EscolherExercicios'
import { CamposSimples, Modo, SeriesDetalhe } from './SeriesDetalhe'

type Props = {
  item: ItemTreino
  i: number
  trocar: (campos: Partial<ItemTreino>) => void
  duplicar: () => void
  remover: () => void
}

/** Série por série: a primeira também vai para os campos simples (a aluna antiga lê deles). */
const comDetalhe = (series: Serie[]): Partial<ItemTreino> => ({
  series_detalhe: series,
  series: series.length,
  repeticoes: series[0]?.repeticoes ?? '12',
  carga: series[0]?.carga ?? '',
  descanso_segundos: series[0]?.descanso_segundos ?? 60,
})

function Cabecalho({ item, i, acoes }: { item: ItemTreino; i: number; acoes: Acao[] }) {
  return (
    <div className="flex items-center gap-2">
      <span
        aria-label={t.itens.arrastar}
        title={t.itens.arrastar}
        className="cursor-grab text-suave"
      >
        ⋮⋮
      </span>
      <span className="flex-1 text-sm font-bold text-tinta">
        {i + 1}. {item.nome}
        {item.alternativo_nome && (
          <span className="block text-[11px] font-normal text-suave">
            {t.itens.alternativoNome(item.alternativo_nome)}
          </span>
        )}
      </span>
      <MenuAcoes nome={item.nome} acoes={acoes} />
    </div>
  )
}

type Escolha = 'trocar' | 'alternativo' | null

/** Um exercício do treino: cabeçalho com ações, séries (simples ou série por série) e observação. */
export function ItemDoTreino({ item, i, trocar, duplicar, remover }: Props) {
  const [escolha, setEscolha] = useState<Escolha>(null)
  const series = seriesDoItem(item)
  const detalhado = Array.isArray(item.series_detalhe) && item.series_detalhe.length > 0
  const escolher = ([e]: Exercicio[]) => {
    if (e && escolha === 'trocar') trocar({ exercicio_id: e.id, nome: e.nome })
    if (e && escolha === 'alternativo') trocar({ alternativo_id: e.id, alternativo_nome: e.nome })
    setEscolha(null)
  }
  const acoes = [
    { nome: t.duplicarCurto, aoEscolher: duplicar },
    { nome: t.itens.trocar, aoEscolher: () => setEscolha('trocar') },
    { nome: t.itens.alternativo, aoEscolher: () => setEscolha('alternativo') },
    ...(item.alternativo_id
      ? [
          {
            nome: t.itens.tirarAlternativo,
            aoEscolher: () => trocar({ alternativo_id: null, alternativo_nome: '' }),
          },
        ]
      : []),
    { nome: t.remover, perigo: true, aoEscolher: remover },
  ]
  return (
    <div className="flex flex-col gap-2">
      <Cabecalho item={item} i={i} acoes={acoes} />
      {escolha && (
        <EscolherExercicios
          titulo={
            escolha === 'trocar' ? t.itens.trocarPor(item.nome) : t.itens.alternativoDe(item.nome)
          }
          multiplo={false}
          aoConfirmar={escolher}
          aoFechar={() => setEscolha(null)}
        />
      )}
      <Modo
        detalhado={detalhado}
        aoMudar={(d) =>
          trocar(d ? comDetalhe(series) : { ...comDetalhe(series), series_detalhe: [] })
        }
      />
      {detalhado ? (
        <SeriesDetalhe series={series} mudar={(s) => trocar(comDetalhe(s))} />
      ) : (
        <CamposSimples item={item} trocar={trocar} />
      )}
      <Texto
        rotulo={t.itens.observacao}
        valor={item.observacao}
        max={300}
        aoMudar={(observacao) => trocar({ observacao })}
      />
    </div>
  )
}
