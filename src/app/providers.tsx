import { QueryClientProvider } from '@tanstack/react-query'
import { Outlet } from 'react-router-dom'
import { queryClient } from '@/lib/queryClient'

/** Rota sem caminho que envolve login e área da aluna. Carrega sob demanda: a página de vendas não usa. */
export function ComProvedores() {
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  )
}
