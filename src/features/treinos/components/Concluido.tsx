import { IconeCheck, LinkBrilho } from '@/components/ui'
import { RegistrarTreino } from '@/features/checkin'
import { textos } from '../textos'

const t = textos.concluido

/** Fim do treino: parabéns, "Registrar com foto" (check-in de Treino, mesma regra) ou fechar. */
export function Concluido({ voltar, previa }: { voltar: string; previa: boolean }) {
  return (
    <section className="flex flex-col items-center gap-5 py-10 text-center">
      <span
        className="brilho brilho-coral grid size-20 place-items-center rounded-full"
        aria-hidden
      >
        <IconeCheck className="size-8" />
      </span>
      <h1 className="text-[28px] font-bold text-verde-escuro">{t.titulo}</h1>
      <p className="max-w-sm text-base text-tinta">{t.texto}</p>
      {!previa && <RegistrarTreino rotulo={t.foto} />}
      <LinkBrilho to={voltar} tom="cinza">
        {t.fechar}
      </LinkBrilho>
    </section>
  )
}
