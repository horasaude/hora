import { textosAluna } from './textosAluna'

/** Telas que entram nas próximas etapas (desafios e ranking). */
export function EmBrevePage({ titulo }: { titulo: string }) {
  return (
    <section className="flex flex-col gap-3 lg:max-w-lg">
      <h1 className="text-[1.9rem] leading-tight font-bold tracking-tight text-ora lg:text-[2.6rem]">
        {titulo}
      </h1>
      <p className="rounded-[1.25rem] border border-linha bg-areia p-4 text-sm text-suave">
        {textosAluna.emBreve}
      </p>
    </section>
  )
}
