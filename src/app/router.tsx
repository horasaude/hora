import { createBrowserRouter, Navigate, type RouteObject } from 'react-router-dom'
import { ObrigadaPage, PrivacidadePage, TermosPage, VendasPage } from '@/features/vendas'

// Só a página de vendas entra no pacote inicial. Login e área da aluna (Supabase, React Query)
// carregam sob demanda, para quem vem do anúncio no celular baixar o mínimo.
const admin = () => import('@/features/admin')

// Painel das profissionais (/app/admin): só papel admin; tudo carrega sob demanda.
const rotasAdmin: RouteObject[] = [
  { index: true, element: <Navigate to="conteudo" replace /> },
  { path: 'conteudo', lazy: async () => ({ Component: (await admin()).ConteudoPage }) },
  { path: 'conteudo/:temaId', lazy: async () => ({ Component: (await admin()).TemaPage }) },
  { path: 'aulas/nova', lazy: async () => ({ Component: (await admin()).AulaPage }) },
  { path: 'aulas/:aulaId', lazy: async () => ({ Component: (await admin()).AulaPage }) },
  { path: 'lives', lazy: async () => ({ Component: (await admin()).LivesPage }) },
  { path: 'lives/nova', lazy: async () => ({ Component: (await admin()).LivePage }) },
  { path: 'lives/:liveId', lazy: async () => ({ Component: (await admin()).LivePage }) },
  { path: 'avisos', lazy: async () => ({ Component: (await admin()).AvisosPage }) },
  { path: 'avisos/novo', lazy: async () => ({ Component: (await admin()).AvisoPage }) },
  { path: 'avisos/:avisoId', lazy: async () => ({ Component: (await admin()).AvisoPage }) },
]

export const router = createBrowserRouter([
  { path: '/', element: <VendasPage /> },
  { path: '/obrigada', element: <ObrigadaPage /> },
  { path: '/termos', element: <TermosPage /> },
  { path: '/privacidade', element: <PrivacidadePage /> },
  {
    path: '/checkout',
    lazy: async () => ({ Component: (await import('@/features/checkout')).CheckoutPage }),
  },
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
          {
            path: 'admin',
            lazy: async () => ({ Component: (await import('@/features/admin')).PainelLayout }),
            children: rotasAdmin,
          },
        ],
      },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
])
