import type { Plano as TipoPlano } from '@/domain/precos'
import { textos } from '../textos'
import { BotaoCompra } from './BotaoCompra'

export type DadosPlano = {
  plano: TipoPlano
  valor: string
  vezes?: string
  riscado: string | null
  acesso: string
  destaque?: boolean
  mesGratis: boolean
  ordem: string
  atraso?: number
}

const t = textos.preco

type PropsSelos = { mesGratis: boolean; selo: string | null; destaque?: boolean }

/** "+1 mês grátis" na oferta (à direita) e "Menor valor" no Pix (à esquerda). */
function Selos({ mesGratis, selo, destaque }: PropsSelos) {
  const base =
    'absolute -top-3 rounded-full px-3 py-1 text-[0.65rem] font-semibold tracking-[0.18em] uppercase'
  return (
    <>
      {mesGratis && (
        <span className={`${base} right-6 ${destaque ? 'bg-creme text-ora' : 'bg-ora text-creme'}`}>
          {t.mesGratis}
        </span>
      )}
      {selo && <span className={`${base} left-6 bg-salvia text-white`}>{selo}</span>}
    </>
  )
}

/** Cartão de um plano. O destaque fica em verde, com o botão claro. */
export function Plano({
  plano,
  valor,
  vezes,
  riscado,
  acesso,
  destaque,
  mesGratis,
  ordem,
  atraso = 0,
}: DadosPlano) {
  const info = t.planos[plano]
  const selo = 'selo' in info ? info.selo : null
  return (
    <li
      data-revelar
      style={{ transitionDelay: `${atraso}ms` }}
      className={`relative flex flex-col rounded-[1.75rem] p-6 ${ordem} ${destaque ? 'bg-ora text-creme shadow-lg md:-my-3 md:py-9' : 'border border-ora/15 bg-white text-tinta'}`}
    >
      <Selos mesGratis={mesGratis} selo={selo} destaque={destaque} />
      <p
        className={`text-xs font-semibold tracking-[0.2em] uppercase ${destaque ? 'text-creme/80' : 'text-ora'}`}
      >
        {info.nome}
      </p>
      {riscado && (
        <p className={`mt-4 text-sm ${destaque ? 'text-creme/70' : 'text-suave'}`}>
          {t.de} <s>{riscado}</s>
        </p>
      )}
      <p
        className={`leading-none ${riscado ? 'mt-1' : 'mt-4'} ${destaque ? 'text-creme' : 'text-ora'}`}
      >
        {vezes && <span className="text-xl">{vezes} </span>}
        <span className="text-5xl font-semibold tracking-tight">{valor}</span>
      </p>
      <p className={`mt-2 text-sm italic ${destaque ? 'text-creme/80' : 'text-suave'}`}>
        {info.detalhe}
      </p>
      <ul className="mt-5 flex flex-1 flex-col gap-2 text-sm">
        {[acesso, ...info.itens].map((item) => (
          <li key={item} className="flex gap-2">
            <span
              aria-hidden="true"
              className={`mt-1 h-2.5 w-1.5 shrink-0 rotate-45 border-r-2 border-b-2 ${destaque ? 'border-creme' : 'border-ora'}`}
            />
            {item}
          </li>
        ))}
      </ul>
      <div className="mt-6 [&>button]:w-full">
        <BotaoCompra plano={plano} variante={destaque ? 'claro' : 'escuro'}>
          {t.botao}
        </BotaoCompra>
      </div>
    </li>
  )
}
