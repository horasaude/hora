import type { useLinkIndicacao } from '../hooks/useLinkIndicacao'
import { textos } from '../textos'
import { IconeLink } from './IconesPerfil'

const t = textos.indicar

/** Campo "Seu link" com o ícone de link e o botão Copiar dentro. */
export function CampoLink({
  link,
  copiar,
  copiado,
}: Pick<ReturnType<typeof useLinkIndicacao>, 'link' | 'copiar' | 'copiado'>) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[13px] font-bold text-suave">{t.link}</span>
      <div className="flex items-center gap-2 rounded-xl border border-linha bg-white py-1.5 pr-1.5 pl-3">
        <IconeLink className="size-4 shrink-0 text-suave" />
        <span className="min-w-0 flex-1 truncate text-sm text-tinta">{link}</span>
        <button
          type="button"
          onClick={copiar}
          disabled={!link}
          className="brilho brilho-escuro min-h-9 shrink-0 rounded-full px-4 text-[13px] font-bold disabled:opacity-50"
        >
          {copiado ? t.copiado : t.copiar}
        </button>
      </div>
      <span role="status" className="sr-only">
        {copiado ? t.copiado : ''}
      </span>
    </div>
  )
}
