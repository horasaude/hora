import { createBrowserRouter, Navigate } from 'react-router-dom'
import { LoginPage, RotaProtegida } from '@/features/auth'
import { InicioPage } from '@/features/inicio'

export const router = createBrowserRouter([
  { path: '/entrar', element: <LoginPage /> },
  {
    element: <RotaProtegida />,
    children: [{ path: '/', element: <InicioPage /> }],
  },
  { path: '*', element: <Navigate to="/" replace /> },
])
