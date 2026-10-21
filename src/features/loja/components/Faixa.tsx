import { textos as t } from '../textos'

type Parceiro = { id: string; nome: string; logo?: string }

/** Faixa terracota do topo: exclusivo da comunidade, a frase dos descontos e as marcas parceiras. */
export function Faixa({ parceiros }: { parceiros: Parceiro[] }) {
  return (
    <div className="flex flex-col gap-2 rounded-[22px] bg-gradient-to-br from-terracota to-[#d98b6c] p-4 text-white sm:p-5">
      <span className="inline-flex items-center gap-1.5 self-start rounded-full bg-white/20 px-2.5 py-1 text-[11px] font-bold">
        <svg viewBox="0 0 24 24" aria-hidden className="size-3.5">
          <path
            d="M9 15 15 9M9.5 9.5h0M14.5 14.5h0M12 3l2.2 1.6 2.7-.2.9 2.6 2.3 1.4-.8 2.6.8 2.6-2.3 1.4-.9 2.6-2.7-.2L12 21l-2.2-1.6-2.7.2-.9-2.6-2.3-1.4.8-2.6-.8-2.6 2.3-1.4.9-2.6 2.7.2Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {t.exclusivo}
      </span>
      <p className="text-[21px] leading-tight font-bold">{t.faixa}</p>
      <p className="text-[13px] text-white/90">{t.escolhidos}</p>
      {parceiros.length > 0 && (
        <ul className="mt-1 flex flex-wrap items-center gap-2">
          {parceiros.map((p) => (
            <li
              key={p.id}
              className="flex items-center gap-2 rounded-full bg-white/15 py-1 pr-3 pl-1 text-[12px] font-bold"
            >
              <span className="grid size-6 shrink-0 place-items-center overflow-hidden rounded-full bg-white text-[11px] text-verde-escuro">
                {p.logo ? (
                  <img src={p.logo} alt="" className="size-full object-contain" />
                ) : (
                  p.nome[0]
                )}
              </span>
              {p.nome}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
