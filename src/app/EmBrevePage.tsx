import { textosAluna } from './textosAluna'

/** Telas que entram nas próximas etapas (desafios e ranking). */
export function EmBrevePage({ titulo }: { titulo: string }) {
  return (
    <section className="flex flex-col gap-3 lg:max-w-lg">
      <h1 className="text-[28px] leading-tight font-bold text-verde-escuro lg:text-[30px]">
        {titulo}
      </h1>
      <p className="rounded-[22px] bg-white p-5 text-sm text-suave shadow-cartao">
        {textosAluna.emBreve}
      </p>
    </section>
  )
}
