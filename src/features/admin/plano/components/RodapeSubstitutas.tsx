import { tCardapios as t } from '../textos2'
import { tEditor } from '../textosRefeicao'

/** "Nenhuma refeição substituta" ou "N refeições substitutas", Exibir e Adicionar substituição. */
export function RodapeSubstitutas({
  total,
  aberto,
  aoAlternar,
  aoNova,
}: {
  total: number
  aberto: boolean
  aoAlternar: () => void
  aoNova: () => void
}) {
  const link = 'min-h-8 font-bold text-verde-escuro underline underline-offset-4'
  return (
    <div className="flex flex-wrap items-center gap-3 border-t border-[#F4F5F4] pt-2 text-xs">
      <span className="text-suave">
        {total ? tEditor.substitutas(total) : tEditor.nenhumaSubstituta}
      </span>
      {total > 0 && (
        <button type="button" aria-expanded={aberto} className={link} onClick={aoAlternar}>
          {aberto ? tEditor.ocultar : tEditor.exibir}
        </button>
      )}
      <button type="button" className={link} onClick={aoNova}>
        + {t.adicionarSubstituta}
      </button>
    </div>
  )
}
