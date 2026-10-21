import { EtiquetaBrilho } from '@/components/ui'
import type { AulaAberta } from '../api/trilha.api'
import { textos } from '../textos'

const t = textos.aula

/** Etiqueta "Tema · Aula N", o título e "Com a profissional · N min". */
export function CabecalhoAula({
  a,
  tema,
  numero,
}: {
  a: AulaAberta
  tema?: string
  numero: number
}) {
  const detalhe = [
    a.profissional && t.com(a.profissional),
    a.duracao_minutos && textos.minutos(a.duracao_minutos),
  ]
    .filter(Boolean)
    .join(' · ')
  return (
    <header className="flex flex-col gap-1.5">
      {tema && numero > 0 && (
        <span className="self-start">
          <EtiquetaBrilho tom="verde">{t.temaEAula(tema, numero)}</EtiquetaBrilho>
        </span>
      )}
      <h1 className="text-[24px] leading-tight font-bold text-verde-escuro lg:text-[26px]">
        {a.titulo}
      </h1>
      {detalhe && <p className="text-sm text-suave">{detalhe}</p>}
    </header>
  )
}
