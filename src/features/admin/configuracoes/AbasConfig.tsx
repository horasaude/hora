import { NavLink } from 'react-router-dom'
import { ABAS_CONFIG, caminhoAba, type AbaConfig } from './abas'
import { t } from './textos'

/** Menu de Configurações: uma pílula por assunto, a do assunto aberto em verde. */
export function AbasConfig({ atual }: { atual: AbaConfig }) {
  return (
    <nav aria-label={t.menu} className="flex flex-wrap gap-2">
      {ABAS_CONFIG.map((a) => (
        <NavLink
          key={a}
          to={caminhoAba(a)}
          aria-current={a === atual ? 'page' : undefined}
          className={`brilho ${a === atual ? 'brilho-verde' : 'brilho-cinza'} inline-flex min-h-9 items-center rounded-full px-4 text-[13px] font-bold`}
        >
          {t.abas[a]}
        </NavLink>
      ))}
    </nav>
  )
}
