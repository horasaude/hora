import { useState } from 'react'
import { AvisoErro, Cartao, classeBrilho, IconeCheck, PontosGanhos } from '@/components/ui'
import { useFazerCheckin, useMeusCheckins } from '../hooks/useCheckin'
import { HABITOS, textos, type Habito } from '../textos'
import { JanelaFoto } from './JanelaFoto'
import { Sequencia } from './Sequencia'

type Ganho = { tipo: Habito; pontos: number; chave: number }

function BotaoHabito({
  h,
  feito,
  desligado,
  ganho,
  aoTocar,
}: {
  h: (typeof HABITOS)[number]
  feito: boolean
  desligado: boolean
  ganho: Ganho | null
  aoTocar: () => void
}) {
  return (
    <li className="relative">
      <button
        type="button"
        aria-pressed={feito}
        aria-label={feito ? textos.feito(h.nome) : textos.marcar(h.nome)}
        disabled={desligado}
        onClick={aoTocar}
        className={`${classeBrilho(feito ? h.tom : 'cinza', 'md', true)} ${feito ? 'cursor-default' : ''}`}
      >
        {feito && <IconeCheck className="size-3.5" />}
        {h.nome}
      </button>
      {ganho?.tipo === h.id && <PontosGanhos pontos={ganho.pontos} chave={ganho.chave} />}
    </li>
  )
}

/** Check-in de hoje: Água, Treino, Cardio, Tarefa e Refeição, cada um uma vez por dia. */
export function CheckinHoje() {
  const meus = useMeusCheckins()
  const fazer = useFazerCheckin()
  const [foto, setFoto] = useState<'treino' | 'refeicao' | null>(null)
  const [ganho, setGanho] = useState<Ganho | null>(null)
  const feitos = meus.data?.hoje ?? []
  const registrar = (tipo: Habito, extra = {}) =>
    fazer.mutate(
      { tipo, ...extra },
      {
        onSuccess: (pontos) => {
          setFoto(null)
          setGanho({ tipo, pontos, chave: Date.now() })
        },
      },
    )
  const tocar = (tipo: Habito, comFoto: boolean) => {
    if (feitos.includes(tipo) || fazer.isPending) return
    fazer.reset()
    if (comFoto) setFoto(tipo as 'treino' | 'refeicao')
    else registrar(tipo)
  }
  return (
    <Cartao className="flex flex-col gap-4">
      <h2 className="text-base font-bold text-tinta">{textos.titulo}</h2>
      {meus.isError ? (
        <AvisoErro texto={textos.erro} />
      ) : (
        <ul className="flex flex-wrap gap-2" aria-busy={meus.isPending}>
          {HABITOS.map((h) => (
            <BotaoHabito
              key={h.id}
              h={h}
              feito={feitos.includes(h.id)}
              desligado={meus.isPending}
              ganho={ganho}
              aoTocar={() => tocar(h.id, h.foto)}
            />
          ))}
        </ul>
      )}
      {fazer.isError && !foto && <AvisoErro texto={textos.erro} />}
      <Sequencia />
      {foto && (
        <JanelaFoto
          tipo={foto}
          enviando={fazer.isPending}
          erro={fazer.isError ? textos.erro : null}
          aoFechar={() => setFoto(null)}
          aoSalvar={(d) => registrar(foto, d)}
        />
      )}
    </Cartao>
  )
}
