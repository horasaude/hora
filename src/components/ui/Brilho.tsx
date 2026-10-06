import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link, type LinkProps } from 'react-router-dom'
import { classeBrilho, classeTom, type TamanhoBrilho, type TomBrilho } from './estiloBrilho'

type Estilo = { tom?: TomBrilho; tamanho?: TamanhoBrilho; pilula?: boolean }

/** Botão de vidro brilhante. Verde escuro por padrão (ação principal). */
export function BotaoBrilho({
  tom = 'escuro',
  tamanho = 'md',
  pilula = true,
  className = '',
  type = 'button',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & Estilo) {
  return (
    <button
      type={type}
      className={`${classeBrilho(tom, tamanho, pilula)} ${className}`}
      {...props}
    />
  )
}

/** Link com cara de botão brilhante (criar, abrir). */
export function LinkBrilho({
  tom = 'escuro',
  tamanho = 'md',
  pilula = true,
  className = '',
  ...props
}: LinkProps & Estilo) {
  return <Link className={`${classeBrilho(tom, tamanho, pilula)} ${className}`} {...props} />
}

/** Etiqueta de situação em vidro: verde feito, dourado destaque, coral alerta, cinza ainda não feito. */
export function EtiquetaBrilho({ tom, children }: { tom: TomBrilho; children: ReactNode }) {
  return (
    <span
      className={`brilho ${classeTom(tom)} inline-flex items-center rounded-full px-2.5 py-[3px] text-[11px] leading-tight font-bold whitespace-nowrap`}
    >
      {children}
    </span>
  )
}

/** Barra de progresso dourada brilhante, com o texto do que falta embaixo. */
export function BarraProgresso({
  pct,
  legenda,
  rotulo,
}: {
  pct: number
  legenda: string
  rotulo?: string
}) {
  const valor = Math.max(0, Math.min(100, Math.round(pct)))
  return (
    <div className="flex flex-col gap-1.5">
      <div
        role="progressbar"
        aria-valuenow={valor}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={rotulo ?? legenda}
        className="trilho-progresso"
      >
        <div className="preenchimento-dourado" style={{ width: `${valor}%` }} />
      </div>
      <p className="text-[13px] text-suave">{legenda}</p>
    </div>
  )
}
