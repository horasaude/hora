import { Link } from 'react-router-dom'
import { usePapel } from '@/features/auth'
import { textos } from '../textos'

export function InicioPage() {
  const papel = usePapel()
  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="font-titulo text-3xl text-ora">{textos.titulo}</h1>
      <p className="mt-2 text-suave">{textos.subtitulo}</p>
      {papel.data === 'admin' && (
        <Link
          to="/app/admin"
          className="mt-6 inline-flex min-h-12 items-center rounded-full bg-ora px-6 text-sm font-semibold tracking-[0.12em] text-creme uppercase"
        >
          {textos.painel}
        </Link>
      )}
    </main>
  )
}
