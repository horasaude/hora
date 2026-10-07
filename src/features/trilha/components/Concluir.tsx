import { useState } from 'react'
import { AvisoErro, BotaoBrilho, EtiquetaBrilho, IconeCheck, PontosGanhos } from '@/components/ui'
import { useConcluida, useMarcarConcluida, useRegras } from '../hooks/useTrilha'
import { textos } from '../textos'

const t = textos.aula

/** Concluir aula (vidro verde); a pontuação é dada uma vez só pelo banco. */
export function Concluir({ id }: { id: string }) {
  const concluida = useConcluida(id)
  const marcar = useMarcarConcluida(id)
  const regras = useRegras()
  const [ganho, setGanho] = useState({ pontos: 0, chave: 0 })
  const pontos = regras.data?.find((r) => r.acao === 'aula_concluida')?.pontos ?? 0
  if (concluida.data)
    return (
      <div className="flex items-center gap-3">
        <EtiquetaBrilho tom="verde">
          <IconeCheck className="mr-1 size-3" />
          {t.concluida}
        </EtiquetaBrilho>
        <button
          type="button"
          disabled={marcar.isPending}
          onClick={() => marcar.mutate(false)}
          className="text-sm text-suave underline"
        >
          {t.desfazer}
        </button>
        <span className="relative">
          <PontosGanhos pontos={ganho.pontos} chave={ganho.chave} />
        </span>
      </div>
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
