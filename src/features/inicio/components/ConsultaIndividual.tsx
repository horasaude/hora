import { classeBrilho } from '@/components/ui'
import { linkWhatsApp } from '@/lib/whatsapp'
import { textos } from '../textos'

const t = textos.consulta

/** Consulta individual: cada profissional com o botão que abre o WhatsApp dela com a mensagem pronta. */
export function ConsultaIndividual() {
  return (
    <section className="flex flex-col gap-3 rounded-[22px] bg-white p-4 shadow-cartao lg:p-5">
      <h2 className="text-base font-bold text-verde-escuro">{t.titulo}</h2>
      <ul className="flex flex-col divide-y divide-linha">
        {t.profissionais.map((p) => (
          <li key={p.nome} className="flex flex-wrap items-center justify-between gap-2 py-2.5">
            <span>
              <span className="block text-[15px] font-semibold text-tinta">{p.nome}</span>
              <span className="text-sm text-suave">{p.area}</span>
            </span>
            <a
              href={linkWhatsApp(p.whatsapp, t.mensagem) ?? undefined}
              target="_blank"
              rel="noreferrer"
              aria-label={`${t.botao}: ${p.nome}`}
              className={classeBrilho('verde')}
            >
              {t.botao}
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
