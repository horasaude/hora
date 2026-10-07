import { textos as t } from '../textos'

type Parceiro = { id: string; nome: string; logo?: string }

/** Faixa do topo: logo e nome de cada parceiro e a frase dos descontos. */
export function Faixa({ parceiros }: { parceiros: Parceiro[] }) {
  return (
    <div className="flex flex-col gap-3 rounded-[22px] bg-[#F6EAD2] p-5 sm:flex-row sm:items-center sm:justify-between">
      <ul className="flex flex-wrap items-center gap-4">
        {parceiros.map((p) => (
          <li key={p.id} className="flex items-center gap-3">
            <span className="grid size-12 shrink-0 place-items-center overflow-hidden rounded-2xl bg-white shadow-cartao">
              {p.logo ? (
                <img src={p.logo} alt="" className="size-full object-contain p-1" />
              ) : (
                <span className="font-bold text-verde-escuro">{p.nome[0]}</span>
              )}
            </span>
            <span className="text-lg font-bold text-verde-escuro">{p.nome}</span>
          </li>
        ))}
      </ul>
      <p className="text-[15px] font-bold text-[#7A5A1F]">{t.faixa}</p>
    </div>
  )
}
