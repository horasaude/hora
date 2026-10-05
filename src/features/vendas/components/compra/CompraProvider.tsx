import { lazy, Suspense, useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import type { Plano } from '@/domain/precos'
import { CompraContexto } from '../../hooks/compraContexto'
import { textos } from '../../textos'

const carregarForm = () => import('./CompraForm')
const CompraForm = lazy(() => carregarForm().then((m) => ({ default: m.CompraForm })))

/** Popup de compra (<dialog> nativo: foco preso, Esc fecha, foco volta ao botão). */
export function CompraProvider({ children }: { children: ReactNode }) {
  const dialogo = useRef<HTMLDialogElement>(null)
  const [plano, setPlano] = useState<Plano | null>(null)

  const abrir = useCallback((escolhido: Plano = 'parcelado') => {
    setPlano(escolhido)
    document.documentElement.classList.add('overflow-hidden')
    dialogo.current?.showModal()
  }, [])
  const aoFechar = () => {
    document.documentElement.classList.remove('overflow-hidden')
    setPlano(null)
  }
  const fechar = () => dialogo.current?.close()

  // O formulário fica fora do pacote inicial e é baixado logo depois que a página abre.
  useEffect(() => {
    const id = window.setTimeout(() => void carregarForm(), 1500)
    return () => window.clearTimeout(id)
  }, [])

  return (
    <CompraContexto.Provider value={abrir}>
      {children}
      <dialog
        ref={dialogo}
        aria-labelledby="compra-titulo"
        onClose={aoFechar}
        onClick={(e) => e.target === e.currentTarget && fechar()}
        className="m-auto outline-none max-h-[calc(100dvh-1.5rem)] w-[calc(100%-1.5rem)] max-w-md rounded-[2rem] bg-creme p-0 text-tinta backdrop:bg-tinta/60"
      >
        {plano && (
          <div className="p-6">
            <div className="mb-5 flex items-start justify-between gap-4">
              <h2 id="compra-titulo" className="text-xl leading-snug font-semibold text-ora">
                {textos.compra.titulo}
              </h2>
              <button
                type="button"
                onClick={fechar}
                aria-label={textos.compra.fechar}
                className="-mt-1 -mr-2 grid size-11 shrink-0 place-items-center rounded-full text-2xl text-suave hover:bg-white"
              >
                ×
              </button>
            </div>
            <Suspense
              fallback={<p className="py-10 text-center text-suave">{textos.compra.carregando}</p>}
            >
              <CompraForm planoInicial={plano} />
            </Suspense>
          </div>
        )}
      </dialog>
    </CompraContexto.Provider>
  )
}
