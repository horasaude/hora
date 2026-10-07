import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BotaoBrilho, IconeCheck } from '@/components/ui'
import { JanelaMedida } from '@/features/evolucao'
import { useHoje } from '@/features/checkin'
import { ITENS_COMECE, type ItemComece } from '../api/comece.api'
import { useMarcarComece } from '../hooks/useTrilha'
import { textos } from '../textos'
import { JanelaApp, JanelaRegras } from './JanelasComece'

const t = textos.comece

function Marca({ feito }: { feito: boolean }) {
  return feito ? (
    <span className="brilho brilho-verde grid size-7 shrink-0 place-items-center rounded-full">
      <IconeCheck className="size-3.5" />
    </span>
  ) : (
    <span aria-hidden className="size-7 shrink-0 rounded-full border-2 border-linha" />
  )
}

/** Checklist do Comece por aqui: cada passo com a sua ação; feito fica verde. */
export function PassosComece({ feitos }: { feitos: ItemComece[] }) {
  const hoje = useHoje()
  const navegar = useNavigate()
  const marcar = useMarcarComece()
  const [janela, setJanela] = useState<'medida' | 'regras' | 'app' | null>(null)
  const fechar = (item?: ItemComece) => {
    setJanela(null)
    if (item) marcar.mutate(item)
  }
  const acao: Record<ItemComece, () => void> = {
    perfil: () => {
      marcar.mutate('perfil')
      navegar('/app/perfil')
    },
    medidas: () => setJanela('medida'),
    foto: () => setJanela('medida'),
    regras: () => setJanela('regras'),
    app: () => setJanela('app'),
  }
  return (
    <>
      <ul className="flex flex-col gap-2">
        {ITENS_COMECE.map((item) => {
          const feito = feitos.includes(item)
          return (
            <li
              key={item}
              className={`flex min-h-14 items-center gap-3 rounded-[16px] border px-3 py-2 ${feito ? 'border-salvia/50 bg-salvia-suave' : 'border-linha bg-white'}`}
            >
              <Marca feito={feito} />
              <span className="min-w-0 flex-1 text-[15px] text-tinta">
                {t.itens[item].nome}
                {feito && <span className="sr-only"> ({t.feito})</span>}
              </span>
              {!feito && (
                <span className="flex gap-1.5">
                  {item === 'foto' && (
                    <BotaoBrilho tom="cinza" tamanho="sm" onClick={() => marcar.mutate('foto')}>
                      {t.pular}
                    </BotaoBrilho>
                  )}
                  <BotaoBrilho tom="escuro" tamanho="sm" onClick={acao[item]}>
                    {t.itens[item].acao}
                  </BotaoBrilho>
                </span>
              )}
            </li>
          )
        })}
      </ul>
      {janela === 'medida' && <JanelaMedida hoje={hoje} aoFechar={() => fechar()} />}
      {janela === 'regras' && <JanelaRegras aoFechar={() => fechar('regras')} />}
      {janela === 'app' && <JanelaApp aoFechar={() => fechar('app')} />}
    </>
  )
}
