import { useParams } from 'react-router-dom'
import { Carregando, Cartao, EtiquetaBrilho, ErroCarregar, Vazio } from '@/components/ui'
import { diasEntre } from '@/domain/engajamento'
import { useHoje } from '@/features/checkin'
import { diaMesDeData } from '@/lib/datas'
import type { Desafio } from '../api/desafios.api'
import { CalendarioDesafio } from '../components/CalendarioDesafio'
import { CheckinDesafio } from '../components/CheckinDesafio'
import { PremioDesafio } from '../components/PremioDesafio'
import { ProgressoDesafio } from '../components/Progresso'
import { RankingDesafio } from '../components/RankingDesafio'
import { Topo } from '../components/Topo'
import { useDesafios, useMeusDias } from '../hooks/useDesafios'
import { textos } from '../textos'

/** Nome, situação, período e a regra curta: descrição, meta, quanto por dia e pontos. */
function Cabecalho({ d }: { d: Desafio }) {
  const total = diasEntre(d.inicio, d.fim) + 1
  const regra = [
    textos.metaTexto(d.meta_dias, total),
    d.tipo_checkin === 'numero' && d.meta_diaria && d.unidade
      ? `${textos.porDia}: ${textos.metaDiaria(d.meta_diaria, d.unidade)}`
      : '',
    textos.pontosDia(d.pontos_por_dia, d.bonus_conclusao),
  ]
    .filter(Boolean)
    .join(' · ')
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="text-[22px] leading-tight font-bold text-verde-escuro lg:text-[24px]">
          {d.nome}
        </h2>
        <EtiquetaBrilho tom={d.participando ? 'verde' : 'dourado'}>
          {d.participando ? textos.participando : textos.entrar}
        </EtiquetaBrilho>
      </div>
      {d.descricao && (
        <p className="text-[14px] leading-relaxed whitespace-pre-line text-tinta">{d.descricao}</p>
      )}
      <p className="text-[13px] text-suave">{regra}</p>
      <p className="text-[13px] text-suave">
        {textos.periodo(diaMesDeData(d.inicio), diaMesDeData(d.fim))}
      </p>
    </div>
  )
}

/** Desafio aberto: prêmio em destaque, nome e regra, barra e calendário, Fiz hoje e quem está no desafio. */
export function DesafioPage() {
  const { desafioId = '' } = useParams()
  const hoje = useHoje()
  const desafios = useDesafios()
  const dias = useMeusDias(desafioId)
  const d = desafios.data?.find((x) => x.id === desafioId)
  if (!d)
    return (
      <section className="flex flex-col gap-4">
        <Topo titulo={textos.titulo} rotulo={textos.voltar} para="/app/trilha" />
        {desafios.isPending ? (
          <Carregando texto={textos.carregando} />
        ) : desafios.isError ? (
          <ErroCarregar
            texto={textos.erro}
            tentar={textos.tentar}
            aoTentar={() => desafios.refetch()}
          />
        ) : (
          <Vazio>{textos.naoEncontrado}</Vazio>
        )}
      </section>
    )
  return (
    <section className="flex flex-col gap-4 lg:gap-5">
      <Topo
        titulo={d.tema_id ? textos.doTema : textos.doMesUm}
        rotulo={textos.voltar}
        para={d.tema_id ? `/app/trilha/tema/${d.tema_id}?aba=desafio` : '/app/desafios'}
      />
      <div className="grid items-start gap-5 lg:grid-cols-2 lg:gap-6">
        <div className="flex flex-col gap-4">
          <PremioDesafio d={d} />
          <Cabecalho d={d} />
          <Cartao className="flex flex-col gap-3 p-4">
            <ProgressoDesafio d={d} hoje={hoje} />
            <CalendarioDesafio d={d} dias={dias.data ?? []} hoje={hoje} />
          </Cartao>
          <CheckinDesafio d={d} hoje={hoje} />
        </div>
        <RankingDesafio id={d.id} meta={d.meta_dias} participantes={d.participantes} />
      </div>
    </section>
  )
}
