import { textos as t } from '../textos'

type Parceiro = { id: string; nome: string; logo?: string }

/** Faixa do topo: logo e nome de cada parceiro e a frase dos descontos. */
export function Faixa({ parceiros }: { parceiros: Parceiro[] }) {
  return (
    <div className="flex flex-col gap-3 rounded-[18px] bg-[#F6EAD2] p-4 sm:flex-row sm:p-5 sm:items-center sm:justify-between">
      <ul className="flex flex-wrap items-center gap-4">
        {parceiros.map((p) => (
          <li key={p.id} className="flex items-center gap-3">
            <span className="grid size-10 shrink-0 sm:size-12 place-items-center overflow-hidden rounded-2xl bg-white shadow-cartao">
              {p.logo ? (
                <img src={p.logo} alt="" className="size-full object-contain p-1" />
              ) : (
                <span className="font-bold text-verde-escuro">{p.nome[0]}</span>
              )}
            </span>
            <span className="text-base font-bold text-verde-escuro sm:text-lg">{p.nome}</span>
          </li>
        ))}
      </ul>
      <p className="text-sm font-bold text-[#7A5A1F] sm:text-[15px]">{t.faixa}</p>
    </div>
  )
}
