import { useState } from 'react'
import { useMeuPerfil } from '@/features/auth'
import { diaEMes } from '@/lib/datas'
import {
  abreEm,
  aulaDeHoje,
  DIAS_DE_PREPARACAO,
  progresso,
  semanaDoAcesso,
  temaAtual,
  type AulaTrilha,
  type TemaTrilha,
} from '@/domain/trilha'
import { CartaoAula } from '../components/CartaoAula'
import { AbasEtapas, BarraProgresso } from '../components/Etapas'
import { EstadoAluna } from '../components/EstadoAluna'
import { useTrilha } from '../hooks/useTrilha'
import { textos } from '../textos'

type Conteudo = { tema: TemaTrilha; aulas: AulaTrilha[]; dia: number; inicio: Date | null }

function Tema({ tema, aulas, dia, inicio }: Conteudo) {
  const [aba, setAba] = useState(tema.etapaAtual)
  const etapa = tema.etapas.find((e) => e.id === aba) ?? tema.etapas[0]
  const proxima = aulaDeHoje(aulas)
  const preparando = dia <= DIAS_DE_PREPARACAO
  const estado = (a: AulaTrilha) =>
    !a.liberada
      ? 'fechada'
      : a.concluida
        ? 'concluida'
        : a.id === proxima?.id
          ? 'proxima'
          : 'liberada'
  return (
    <section className="flex flex-col gap-5 lg:gap-7">
      <header>
        <h1 className="text-[1.9rem] leading-tight font-bold tracking-tight text-ora lg:text-[2.6rem]">
          {preparando ? textos.preparacao.titulo : tema.titulo}
        </h1>
        {preparando && <p className="mt-1 text-sm text-suave">{textos.preparacao.subtitulo}</p>}
      </header>
      <div className="flex flex-col gap-5 lg:max-w-2xl">
        <AbasEtapas etapas={tema.etapas} ativa={etapa?.id ?? ''} aoEscolher={setAba} />
        <BarraProgresso
          pct={progresso(etapa?.aulas ?? [])}
          legenda={textos.progresso(progresso(etapa?.aulas ?? []), semanaDoAcesso(dia))}
        />
      </div>
      <ul className="grid gap-3 lg:grid-cols-2 lg:gap-4">
        {etapa?.aulas.map((a) => (
          <CartaoAula
            key={a.id}
            aula={a}
            estado={estado(a)}
            abre={inicio ? diaEMes(abreEm(inicio, a.dia_liberacao)) : undefined}
          />
        ))}
      </ul>
    </section>
  )
}

/** Trilha: tema atual (ou "Comece por aqui" nos dias 1 a 7), etapas em abas, progresso e aulas. */
export function TrilhaPage() {
  const trilha = useTrilha()
  const perfil = useMeuPerfil()
  if (trilha.isPending) return <EstadoAluna tipo="carregando" />
  if (trilha.isError) return <EstadoAluna tipo="erro" tentar={() => trilha.refetch()} />
  const { aulas, dia } = trilha.data
  if (dia === null) return <EstadoAluna tipo="aviso" texto={textos.semAcesso} />
  const tema = temaAtual(aulas)
  if (!tema) return <EstadoAluna tipo="aviso" texto={textos.vazio} />
  const inicio = perfil.data?.acesso_inicio_em ? new Date(perfil.data.acesso_inicio_em) : null
  return <Tema key={tema.id} tema={tema} aulas={aulas} dia={dia} inicio={inicio} />
}
