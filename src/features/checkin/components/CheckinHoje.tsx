import { useState } from 'react'
import { AvisoErro, Cartao } from '@/components/ui'
import { useMeuPerfil } from '@/features/auth'
import { diaAtual } from '@/domain/dia'
import { semanaDeSegunda } from '@/domain/engajamento'
import { useFazerCheckin, useHoje, useMeusCheckins } from '../hooks/useCheckin'
import { textos, type Habito } from '../textos'
import { JanelaFoto } from './JanelaFoto'
import { GradeSemana, LegendaHabitos, type Ganho } from './GradeSemana'
import { Sequencia } from './Sequencia'

/** "Semana 01": semana da aluna desde a adesão (sem adesão, não mostra o número). */
function useNumeroSemana() {
  const perfil = useMeuPerfil().data
  const [agora] = useState(() => new Date())
  if (!perfil?.acesso_inicio_em) return null
  return Math.ceil(diaAtual(new Date(perfil.acesso_inicio_em), agora) / 7)
}

/** Check-in da semana como a planilha da Laís: seis hábitos de segunda a domingo; marca só hoje. */
export function CheckinHoje() {
  const meus = useMeusCheckins()
  const fazer = useFazerCheckin()
  const hoje = useHoje()
  const numero = useNumeroSemana()
  const [foto, setFoto] = useState(false)
  const [ganho, setGanho] = useState<Ganho | null>(null)
  const registrar = (tipo: Habito, extra = {}) =>
    fazer.mutate(
      { tipo, ...extra },
      {
        onSuccess: (pontos) => {
          setFoto(false)
          setGanho({ tipo, pontos, chave: Date.now() })
        },
      },
    )
  const tocar = (tipo: Habito, comFoto: boolean) => {
    if ((meus.data?.hoje ?? []).includes(tipo) || fazer.isPending) return
    fazer.reset()
    if (comFoto) setFoto(true)
    else registrar(tipo)
  }
  return (
    <Cartao className="flex flex-col gap-4">
      <h2 className="text-base font-bold text-tinta">
        {numero ? textos.semana(numero) : textos.titulo}
      </h2>
      {meus.isError ? (
        <AvisoErro texto={textos.erro} />
      ) : (
        <GradeSemana
          dias={semanaDeSegunda(hoje)}
          hoje={hoje}
          porDia={meus.data?.porDia ?? {}}
          carregando={meus.isPending}
          ganho={ganho}
          aoTocar={tocar}
        />
      )}
      <LegendaHabitos />
      {fazer.isError && !foto && <AvisoErro texto={textos.erro} />}
      <Sequencia />
      {foto && (
        <JanelaFoto
          tipo="treino"
          enviando={fazer.isPending}
          erro={fazer.isError ? textos.erro : null}
          aoFechar={() => setFoto(false)}
          aoSalvar={(d) => registrar('treino', d)}
        />
      )}
    </Cartao>
  )
}
