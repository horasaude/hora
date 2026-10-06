import { textos } from '../textos'

type Props = { tipo: 'carregando' | 'erro' | 'vazio'; texto?: string; tentar?: () => void }

/** Carregando, erro (com tentar de novo) e lista vazia. */
export function Estado({ tipo, texto, tentar }: Props) {
  if (tipo === 'carregando') {
    return (
      <p role="status" className="py-10 text-center text-sm text-suave">
        {textos.carregando}
      </p>
    )
  }
  if (tipo === 'erro') {
    return (
      <div role="alert" className="rounded-2xl bg-white p-5 text-center text-sm text-tinta">
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
    <p className="rounded-2xl border border-dashed border-linha p-5 text-center text-sm text-suave">
      {texto}
    </p>
  )
}
