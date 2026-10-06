import { BotaoBrilho, Janela } from '@/components/ui'
import { aceitarRegras } from '../api/forum.api'
import { useAcaoForum, useRegrasAceitas } from '../hooks/useForum'
import { textos as t } from '../textos'

/** Regras do fórum na primeira entrada; Entendi grava e fecha. */
export function RegrasJanela() {
  const aceitas = useRegrasAceitas()
  const acao = useAcaoForum(aceitarRegras)
  if (aceitas.data !== false || acao.isSuccess) return null
  const entendi = () => acao.mutate(undefined)
  return (
    <Janela
      titulo={t.regras.titulo}
      aoFechar={entendi}
      rotuloFechar={t.regras.entendi}
      rodape={
        <BotaoBrilho onClick={entendi} disabled={acao.isPending}>
          {t.regras.entendi}
        </BotaoBrilho>
      }
    >
      <ol className="flex flex-col gap-3">
        {t.regras.itens.map((item, i) => (
          <li key={item} className="flex gap-3 text-[15px] leading-relaxed text-tinta">
            <span className="brilho brilho-verde grid size-7 shrink-0 place-items-center rounded-full text-[13px] font-bold">
              {i + 1}
            </span>
            {item}
          </li>
        ))}
      </ol>
    </Janela>
  )
}
