import { useEffect, useState } from 'react'
import { textos } from '../textos'

/** Barra translúcida que aparece depois do vídeo, com a logo e o atalho para os planos. */
export function BarraTopo() {
  const [visivel, setVisivel] = useState(false)
  useEffect(() => {
    const conferir = () => setVisivel(window.scrollY > window.innerHeight * 0.7)
    conferir()
    window.addEventListener('scroll', conferir, { passive: true })
    return () => window.removeEventListener('scroll', conferir)
  }, [])
  return (
    <div
      className={`fixed inset-x-0 top-0 z-40 border-b border-linha bg-creme/80 backdrop-blur-md transition duration-300 ${visivel ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-full opacity-0'}`}
    >
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-5 sm:px-8">
        <img src="/logo-ora.png" alt="ORA" width={482} height={189} className="h-7 w-auto" />
        <a
          href="#preco"
          tabIndex={visivel ? 0 : -1}
          className="inline-flex min-h-10 items-center rounded-full bg-ora px-5 text-xs font-semibold tracking-[0.14em] text-creme uppercase transition hover:-translate-y-0.5"
        >
          {textos.app.barra.botao}
        </a>
      </div>
    </div>
  )
}
