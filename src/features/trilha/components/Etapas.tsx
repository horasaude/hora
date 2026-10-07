import { BarraProgresso, Cartao, IconeCadeado, Vazio } from '@/components/ui'
import {
  condicoesDaEtapa,
  DIAS_DA_ETAPA,
  etapaAnterior,
  faltamDias,
  type EtapaTrilha,
} from '@/domain/trilha'
import { textos } from '../textos'
import { ListaAulas } from './CartaoAula'

const t = textos.bloqueada

/** Abas Arrancada, Constância e Para Sempre; a fechada leva cadeado. */
export function AbasEtapas({
  etapas,
  ativa,
  aoEscolher,
}: {
  etapas: EtapaTrilha[]
  ativa: string
  aoEscolher: (id: string) => void
}) {
  return (
    <div
      role="tablist"
      aria-label={textos.abasRotulo}
      className="grid grid-cols-3 gap-2 sm:flex sm:flex-wrap"
    >
      {etapas.map((e) => {
        const ativo = e.id === ativa
        return (
          <button
            key={e.id}
            type="button"
            role="tab"
            aria-selected={ativo}
            onClick={() => aoEscolher(e.id)}
            className={`brilho ${ativo ? 'brilho-verde' : 'brilho-cinza'} inline-flex min-h-9 items-center justify-center gap-1.5 rounded-full px-4 text-[13px] font-bold`}
          >
            {!e.iniciada_em && <IconeCadeado className="size-3.5" />}
            {e.titulo}
          </button>
        )
      })}
    </div>
  )
}

/** Etapa fechada: as duas metas da etapa anterior, cada uma com sua barra. */
function Bloqueada({ etapa, anterior }: { etapa: EtapaTrilha; anterior: EtapaTrilha | null }) {
  const total = anterior?.aulas.length ?? 0
  const feitas = anterior?.aulas.filter((a) => a.concluida).length ?? 0
  const c = condicoesDaEtapa(total, feitas, anterior?.dia_na_etapa ?? 0)
  return (
    <Cartao className="flex flex-col gap-4 lg:max-w-2xl">
      <div className="flex items-center gap-3">
        <span className="brilho brilho-cinza grid size-10 place-items-center rounded-full">
          <IconeCadeado />
        </span>
        <h2 className="text-[17px] font-bold text-tinta">{t.titulo(etapa.titulo)}</h2>
      </div>
      {anterior && <p className="text-[15px] text-suave">{t.texto(anterior.titulo)}</p>}
      <BarraProgresso
        pct={total ? (feitas / total) * 100 : 0}
        rotulo={t.rotuloAulas}
        legenda={t.aulas(feitas, total, c.faltamAulas)}
      />
      <BarraProgresso
        pct={(Math.min(c.dia, DIAS_DA_ETAPA) / DIAS_DA_ETAPA) * 100}
        rotulo={t.rotuloDias}
        legenda={t.dias(c.dia, DIAS_DA_ETAPA)}
      />
    </Cartao>
  )
}

/** Conteúdo da aba: aviso de conquista, metas da etapa fechada ou as aulas. */
export function ConteudoEtapa({ etapa, etapas }: { etapa: EtapaTrilha; etapas: EtapaTrilha[] }) {
  if (!etapa.iniciada_em) return <Bloqueada etapa={etapa} anterior={etapaAnterior(etapas, etapa)} />
  const recemAberta = etapa.ordem > 1 && (etapa.dia_na_etapa ?? 0) <= 1
  return (
    <div className="flex flex-col gap-4">
      {recemAberta && (
        <p
          role="status"
          className="brilho brilho-dourado self-start rounded-[16px] px-4 py-3 text-[15px] font-bold"
        >
          {textos.conquista(etapa.titulo)}
        </p>
      )}
      {etapa.aulas.length === 0 ? (
        <Vazio>{textos.etapaVazia}</Vazio>
      ) : (
        <ListaAulas
          aulas={etapa.aulas}
          fechada={(a) => textos.liberaEm(faltamDias(a, etapa.dia_na_etapa))}
        />
      )}
    </div>
  )
}
