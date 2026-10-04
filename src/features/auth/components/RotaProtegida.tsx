import { Navigate, Outlet } from 'react-router-dom'
import { useSessao } from '../hooks/useSessao'
import { textos } from '../textos'

export function RotaProtegida() {
  const { sessao, carregando } = useSessao()
  if (carregando) return <p className="p-6 text-suave">{textos.carregando}</p>
  if (!sessao) return <Navigate to="/entrar" replace />
  return <Outlet />
}
