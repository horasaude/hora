import { useState } from 'react'
import { cookiesRecusados, recusarCookies } from '@/lib/pixelMeta'

const OK = 'ora:cookies-ok'
const t = {
  texto: 'Usamos cookies para o site funcionar bem e para medir nossas campanhas.',
  saiba: 'Saiba mais',
  entendi: 'Entendi',
  recusar: 'Recusar',
}

function jaRespondeu(): boolean {
  try {
    return localStorage.getItem(OK) === '1' || cookiesRecusados()
  } catch {
    return false
  }
}

/** Aviso de cookies das páginas públicas: informa sem travar (o pixel já está ligado); Recusar desliga. */
export function AvisoCookies() {
  const [aberto, setAberto] = useState(() => !jaRespondeu())
  if (!aberto) return null
  const entendi = () => {
    try {
      localStorage.setItem(OK, '1')
    } catch {
      // sem armazenamento, o aviso volta na próxima visita
    }
    setAberto(false)
  }
  return (
    <div
      role="region"
      aria-label="Cookies"
      className="fixed inset-x-3 bottom-3 z-40 mx-auto flex max-w-xl flex-wrap items-center gap-x-4 gap-y-2 rounded-2xl bg-white p-4 text-sm text-tinta shadow-cartao sm:inset-x-6"
    >
      <p className="min-w-0 flex-1">
        {t.texto}{' '}
        <a href="/privacidade" className="underline underline-offset-2">
          {t.saiba}
        </a>
      </p>
      <button
        type="button"
        onClick={() => {
          recusarCookies()
          setAberto(false)
        }}
        className="min-h-10 text-xs text-suave underline underline-offset-2"
      >
        {t.recusar}
      </button>
      <button
        type="button"
        onClick={entendi}
        className="min-h-10 rounded-full bg-ora px-5 font-semibold text-white"
      >
        {t.entendi}
      </button>
    </div>
  )
}
