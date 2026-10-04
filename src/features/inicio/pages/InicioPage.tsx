import { textos } from '../textos'

export function InicioPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="font-titulo text-3xl text-ora">{textos.titulo}</h1>
      <p className="mt-2 text-suave">{textos.subtitulo}</p>
    </main>
  )
}
