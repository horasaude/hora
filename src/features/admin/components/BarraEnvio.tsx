import { textos } from '../textos'

/** Barra de progresso do envio de arquivo. */
export function BarraEnvio({ pct }: { pct: number }) {
  return (
    <div className="flex items-center gap-2" role="status">
      <div className="trilho-progresso flex-1">
        <div className="preenchimento-dourado" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-suave">{textos.arquivos.enviando(pct)}</span>
    </div>
  )
}
