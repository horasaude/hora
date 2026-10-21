import { EtiquetaBrilho } from '@/components/ui'
import { LOCAIS, NIVEIS, OBJETIVOS, type Local, type Nivel } from '@/domain/treinos'
import type { RotinaAluna } from '../api/treinos.api'
import { textos } from '../textos'
import { IconeCasa, IconeNivel } from './IconesTreino'

const tt = textos.tipos

/** "3 treinos na semana · 2 aeróbicos" ou "3 treinos na ordem". */
function contagem(r: RotinaAluna) {
  const aerobicos = r.dias.filter((d) => d.treino.categoria === 'aerobico').length
  const treinos = r.dias.length - aerobicos
  return [
    r.tipo === 'numerico' ? tt.emSequencia(treinos) : tt.naSemana(treinos),
    aerobicos > 0 ? tt.aerobicosN(aerobicos) : '',
  ]
}

type Props = { rotina: RotinaAluna; paraVoce: boolean; aoAbrir: () => void }

/** Tipo de treino do tema: nome, objetivo, nível, local e quantos treinos tem na semana. */
export function CartaoTipo({ rotina: r, paraVoce, aoAbrir }: Props) {
  const objetivo = r.objetivo ? OBJETIVOS[r.objetivo as keyof typeof OBJETIVOS] : null
  return (
    <button
      type="button"
      onClick={aoAbrir}
      className={`flex h-full w-full flex-col gap-2.5 rounded-[20px] bg-white p-4 text-left shadow-cartao transition hover:-translate-y-0.5 ${paraVoce ? 'ring-2 ring-coral' : ''}`}
    >
      <span className="flex items-start gap-2">
        <span className="min-w-0 flex-1">
          <span className="block text-[17px] leading-snug font-bold text-verde-escuro">
            {r.nome}
          </span>
          {objetivo && <span className="block text-[13px] text-suave">{objetivo}</span>}
        </span>
        {paraVoce && <EtiquetaBrilho tom="coral">{tt.paraVoce}</EtiquetaBrilho>}
      </span>
      <span className="flex flex-wrap gap-2">
        <EtiquetaBrilho tom="dourado">
          <IconeNivel className="mr-1 size-3" />
          {NIVEIS[r.nivel as Nivel] ?? r.nivel}
        </EtiquetaBrilho>
        <EtiquetaBrilho tom="verde">
          <IconeCasa className="mr-1 size-3" />
          {LOCAIS[r.local as Local] ?? r.local}
        </EtiquetaBrilho>
      </span>
      <span className="text-[13px] font-bold text-tinta">
        {contagem(r).filter(Boolean).join(' · ')}
      </span>
    </button>
  )
}
