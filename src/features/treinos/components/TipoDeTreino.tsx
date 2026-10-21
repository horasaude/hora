import { useMemo, useState } from 'react'
import { EtiquetaBrilho } from '@/components/ui'
import { OBJETIVOS, diaDaSemanaBrasilia, nivelLocal } from '@/domain/treinos'
import { diaEmBrasilia } from '@/lib/datas'
import type { RotinaAluna } from '../api/treinos.api'
import { useFeitosDaSemana, useFeitosRecentes } from '../hooks/useTreinos'
import { useLinkTreino } from '../hooks/useLinkTreino'
import { textos } from '../textos'
import { SemanaDoTipo, SequenciaDoTipo } from './SemanaDoTipo'

/** Orientações gerais da professora, recolhidas para não ocupar a tela. */
function Orientacoes({ texto }: { texto: string }) {
  if (!texto.trim()) return null
  return (
    <details className="rounded-[18px] bg-trilho px-4 py-3 text-sm text-tinta">
      <summary className="min-h-8 cursor-pointer font-bold text-verde-escuro">
        {textos.orientacoes}
      </summary>
      <p className="mt-2 whitespace-pre-line">{texto}</p>
    </details>
  )
}

/** Dentro do tipo de treino: a semana em lista, cada treino com todos os exercícios. */
export function TipoDeTreino({ rotina, aoVoltar }: { rotina: RotinaAluna; aoVoltar: () => void }) {
  const link = useLinkTreino()
  const feitosQ = useFeitosDaSemana()
  const recentes = useFeitosRecentes().data ?? []
  const [hoje] = useState(() => diaEmBrasilia(new Date()))
  const [dia] = useState(() => diaDaSemanaBrasilia(new Date()))
  const feitosHoje = useMemo(
    () => new Set((feitosQ.data ?? []).filter((f) => f.data === hoje).map((f) => f.treino_id)),
    [feitosQ.data, hoje],
  )
  const objetivo = rotina.objetivo ? OBJETIVOS[rotina.objetivo as keyof typeof OBJETIVOS] : null
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={aoVoltar}
          className="min-h-9 self-start text-[13px] font-bold text-suave underline"
        >
          {textos.tipos.voltar}
        </button>
        <h2 className="text-[22px] leading-tight font-bold text-verde-escuro">{rotina.nome}</h2>
        <div className="flex flex-wrap gap-2">
          {objetivo && <EtiquetaBrilho tom="coral">{objetivo}</EtiquetaBrilho>}
          <EtiquetaBrilho tom="cinza">{nivelLocal(rotina.nivel, rotina.local)}</EtiquetaBrilho>
        </div>
      </div>
      <Orientacoes texto={rotina.orientacoes} />
      {rotina.tipo === 'numerico' ? (
        <SequenciaDoTipo
          rotina={rotina}
          feitosHoje={feitosHoje}
          recentes={recentes}
          hoje={hoje}
          link={link}
        />
      ) : (
        <SemanaDoTipo rotina={rotina} dia={dia} feitosHoje={feitosHoje} link={link} />
      )}
    </div>
  )
}
