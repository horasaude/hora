import { useState } from 'react'
import { BotaoBrilho, EtiquetaBrilho, IconeCheck, PontosGanhos } from '@/components/ui'
import { useFazerCheckin, useMeusCheckins } from '../hooks/useCheckin'
import { textos } from '../textos'
import { JanelaFoto } from './JanelaFoto'

/** "Registrar com foto" no fim do treino: o mesmo check-in de Treino da Início (uma vez por dia, mesma regra). */
export function RegistrarTreino({ rotulo }: { rotulo: string }) {
  const meus = useMeusCheckins()
  const fazer = useFazerCheckin()
  const [aberta, setAberta] = useState(false)
  const [ganho, setGanho] = useState({ pontos: 0, chave: 0 })
  if (meus.data?.hoje.includes('treino'))
    return (
      <span className="relative">
        <EtiquetaBrilho tom="verde">
          <IconeCheck className="mr-1 size-3" />
          {textos.treinoFeito}
        </EtiquetaBrilho>
        <PontosGanhos pontos={ganho.pontos} chave={ganho.chave} />
      </span>
    )
  return (
    <>
      <BotaoBrilho tom="coral" tamanho="lg" onClick={() => (fazer.reset(), setAberta(true))}>
        {rotulo}
      </BotaoBrilho>
      {aberta && (
        <JanelaFoto
          tipo="treino"
          enviando={fazer.isPending}
          erro={fazer.isError ? textos.erro : null}
          aoFechar={() => setAberta(false)}
          aoSalvar={(d) =>
            fazer.mutate(
              { tipo: 'treino', ...d },
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
