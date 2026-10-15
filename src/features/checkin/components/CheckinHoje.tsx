import { useState } from 'react'
import { AvisoErro, Cartao } from '@/components/ui'
import { useMeuPerfil } from '@/features/auth'
import { diaAtual } from '@/domain/dia'
import { semanaDeSegunda } from '@/domain/engajamento'
import { useFazerCheckin, useHoje, useMeusCheckins, usePontosDaSemana } from '../hooks/useCheckin'
import { textos, type Habito } from '../textos'
import { CartaoAgua } from './CartaoAgua'
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

/** "Semana 06" e os pontos que ela já fez nos hábitos desta semana. */
function Topo({ numero }: { numero: number | null }) {
  const pontos = usePontosDaSemana().data ?? 0
  return (
    <div className="flex items-center justify-between gap-3">
      <h2 className="text-base font-bold text-tinta">
        {numero ? textos.semana(numero) : textos.titulo}
      </h2>
      <span className="brilho brilho-dourado inline-flex min-h-7 items-center rounded-full px-3 text-xs font-bold">
        {textos.pontosSemana(pontos)}
      </span>
    </div>
  )
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
      <Topo numero={numero} />
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
      <CartaoAgua />
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
