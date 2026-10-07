import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import type { FormCardapio } from '../cardapioForm'
import { CardapioVisual } from './CardapioVisual'

/** Abre a impressão do navegador só com o cardápio (Salvar como PDF) e avisa quando termina. */
export function Impressao({ f, aoTerminar }: { f: FormCardapio; aoTerminar: () => void }) {
  useEffect(() => {
    const fim = () => aoTerminar()
    window.addEventListener('afterprint', fim)
    const id = window.setTimeout(() => window.print(), 50)
    return () => {
      window.clearTimeout(id)
      window.removeEventListener('afterprint', fim)
    }
  }, [aoTerminar])
  return createPortal(
    <div className="area-impressao font-sistema">
      <img
        src="/logo-ora.svg"
        alt="ORA"
        width={120}
        height={40}
        style={{ width: 120, height: 'auto' }}
        className="mb-6"
      />
      <CardapioVisual f={f} />
    </div>,
    document.body,
  )
}
