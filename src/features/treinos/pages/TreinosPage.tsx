import { useMemo, useState } from 'react'
import { Abas } from '@/components/ui'
import { useMeuPerfil } from '@/features/auth'
import { AvisoAnamnese } from '@/features/avaliacoes'
import { CATEGORIAS, diaDaSemanaBrasilia } from '@/domain/treinos'
import { diaEmBrasilia } from '@/lib/datas'
import { EscolhaNivelLocal } from '../components/EscolhaNivelLocal'
import { ListaTreinos } from '../components/ListaTreinos'
import { Estado } from '../components/Estado'
import { SemanaTreinos, TreinoDeHoje } from '../components/Hoje'
import { Orientacoes, TreinoDaSequencia } from '../components/Sequencia'
import {
  useFeitosDaSemana,
  useFeitosRecentes,
  usePreferencias,
  useRotina,
  useTreinosDoNivel,
} from '../hooks/useTreinos'
import { useLinkTreino } from '../hooks/useLinkTreino'
import { usePreviaTreinos } from '../previa'
import { textos } from '../textos'

type Aba = keyof typeof CATEGORIAS
const ABAS = (Object.keys(CATEGORIAS) as Aba[]).map((id) => ({ id, nome: CATEGORIAS[id] }))

function Conteudo({ nivel, local, aba }: { nivel: string; local: string; aba: Aba }) {
  const rotina = useRotina(nivel, local)
  const outros = useTreinosDoNivel(nivel, local)
  const feitosQ = useFeitosDaSemana()
  const recentes = useFeitosRecentes().data ?? []
  const [hoje] = useState(() => diaEmBrasilia(new Date()))
  const feitos = useMemo(
    () => new Set((feitosQ.data ?? []).map((f) => f.treino_id)),
    [feitosQ.data],
  )
  const datas = useMemo(() => new Set((feitosQ.data ?? []).map((f) => f.data)), [feitosQ.data])
  const feitosHoje = useMemo(
    () => new Set((feitosQ.data ?? []).filter((f) => f.data === hoje).map((f) => f.treino_id)),
    [feitosQ.data, hoje],
  )
  const link = useLinkTreino()
  const [dia] = useState(() => diaDaSemanaBrasilia(new Date()))
  if (rotina.isPending || outros.isPending) return <Estado tipo="carregando" />
  if (rotina.isError || outros.isError)
    return <Estado tipo="erro" tentar={() => (rotina.refetch(), outros.refetch())} />
  const daRotina = new Set(rotina.data?.dias.map((d) => d.treino.id))
  const lista = outros.data.filter((x) => !daRotina.has(x.id) && x.categoria !== 'aerobico')
  if (aba === 'aerobico')
    return (
      <ListaTreinos
        titulo={textos.aerobico}
        vazio={textos.semAerobico}
        lista={outros.data.filter((x) => x.categoria === 'aerobico')}
        feitos={feitos}
        link={link}
      />
    )
  return (
    <div className="flex flex-col gap-7">
      {rotina.data?.tipo === 'numerico' ? (
        <>
          <Orientacoes texto={rotina.data.orientacoes} />
          <TreinoDaSequencia rotina={rotina.data} feitos={recentes} hoje={hoje} link={link} />
          <SemanaTreinos rotina={rotina.data} dia={dia} datas={datas} link={link} />
        </>
      ) : rotina.data ? (
        <>
          <Orientacoes texto={rotina.data.orientacoes} />
          <TreinoDeHoje rotina={rotina.data} dia={dia} feitos={feitosHoje} link={link} />
          <SemanaTreinos rotina={rotina.data} dia={dia} datas={datas} link={link} />
        </>
      ) : (
        <Estado tipo="vazio" texto={textos.semRotina} />
      )}
      <ListaTreinos
        titulo={textos.outros}
        vazio={textos.semOutros}
        lista={lista}
        feitos={feitos}
        link={link}
      />
    </div>
  )
}

/** Treinos da aluna: treino de hoje, a semana da rotina e outros treinos do nível e local dela. */
export function TreinosPage() {
  const prefs = usePreferencias()
  const perfil = useMeuPerfil()
  const previa = usePreviaTreinos()
  const [aba, setAba] = useState<Aba>('musculacao')
  if (prefs.isPending || perfil.isPending) return <Estado tipo="carregando" />
  if (prefs.isError) return <Estado tipo="erro" tentar={() => prefs.refetch()} />
  const nivel =
    prefs.data.treino_nivel ?? (previa || perfil.data?.papel === 'admin' ? 'iniciante' : '')
  const local = prefs.data.treino_local ?? (previa || perfil.data?.papel === 'admin' ? 'casa' : '')
  return (
    <section className="flex flex-col gap-6 font-sistema">
      <h1 className="text-[26px] font-bold text-verde-escuro">{textos.titulo}</h1>
      {!previa && <AvisoAnamnese />}
      {nivel && local ? (
        <>
          <Abas opcoes={ABAS} ativa={aba} aoEscolher={setAba} rotulo={textos.titulo} />
          <Conteudo nivel={nivel} local={local} aba={aba} />
        </>
      ) : (
        <EscolhaNivelLocal />
      )}
    </section>
  )
}
