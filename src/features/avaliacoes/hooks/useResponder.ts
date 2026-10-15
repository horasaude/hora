import { useState } from 'react'
import { faltando, respondida, type Respostas } from '@/domain/anamnese'
import type { Avaliacao } from '../api/avaliacoes.api'
import { textos } from '../textos'
import { useSalvarRespostas } from './useAvaliacoes'

/** Uma pergunta por vez: começa na primeira sem resposta e guarda a cada Avançar. */
export function useResponder(a: Avaliacao) {
  const salvar = useSalvarRespostas()
  const [respostas, setRespostas] = useState<Respostas>(a.respostas)
  const [passo, setPasso] = useState(() =>
    Math.max(
      0,
      a.perguntas.findIndex((p) => !respondida(p, a.respostas)),
    ),
  )
  const [aviso, setAviso] = useState<string | null>(null)
  const [enviada, setEnviada] = useState(false)
  const p = a.perguntas[passo]
  const ultimo = passo === a.perguntas.length - 1
  const avancar = async () => {
    if (!p) return
    if (p.obrigatoria && !respondida(p, respostas)) return setAviso(textos.falta)
    const enviar = ultimo && faltando(a.perguntas, respostas).length === 0
    try {
      await salvar.mutateAsync({ anamnese: a.id, respostas, enviar })
      setAviso(null)
      if (enviar) setEnviada(true)
      else setPasso((x) => Math.min(a.perguntas.length - 1, x + 1))
    } catch {
      setAviso(textos.erroSalvar)
    }
  }
  return {
    p,
    passo,
    ultimo,
    respostas,
    aviso,
    enviada,
    ocupado: salvar.isPending,
    responder: (v: string) => p && setRespostas((r) => ({ ...r, [p.id]: v })),
    voltar: () => (setAviso(null), setPasso((x) => Math.max(0, x - 1))),
    avancar,
  }
}
