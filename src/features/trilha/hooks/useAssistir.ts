import { useCallback, useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  assistiuOSuficiente,
  pausar,
  pontoDeRetomada,
  registrarTempo,
  type Acompanhamento,
} from '@/domain/assistido'
import { carregarApiYoutube, ESTADO_YT, type PlayerYT } from '@/lib/youtube'
import { buscarProgresso, salvarProgresso } from '../api/trilha.api'

const LEITURA_MS = 1000
const GRAVAR_MS = 15000

type Opcoes = { aula: string; gravar: boolean; aoConcluir: () => void }

/** Liga o player ao iframe uma vez; no fim do vídeo, chama o aviso guardado na ref. */
function usePlayerYoutube(aoTerminar: () => void) {
  const fim = useRef(aoTerminar)
  useEffect(() => {
    fim.current = aoTerminar
  })
  const player = useRef<PlayerYT | null>(null)
  const ligar = useCallback((iframe: HTMLIFrameElement | null) => {
    if (!iframe) {
      player.current = null
      return
    }
    carregarApiYoutube()
      .then((YT) => {
        player.current = new YT.Player(iframe, {
          events: {
            onStateChange: (e) => {
              if (e.data === ESTADO_YT.terminou) fim.current()
            },
          },
        })
      })
      .catch(() => undefined)
  }, [])
  return { player, ligar }
}

/** Progresso guardado: de onde retomar e os trechos já vistos (só fora da pré-visualização). */
function useProgresso(aula: string, gravar: boolean) {
  return useQuery({
    queryKey: ['progresso-aula', aula],
    queryFn: () => buscarProgresso(aula),
    enabled: gravar,
    staleTime: Infinity,
  })
}

/**
 * Acompanha o vídeo do YouTube: lê o tempo a cada segundo enquanto toca, soma só o que foi assistido,
 * guarda o progresso de tempos em tempos e conclui a aula ao chegar a 90% realmente assistidos.
 */
export function useAssistir({ aula, gravar, aoConcluir }: Opcoes) {
  const progresso = useProgresso(aula, gravar)
  const estado = useRef<Acompanhamento>({ trechos: [], ultimo: null })
  const mudou = useRef(false)
  const salvo = progresso.data
  const passos = useRef({ ler: () => undefined as void, guardar: () => undefined as void })
  const { player, ligar } = usePlayerYoutube(() => passos.current.ler())

  useEffect(() => {
    passos.current = {
      ler: () => {
        const p = player.current
        if (!p) return
        if (p.getPlayerState() === ESTADO_YT.tocando) {
          estado.current = registrarTempo(estado.current, p.getCurrentTime())
          mudou.current = true
        } else estado.current = pausar(estado.current)
        if (gravar && assistiuOSuficiente(estado.current.trechos, p.getDuration())) aoConcluir()
      },
      guardar: () => {
        const p = player.current
        if (!gravar || !p || !mudou.current) return
        mudou.current = false
        const dados = {
          trechos: estado.current.trechos,
          posicao: p.getCurrentTime(),
          duracao: p.getDuration(),
        }
        void salvarProgresso(aula, dados).catch(() => {
          mudou.current = true
        })
      },
    }
  }, [aula, gravar, aoConcluir, player])

  useEffect(() => {
    if (salvo) estado.current = { trechos: salvo.trechos, ultimo: null }
  }, [salvo])

  useEffect(() => {
    const leitura = window.setInterval(() => passos.current.ler(), LEITURA_MS)
    const gravacao = window.setInterval(() => passos.current.guardar(), GRAVAR_MS)
    const aoEsconder = () => document.visibilityState === 'hidden' && passos.current.guardar()
    document.addEventListener('visibilitychange', aoEsconder)
    return () => {
      window.clearInterval(leitura)
      window.clearInterval(gravacao)
      document.removeEventListener('visibilitychange', aoEsconder)
      passos.current.guardar()
    }
  }, [])

  const pronto = !gravar || !progresso.isPending
  const inicio = salvo ? pontoDeRetomada(salvo.posicao, salvo.duracao) : 0
  return { pronto, inicio, ligar }
}
