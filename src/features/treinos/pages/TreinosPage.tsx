import { useMemo, useState } from 'react'
import { useMeuPerfil } from '@/features/auth'
import { diaDaSemanaBrasilia } from '@/domain/treinos'
import { diaEmBrasilia } from '@/lib/datas'
import { EscolhaNivelLocal } from '../components/EscolhaNivelLocal'
import { CartaoTreino } from '../components/CartaoTreino'
import { Estado } from '../components/Estado'
import { SemanaTreinos, TreinoDeHoje } from '../components/Hoje'
import {
  useFeitosDaSemana,
  usePreferencias,
  useRotina,
  useTreinosDoNivel,
} from '../hooks/useTreinos'
import { useLinkTreino } from '../hooks/useLinkTreino'
import { usePreviaTreinos } from '../previa'
import { textos } from '../textos'

function Conteudo({ nivel, local }: { nivel: string; local: string }) {
  const rotina = useRotina(nivel, local)
  const outros = useTreinosDoNivel(nivel, local)
  const feitosQ = useFeitosDaSemana()
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
  const lista = outros.data.filter((x) => !daRotina.has(x.id))
  return (
    <div className="flex flex-col gap-7">
      {rotina.data ? (
        <>
          <TreinoDeHoje rotina={rotina.data} dia={dia} feitos={feitosHoje} link={link} />
          <SemanaTreinos rotina={rotina.data} dia={dia} datas={datas} link={link} />
        </>
      ) : (
        <Estado tipo="vazio" texto={textos.semRotina} />
      )}
      <section className="flex flex-col gap-3">
        <h2 className="text-[19px] font-bold text-verde-escuro">{textos.outros}</h2>
        {lista.length === 0 ? (
          <p className="text-sm text-suave">{textos.semOutros}</p>
        ) : (
          <ul className="grid gap-3 lg:grid-cols-2">
            {lista.map((x) => (
              <li key={x.id}>
                <CartaoTreino x={x} para={link(x.id)} feito={feitos.has(x.id)} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}

/** Treinos da aluna: treino de hoje, a semana da rotina e outros treinos do nível e local dela. */
export function TreinosPage() {
  const prefs = usePreferencias()
  const perfil = useMeuPerfil()
  const previa = usePreviaTreinos()
  if (prefs.isPending || perfil.isPending) return <Estado tipo="carregando" />
  if (prefs.isError) return <Estado tipo="erro" tentar={() => prefs.refetch()} />
  const nivel =
    prefs.data.treino_nivel ?? (previa || perfil.data?.papel === 'admin' ? 'iniciante' : '')
  const local = prefs.data.treino_local ?? (previa || perfil.data?.papel === 'admin' ? 'casa' : '')
  return (
    <section className="flex flex-col gap-6 font-sistema">
      <h1 className="text-[26px] font-bold text-verde-escuro">{textos.titulo}</h1>
      {nivel && local ? <Conteudo nivel={nivel} local={local} /> : <EscolhaNivelLocal />}
    </section>
  )
}
