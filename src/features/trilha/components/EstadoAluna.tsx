import { Cartao } from '@/components/ui'
import { textos } from '../textos'

type Props = { tipo: 'carregando' | 'erro' | 'aviso'; texto?: string; tentar?: () => void }

/** Carregando, erro com tentar de novo, ou um aviso curto num cartão. */
export function EstadoAluna({ tipo, texto, tentar }: Props) {
  if (tipo === 'carregando')
    return (
      <p role="status" className="py-12 text-center text-sm text-suave">
        {textos.carregando}
      </p>
    )
  return (
    <Cartao role={tipo === 'erro' ? 'alert' : undefined} className="text-center text-sm text-tinta">
      <p>{tipo === 'erro' ? textos.erro : texto}</p>
      {tipo === 'erro' && tentar && (
        <button
          type="button"
          onClick={tentar}
          className="mt-2 min-h-11 px-4 font-semibold text-ora underline underline-offset-4"
        >
          {textos.tentar}
        </button>
      )}
    </Cartao>
  )
}
