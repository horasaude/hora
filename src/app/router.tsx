import { createBrowserRouter, Navigate, type RouteObject } from 'react-router-dom'
import { ObrigadaPage, PrivacidadePage, TermosPage, VendasPage } from '@/features/vendas'
import { rotasAluna } from './rotasAluna'
import { TelaErro } from './TelaErro'

// Só a página de vendas entra no pacote inicial. Login e área da aluna (Supabase, React Query)
// carregam sob demanda, para quem vem do anúncio no celular baixar o mínimo.
const admin = () => import('@/features/admin')

// Painel das profissionais (/app/admin): só papel admin; tudo carrega sob demanda.
const conteudo = async () => ({ Component: (await admin()).ConteudoPage })
const lives = async () => ({ Component: (await admin()).LivesPage })
const avisos = async () => ({ Component: (await admin()).AvisosPage })
const pagina =
  (
    nome:
      | 'CardapiosPage'
      | 'CardapioPage'
      | 'RefeicoesPage'
      | 'ReceitasPage'
      | 'ReceitaPage'
      | 'AlimentosPage'
      | 'MateriaisPage'
      | 'SaudeMateriaisPage'
      | 'SaudeAnamnesePage'
      | 'PontosPage'
      | 'ForumPainelPage'
      | 'DuvidaPainelPage'
      | 'EquipePage'
      | 'LojaPage'
      | 'TreinosPainelPage'
      | 'ExerciciosPage'
      | 'ModelosPage'
      | 'PublicadosPage'
      | 'AnamnesesPage'
      | 'CancelamentosPage',
  ) =>
  async () => ({
    Component: (await admin())[nome],
  })
const desafios = async () => ({ Component: (await admin()).DesafiosPage })
const alunas = async () => ({ Component: (await admin()).AlunasPage })
const configuracoes = async () => ({ Component: (await admin()).ConfiguracoesPage })
const vazio = (modulo: 'financeiro') => async () => {
  const { ModuloVazioPage } = await admin()
  return { Component: () => <ModuloVazioPage modulo={modulo} /> }
}
// O detalhe abre num cartão ao lado da lista, então cada endereço mostra a mesma tela.
const rotasAdmin: RouteObject[] = [
  { index: true, element: <Navigate to="conteudo" replace /> },
  ...['conteudo', 'conteudo/:temaId', 'aulas/nova', 'aulas/:aulaId'].map((path) => ({
    path,
    lazy: conteudo,
  })),
  ...['lives', 'lives/nova', 'lives/:liveId'].map((path) => ({ path, lazy: lives })),
  ...['avisos', 'avisos/novo', 'avisos/:avisoId'].map((path) => ({ path, lazy: avisos })),
  { path: 'cardapios/*', element: <Navigate to="/app/admin/plano/cardapios" replace /> },
  { path: 'plano', element: <Navigate to="cardapios" replace /> },
  { path: 'plano/cardapios', lazy: pagina('CardapiosPage') },
  { path: 'plano/cardapios/novo', lazy: pagina('CardapioPage') },
  { path: 'plano/cardapios/:cardapioId', lazy: pagina('CardapioPage') },
  { path: 'plano/refeicoes', lazy: pagina('RefeicoesPage') },
  { path: 'plano/receitas', lazy: pagina('ReceitasPage') },
  { path: 'plano/receitas/nova', lazy: pagina('ReceitaPage') },
  { path: 'plano/receitas/:receitaId', lazy: pagina('ReceitaPage') },
  { path: 'plano/alimentos', lazy: pagina('AlimentosPage') },
  ...['plano/materiais', 'plano/materiais/novo', 'plano/materiais/:materialId'].map((path) => ({
    path,
    lazy: pagina('MateriaisPage'),
  })),
  ...['treinos', 'treinos/novo'].map((path) => ({ path, lazy: pagina('TreinosPainelPage') })),
  { path: 'treinos/exercicios', lazy: pagina('ExerciciosPage') },
  { path: 'treinos/modelos', lazy: pagina('ModelosPage') },
  { path: 'treinos/publicados', lazy: pagina('PublicadosPage') },
  { path: 'treinos/anamnese', lazy: pagina('AnamnesesPage') },
  { path: 'saude', element: <Navigate to="materiais" replace /> },
  ...['saude/materiais', 'saude/materiais/novo', 'saude/materiais/:materialId'].map((path) => ({
    path,
    lazy: pagina('SaudeMateriaisPage'),
  })),
  { path: 'saude/anamnese', lazy: pagina('SaudeAnamnesePage') },
  ...['desafios', 'desafios/novo', 'desafios/:desafioId'].map((path) => ({ path, lazy: desafios })),
  ...['alunas', 'alunas/:alunaId'].map((path) => ({ path, lazy: alunas })),
  { path: 'cancelamentos', lazy: pagina('CancelamentosPage') },
  { path: 'configuracoes/equipe', lazy: pagina('EquipePage') },
  ...['configuracoes', 'configuracoes/:item'].map((path) => ({ path, lazy: configuracoes })),
  { path: 'pontos', lazy: pagina('PontosPage') },
  { path: 'forum', lazy: pagina('ForumPainelPage') },
  { path: 'forum/:duvidaId', lazy: pagina('DuvidaPainelPage') },
  { path: 'loja', lazy: pagina('LojaPage') },
  { path: 'loja/:produtoId', lazy: pagina('LojaPage') },
  ...(['financeiro'] as const).map((m) => ({ path: m, lazy: vazio(m) })),
]

export const router = createBrowserRouter([
  {
    // Erro inesperado ao carregar (ex.: versão nova no ar): tela com Recarregar em vez de página em branco.
    errorElement: <TelaErro tipo="geral" />,
    children: [
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
            path: '/definir-senha',
            lazy: async () => ({ Component: (await import('@/features/auth')).DefinirSenhaPage }),
          },
          {
            path: '/app',
            lazy: async () => ({ Component: (await import('./AreaAluna')).AreaAluna }),
            children: [
              {
                lazy: async () => ({ Component: (await import('./LayoutAluna')).LayoutAluna }),
                children: rotasAluna,
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
    ],
  },
])
