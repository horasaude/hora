import type { RouteObject } from 'react-router-dom'
import { AulaAntiga } from './AulaAntiga'

// Área da aluna (/app): moldura com a barra de baixo; cada tela carrega sob demanda.
const trilha = () => import('@/features/trilha')
const forum = () => import('@/features/forum')
const loja = () => import('@/features/loja')
const desafiosAluna = () => import('@/features/desafios')
const cardapios = () => import('@/features/cardapios')

export const rotasAluna: RouteObject[] = [
  {
    index: true,
    lazy: async () => ({ Component: (await import('@/features/inicio')).InicioPage }),
  },
  { path: 'trilha', lazy: async () => ({ Component: (await trilha()).TrilhaPage }) },
  { path: 'trilha/aula/:aulaId', lazy: async () => ({ Component: (await trilha()).AulaPage }) },
  { path: 'aula/:aulaId', Component: AulaAntiga },
  { path: 'cardapios', lazy: async () => ({ Component: (await cardapios()).CardapiosPage }) },
  {
    path: 'cardapios/receitas/:receitaId',
    lazy: async () => ({ Component: (await cardapios()).ReceitaPage }),
  },
  {
    path: 'cardapios/:cardapioId',
    lazy: async () => ({ Component: (await cardapios()).CardapioPage }),
  },
  {
    path: 'cardapios/:cardapioId/compras',
    lazy: async () => ({ Component: (await cardapios()).ListaComprasPage }),
  },
  {
    path: 'lives',
    lazy: async () => ({ Component: (await import('@/features/lives')).LivesPage }),
  },
  { path: 'desafios', lazy: async () => ({ Component: (await desafiosAluna()).DesafiosPage }) },
  {
    path: 'desafios/:desafioId',
    lazy: async () => ({ Component: (await desafiosAluna()).DesafioPage }),
  },
  {
    path: 'ranking',
    lazy: async () => ({ Component: (await import('@/features/ranking')).RankingPage }),
  },
  { path: 'forum', lazy: async () => ({ Component: (await forum()).ForumPage }) },
  { path: 'loja', lazy: async () => ({ Component: (await loja()).LojaPage }) },
  { path: 'loja/:produtoId', lazy: async () => ({ Component: (await loja()).ProdutoPage }) },
  { path: 'forum/:duvidaId', lazy: async () => ({ Component: (await forum()).DuvidaPage }) },
  {
    path: 'perfil',
    lazy: async () => ({ Component: (await import('@/features/perfil')).PerfilPage }),
  },
  {
    path: 'perfil/conta',
    lazy: async () => ({ Component: (await import('@/features/perfil')).ContaPage }),
  },
]
