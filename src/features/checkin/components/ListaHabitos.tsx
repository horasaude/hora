import { useState, type ReactNode } from 'react'
import { AvisoErro } from '@/components/ui'
import { useFazerCheckin, useMeusCheckins, usePontosDoDia } from '../hooks/useCheckin'
import { textos, type Habito } from '../textos'
import { IconeCamera, IconeDieta, IconePrato, IconeSono } from './IconesHabito'
import { JanelaFoto } from './JanelaFoto'
import { LinhaAgua } from './LinhaAgua'
import { LinhaHabito } from './LinhaHabito'

const t = textos.seuDia
/** Ação de pontos de cada hábito (regras do painel). */
const ACAO: Record<string, string> = {
  sono: 'sono',
  agua: 'agua',
  dieta: 'dieta',
  treino: 'treino_foto',
  refeicao: 'foto_refeicao',
}

const sub = (texto: string, pontos: number) =>
  texto ? `${texto} · ${t.pontos(pontos)}` : t.pontos(pontos)

type ComFoto = 'treino' | 'refeicao'

/** Marcar um hábito (Treino e Refeição abrem a foto antes) e o "+5" que sobe ao lado dele. */
function useMarcar() {
  const fazer = useFazerCheckin()
  const [foto, setFoto] = useState<ComFoto | null>(null)
  const [ganho, setGanho] = useState<{ tipo: Habito; pontos: number; chave: number } | null>(null)
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
  const tocar = (tipo: Habito) => {
    fazer.reset()
    if (tipo === 'treino' || tipo === 'refeicao') setFoto(tipo)
    else registrar(tipo)
  }
  return { fazer, foto, setFoto, ganho, registrar, tocar }
}

/** Sono, Água, Dieta, Treino com foto e Foto da refeição (as duas abrem a câmera antes). */
export function ListaHabitos() {
  const meus = useMeusCheckins()
  const regras = usePontosDoDia().data ?? []
  const m = useMarcar()
  const hoje = meus.data?.hoje ?? []
  const valor = (h: string) => regras.find((r) => r.acao === ACAO[h])?.pontos ?? 0
  const linha = (tipo: 'sono' | 'dieta' | 'treino' | 'refeicao', icone: ReactNode, cor: string) => (
    <LinhaHabito
      icone={icone}
      cor={cor}
      nome={t[tipo].nome}
      sub={sub(t[tipo].sub, valor(tipo))}
      feito={hoje.includes(tipo)}
      ganho={m.ganho?.tipo === tipo ? m.ganho : null}
      desligado={meus.isPending || m.fazer.isPending}
      aoTocar={() => m.tocar(tipo)}
    />
  )
  return (
    <>
      <ul className="flex flex-col gap-2.5" aria-busy={meus.isPending}>
        {linha('sono', <IconeSono className="size-6" />, 'bg-[#eee9fb] text-[#7a5cc9]')}
        <LinhaAgua feito={hoje.includes('agua')} pontos={valor('agua')} />
        {linha('dieta', <IconeDieta className="size-6" />, 'bg-[#fde7df] text-[#c8471f]')}
        {linha('treino', <IconeCamera className="size-6" />, 'bg-[#fdf1d8] text-[#a86d05]')}
        {linha('refeicao', <IconePrato className="size-6" />, 'bg-trilho text-verde-escuro')}
      </ul>
      <AvisoErro texto={meus.isError || (m.fazer.isError && !m.foto) ? textos.erro : null} />
      {m.foto && (
        <JanelaFoto
          tipo={m.foto}
          enviando={m.fazer.isPending}
          erro={m.fazer.isError ? textos.erro : null}
          aoFechar={() => m.setFoto(null)}
          aoSalvar={(d) => m.registrar(m.foto ?? 'treino', d)}
        />
      )}
    </>
  )
}
