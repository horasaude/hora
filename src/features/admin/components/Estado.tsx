import type { ReactNode } from 'react'
import { textos } from '../textos'

type Props = {
  tipo: 'carregando' | 'erro' | 'vazio'
  texto?: string
  tentar?: () => void
  acao?: ReactNode
}

/** Carregando, erro (com tentar de novo) e lista vazia com o botão de criar no centro. */
export function Estado({ tipo, texto, tentar, acao }: Props) {
  if (tipo === 'carregando') {
    return (
      <p role="status" className="py-10 text-center text-sm text-suave">
        {textos.carregando}
      </p>
    )
  }
  if (tipo === 'erro') {
    return (
      <div
        role="alert"
        className="rounded-[18px] border border-[#ECEFED] bg-white p-5 text-center text-sm text-tinta shadow-painel"
      >
        <p>{textos.erro}</p>
        {tentar && (
          <button
            type="button"
            onClick={tentar}
            className="mt-3 min-h-11 px-4 font-semibold text-ora underline"
          >
            {textos.tentar}
          </button>
        )}
      </div>
    )
  }
  return (
    <div className="flex min-h-[55vh] flex-col items-center justify-center gap-4 rounded-[18px] border border-[#ECEFED] bg-white px-6 py-16 text-center shadow-painel">
      <p className="text-sm text-suave">{texto}</p>
      {acao}
    </div>
  )
}
