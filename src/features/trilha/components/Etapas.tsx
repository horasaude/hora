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

/** Conteúdo do módulo: aviso de conquista, metas da etapa fechada ou as aulas. */
function ConteudoEtapa({
  etapa,
  etapas,
  capaTema,
}: {
  etapa: EtapaTrilha
  etapas: EtapaTrilha[]
  capaTema?: string | null
}) {
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
          capaTema={capaTema}
          fechada={(a) => textos.liberaEm(faltamDias(a, etapa.dia_na_etapa))}
        />
      )}
    </div>
  )
}

/** Etapas como módulos que abrem e fecham (a atual já vem aberta), com quantas aulas ela concluiu. */
export function ModulosEtapas({
  etapas,
  atual,
  capaTema,
}: {
  etapas: EtapaTrilha[]
  atual: string | null
  capaTema?: string | null
}) {
  return (
    <div className="flex flex-col gap-3">
      {etapas.map((e, i) => {
        const feitas = e.aulas.filter((a) => a.concluida).length
        return (
          <details
            key={e.id}
            open={e.id === atual}
            className="group rounded-[20px] border border-linha bg-[#F8FAF9]"
          >
            <summary className="flex min-h-16 cursor-pointer list-none items-center gap-3 px-4 py-3">
              <span
                className={`brilho ${e.iniciada_em ? 'brilho-verde' : 'brilho-cinza'} grid size-10 shrink-0 place-items-center rounded-full text-[15px] font-bold`}
              >
                {e.iniciada_em ? i + 1 : <IconeCadeado />}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[16px] font-bold text-tinta">
                  {textos.etapaN(i + 1, e.titulo)}
                </span>
                <span className="block text-[13px] text-suave">
                  {e.iniciada_em ? textos.modulo(feitas, e.aulas.length) : textos.fechadaModulo}
                </span>
              </span>
              <span
                aria-hidden
                className="size-2.5 shrink-0 rotate-45 border-r-2 border-b-2 border-suave transition group-open:rotate-[225deg]"
              />
            </summary>
            <div className="px-3 pb-3">
              <ConteudoEtapa etapa={e} etapas={etapas} capaTema={capaTema} />
            </div>
          </details>
        )
      })}
    </div>
  )
}
