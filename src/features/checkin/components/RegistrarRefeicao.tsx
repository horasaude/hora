import { useState } from 'react'
import { BotaoBrilho, EtiquetaBrilho, IconeCheck, PontosGanhos } from '@/components/ui'
import { useFazerCheckin, useMeusCheckins } from '../hooks/useCheckin'
import { textos } from '../textos'
import { JanelaFoto } from './JanelaFoto'

/** "Registrar refeição": o mesmo check-in com foto da Início (uma vez por dia, pontos da regra). */
export function RegistrarRefeicao({ rotulo }: { rotulo: string }) {
  const meus = useMeusCheckins()
  const fazer = useFazerCheckin()
  const [aberta, setAberta] = useState(false)
  const [ganho, setGanho] = useState({ pontos: 0, chave: 0 })
  if (meus.data?.hoje.includes('refeicao'))
    return (
      <span className="relative">
        <EtiquetaBrilho tom="verde">
          <IconeCheck className="mr-1 size-3" />
          {textos.refeicaoFeita}
        </EtiquetaBrilho>
        <PontosGanhos pontos={ganho.pontos} chave={ganho.chave} />
      </span>
    )
  return (
    <>
      <BotaoBrilho tom="verde" tamanho="sm" onClick={() => (fazer.reset(), setAberta(true))}>
        {rotulo}
      </BotaoBrilho>
      {aberta && (
        <JanelaFoto
          tipo="refeicao"
          enviando={fazer.isPending}
          erro={fazer.isError ? textos.erro : null}
          aoFechar={() => setAberta(false)}
          aoSalvar={(d) =>
            fazer.mutate(
              { tipo: 'refeicao', ...d },
              {
                onSuccess: (pontos) => {
                  setAberta(false)
                  setGanho({ pontos, chave: Date.now() })
                },
              },
            )
          }
        />
      )}
    </>
  )
}
