import { useParams } from 'react-router-dom'
import {
  Carregando,
  Cartao,
  EtiquetaBrilho,
  ErroCarregar,
  LinkBrilho,
  Vazio,
} from '@/components/ui'
import { diasEntre } from '@/domain/engajamento'
import { useHoje } from '@/features/checkin'
import { diaMesDeData } from '@/lib/datas'
import type { Desafio } from '../api/desafios.api'
import { CalendarioDesafio } from '../components/CalendarioDesafio'
import { CheckinDesafio } from '../components/CheckinDesafio'
import { ProgressoDesafio } from '../components/Progresso'
import { RankingDesafio } from '../components/RankingDesafio'
import { useDesafios, useMeusDias } from '../hooks/useDesafios'
import { textoPremio } from '../premio'
import { textos } from '../textos'

function Regras({ d }: { d: Desafio }) {
  const total = diasEntre(d.inicio, d.fim) + 1
  const itens = [
    [textos.meta, textos.metaTexto(d.meta_dias, total)],
    ...(d.tipo_checkin === 'numero' && d.meta_diaria && d.unidade
      ? [[textos.porDia, textos.metaDiaria(d.meta_diaria, d.unidade)]]
      : []),
    [textos.premio, textoPremio(d) || '-'],
    [textos.pontosRotulo, textos.pontosDia(d.pontos_por_dia, d.bonus_conclusao)],
  ]
  return (
    <Cartao className="flex flex-col gap-3">
      <h2 className="text-base font-bold text-tinta">{textos.regras}</h2>
      {d.descricao && (
        <p className="text-[15px] leading-relaxed whitespace-pre-line text-tinta">{d.descricao}</p>
      )}
      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
        {itens.map(([k, v], i) => (
          <div key={i} className="contents">
            <dt className="font-bold text-suave">{k}</dt>
            <dd className="text-tinta">{v}</dd>
          </div>
        ))}
      </dl>
    </Cartao>
  )
}

/** Desafio aberto: regras, progresso, calendário, check-in do dia e ranking. */
export function DesafioPage() {
  const { desafioId = '' } = useParams()
  const hoje = useHoje()
  const desafios = useDesafios()
  const dias = useMeusDias(desafioId)
  const d = desafios.data?.find((x) => x.id === desafioId)
  if (desafios.isPending) return <Carregando texto={textos.carregando} />
  if (desafios.isError)
    return (
      <ErroCarregar
        texto={textos.erro}
        tentar={textos.tentar}
        aoTentar={() => desafios.refetch()}
      />
    )
  if (!d) return <Vazio>{textos.naoEncontrado}</Vazio>
  return (
    <section className="flex flex-col gap-5 lg:gap-6">
      <LinkBrilho to="/app/desafios" tom="cinza" tamanho="sm" className="self-start">
        {textos.voltar}
      </LinkBrilho>
      <header className="flex flex-wrap items-center gap-3">
        <h1 className="text-[28px] leading-tight font-bold text-verde-escuro lg:text-[30px]">
          {d.nome}
        </h1>
        <EtiquetaBrilho tom={d.participando ? 'verde' : 'dourado'}>
          {d.participando ? textos.participando : textos.entrar}
        </EtiquetaBrilho>
      </header>
      <p className="-mt-3 text-sm text-suave">
        {textos.periodo(diaMesDeData(d.inicio), diaMesDeData(d.fim))} ·{' '}
        {textos.participantes(d.participantes)}
      </p>
      <div className="grid items-start gap-5 lg:grid-cols-2 lg:gap-6">
        <div className="flex flex-col gap-5 lg:gap-6">
          <Cartao className="flex flex-col gap-4">
            <ProgressoDesafio d={d} hoje={hoje} />
            {!d.encerrado && (
              <h2 className="text-base font-bold text-tinta">{textos.checkin.titulo}</h2>
            )}
            <CheckinDesafio d={d} hoje={hoje} />
            <CalendarioDesafio d={d} dias={dias.data ?? []} hoje={hoje} />
          </Cartao>
          <Regras d={d} />
        </div>
        <RankingDesafio id={d.id} meta={d.meta_dias} />
      </div>
    </section>
  )
}
