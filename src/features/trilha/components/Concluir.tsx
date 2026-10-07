import { useState } from 'react'
import { AvisoErro, BotaoBrilho, EtiquetaBrilho, IconeCheck, PontosGanhos } from '@/components/ui'
import { useConcluida, useMarcarConcluida, useRegras } from '../hooks/useTrilha'
import { textos } from '../textos'

const t = textos.aula

/** Concluir aula (vidro verde); depois, só a tag "Aula concluída". Os pontos saem uma vez só, pelo banco. */
export function Concluir({ id }: { id: string }) {
  const concluida = useConcluida(id)
  const marcar = useMarcarConcluida(id)
  const regras = useRegras()
  const [ganho, setGanho] = useState({ pontos: 0, chave: 0 })
  const pontos = regras.data?.find((r) => r.acao === 'aula_concluida')?.pontos ?? 0
  if (concluida.data)
    return (
      <span className="relative">
        <EtiquetaBrilho tom="verde">
          <IconeCheck className="mr-1 size-3" />
          {t.concluida}
        </EtiquetaBrilho>
        <PontosGanhos pontos={ganho.pontos} chave={ganho.chave} />
      </span>
    )
  return (
    <div className="flex flex-col gap-2">
      <BotaoBrilho
        tom="verde"
        tamanho="lg"
        className="self-start"
        disabled={concluida.isPending || marcar.isPending}
        onClick={() =>
          marcar.mutate(true, { onSuccess: () => setGanho({ pontos, chave: Date.now() }) })
        }
      >
        {t.concluir}
      </BotaoBrilho>
      <AvisoErro texto={marcar.isError ? t.erroMarcar : null} />
    </div>
  )
}
