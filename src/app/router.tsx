import { createBrowserRouter, Navigate } from 'react-router-dom'
import { VendasPage } from '@/features/vendas'

// Só a página de vendas entra no pacote inicial. Login e área da aluna (Supabase, React Query)
// carregam sob demanda, para quem vem do anúncio no celular baixar o mínimo.
export const router = createBrowserRouter([
  { path: '/', element: <VendasPage /> },
  {
    lazy: async () => ({ Component: (await import('./providers')).ComProvedores }),
    children: [
      {
        path: '/entrar',
        lazy: async () => ({ Component: (await import('@/features/auth')).LoginPage }),
      },
      {
        path: '/app',
        lazy: async () => ({ Component: (await import('./AreaAluna')).AreaAluna }),
        children: [
          {
            index: true,
            lazy: async () => ({ Component: (await import('@/features/inicio')).InicioPage }),
          },
        ],
      },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
])
