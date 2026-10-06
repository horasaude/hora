import { textosAluna } from './textosAluna'

/** Telas que entram nas próximas etapas (desafios e ranking). */
export function EmBrevePage({ titulo }: { titulo: string }) {
  return (
    <section className="flex flex-col gap-3 lg:max-w-lg">
      <h1 className="font-titulo text-[1.7rem] leading-tight text-ora lg:text-[2.4rem]">
        {titulo}
      </h1>
      <p className="rounded-[1.25rem] border border-linha bg-areia p-4 text-sm text-suave">
        {textosAluna.emBreve}
      </p>
    </section>
  )
}
