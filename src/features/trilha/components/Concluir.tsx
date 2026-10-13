import { AvisoErro, BotaoBrilho, EtiquetaBrilho, IconeCheck } from '@/components/ui'
import type { Conclusao } from '../hooks/useConclusao'
import { textos } from '../textos'

const t = textos.aula

type Props = {
  c: Conclusao
  /** Vídeo do YouTube conclui sozinho: sem botão. */ automatico: boolean
}

/** Tag verde "Aula concluída" com o aviso discreto dos pontos; sem vídeo medível, o botão Concluir aula. */
export function Concluir({ c, automatico }: Props) {
  if (c.concluida)
    return (
      <span className="inline-flex items-center gap-2">
        <EtiquetaBrilho tom="verde">
          <IconeCheck className="mr-1 size-3" />
          {t.concluida}
        </EtiquetaBrilho>
        {c.ganho.pontos > 0 && (
          <span key={c.ganho.chave} role="status" className="text-xs font-bold text-verde-vivo">
            {t.pontos(c.ganho.pontos)}
          </span>
        )}
      </span>
    )
  if (automatico || c.carregando) return null
  return (
    <div className="flex flex-col gap-2">
      <BotaoBrilho
        tom="verde"
        tamanho="lg"
        className="self-start"
        disabled={c.ocupado}
        onClick={c.concluir}
      >
        {t.concluir}
      </BotaoBrilho>
      <AvisoErro texto={c.erro ? t.erroMarcar : null} />
    </div>
  )
}
