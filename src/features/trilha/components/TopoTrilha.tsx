import { useState } from 'react'
import { BarraProgresso } from '@/components/ui'
import { DIAS_NO_ANO } from '@/domain/dia'
import { saudacaoPorHora } from '@/domain/saudacao'
import { progresso, type AulaTrilha, type MetaDaEtapa, type TemaOpcao } from '@/domain/trilha'
import { useMeuPerfil } from '@/features/auth'
import { horaEmBrasilia } from '@/lib/datas'
import { textos } from '../textos'
import { TagTema } from './Temas'

type Props = { dia: number; aulas: AulaTrilha[]; tema: TemaOpcao | null; meta: MetaDaEtapa | null }

/** Saudação curta, "Dia X de 365", barra dourada da etapa atual e a tag do tema. */
export function TopoTrilha({ dia, aulas, tema, meta }: Props) {
  const perfil = useMeuPerfil().data
  const [hora] = useState(() => horaEmBrasilia(new Date()))
  const nome = perfil?.nome?.trim().split(/\s+/)[0] || perfil?.apelido || ''
  const pct = progresso(aulas)
  const faltam = aulas.filter((a) => !a.concluida).length
  return (
    <header className="grid gap-4 lg:grid-cols-[1fr_minmax(0,22rem)] lg:items-end lg:gap-10">
      <div className="flex flex-col gap-2">
        <p className="text-sm text-suave">
          {saudacaoPorHora(hora)}
          {nome && `, ${nome}`}
        </p>
        <h1 className="text-[28px] leading-tight font-bold text-verde-escuro lg:text-[30px]">
          {textos.dia(dia, DIAS_NO_ANO)}
        </h1>
        {tema && (
          <span className="self-start">
            <TagTema chave={tema.chave} titulo={tema.titulo} />
          </span>
        )}
      </div>
      {aulas.length > 0 && (
        <BarraProgresso
          pct={pct}
          rotulo={textos.rotuloProgresso}
          legenda={
            meta
              ? textos.meta(meta.pct, meta.faltamAulas, meta.faltamDias, meta.proxima)
              : textos.progresso(pct, faltam)
          }
        />
      )}
    </header>
  )
}
