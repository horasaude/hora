import { Link } from 'react-router-dom'
import type { FiltroMembros } from '@/domain/crm'
import { t } from './textos'

/** Aviso do filtro vindo do cartão do painel, com o caminho para ver todas. */
export function FiltroAtivo({ filtro, total }: { filtro: FiltroMembros; total: number }) {
  return (
    <p className="flex flex-wrap items-center gap-3 text-sm text-tinta">
      <span className="font-bold">{t.filtros[filtro]}</span>
      <span className="text-suave">{t.total(total)}</span>
      <Link
        to="/app/admin/alunas"
        className="font-bold text-verde-escuro underline-offset-4 hover:underline"
      >
        {t.verTodas}
      </Link>
    </p>
  )
}
