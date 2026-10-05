import { linkWhatsApp } from '@/lib/whatsapp'
import { textos } from '../textos'

const t = textos.lateral

function Inclui() {
  return (
    <div className="rounded-[1.5rem] bg-white p-5">
      <p className="text-sm font-semibold text-ora">{t.incluiTitulo}</p>
      <ul className="mt-3 flex flex-col gap-2 text-sm text-tinta">
        {t.inclui.map((item) => (
          <li key={item} className="flex gap-2">
            <span
              aria-hidden="true"
              className="mt-1 h-2.5 w-1.5 shrink-0 rotate-45 border-r-2 border-b-2 border-ora"
            />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

function Garantia() {
  return (
    <div className="flex items-center gap-4 rounded-[1.5rem] bg-white p-5">
      <div className="grid size-14 shrink-0 place-items-center rounded-full border-2 border-ora text-[0.6rem] font-semibold tracking-[0.1em] text-ora uppercase">
        {t.garantiaSelo}
      </div>
      <div>
        <p className="text-sm font-semibold text-ora">{t.garantiaTitulo}</p>
        <p className="mt-0.5 text-sm text-tinta">{t.garantiaTexto}</p>
      </div>
    </div>
  )
}

function Ajuda() {
  const whats = linkWhatsApp(import.meta.env.VITE_WHATSAPP_NUMERO, t.mensagem)
  if (!whats) return null
  return (
    <div className="rounded-[1.5rem] bg-ora p-5 text-center text-creme">
      <p className="text-sm font-semibold">{t.ajuda}</p>
      <a
        href={whats}
        target="_blank"
        rel="noopener"
        className="mt-3 inline-flex min-h-11 items-center rounded-full bg-[#25D366] px-5 text-sm font-bold text-tinta"
      >
        {t.whatsapp}
      </a>
    </div>
  )
}

export function Lateral() {
  return (
    <aside className="flex flex-col gap-4">
      <Inclui />
      <Garantia />
      <Ajuda />
      <p className="text-center text-xs font-semibold tracking-[0.16em] text-ora uppercase">
        {t.seguro}
      </p>
    </aside>
  )
}
