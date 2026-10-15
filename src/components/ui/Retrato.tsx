import { Coroa } from './Coroa'

type Props = {
  nome: string
  foto?: string | null
  lugar?: 1 | 2 | 3 | null
  tamanho?: string
  texto?: string
}

/** Foto de perfil (ou a inicial) num círculo; no pódio, com a coroinha por cima. */
export function Retrato({ nome, foto, lugar, tamanho = 'size-14', texto = 'text-xl' }: Props) {
  return (
    <span className={`relative inline-grid shrink-0 ${tamanho}`}>
      {foto ? (
        <img src={foto} alt={nome} className={`${tamanho} rounded-full object-cover`} />
      ) : (
        <span
          aria-hidden
          className={`${tamanho} ${texto} grid place-items-center rounded-full bg-terracota-suave font-bold text-terracota-escuro`}
        >
          {nome[0]?.toUpperCase()}
        </span>
      )}
      {lugar && (
        <Coroa
          lugar={lugar}
          className="absolute -top-[38%] left-1/2 w-[62%] -translate-x-1/2 -rotate-6 drop-shadow"
        />
      )}
    </span>
  )
}
