import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { LogoOra } from '@/components/ui'
import { useMeuPerfil, useRegistrarAcesso } from '@/features/auth'
import { PrimeiroAcesso } from '@/features/primeiro-acesso'
import { AbasDaSecao, BarraInferior, BarraLateral } from './NavegacaoAluna'
import { textosAluna as t } from './textosAluna'

/** Área da aluna: barra lateral no computador, barra fixa embaixo no celular, e o primeiro acesso.
 * Conta de profissional vai direto para o painel; daqui só abre a prévia (Ver como aluna do painel).
 * A conta de desenvolvedora passa livre entre os dois. */
export function LayoutAluna() {
  const perfil = useMeuPerfil()
  const { pathname } = useLocation()
  useRegistrarAcesso()
  const p = perfil.data
  if (p?.papel === 'admin' && !p.desenvolvedora && !pathname.startsWith('/app/previa'))
    return <Navigate to="/app/admin" replace />
  const falta = p && p.papel !== 'admin' && (!p.apelido || !p.consentimento_saude_em)
  return (
    <div className="flex h-dvh flex-col bg-white text-tinta lg:block lg:h-auto lg:min-h-dvh">
      {perfil.isPending ? (
        <p role="status" className="p-6 text-center text-sm text-suave">
          {t.carregando}
        </p>
      ) : perfil.isError ? (
        <div role="alert" className="p-6 text-center text-sm">
          <p>{t.erro}</p>
          <button
            type="button"
            onClick={() => perfil.refetch()}
            className="mt-2 min-h-11 font-semibold text-ora underline"
          >
            {t.tentar}
          </button>
        </div>
      ) : falta ? (
        <div className="min-h-dvh lg:py-px">
          <PrimeiroAcesso apelidoAtual={p.apelido} />
        </div>
      ) : (
        <>
          <BarraLateral nome={p?.apelido || p?.nome || ''} />
          {/* No celular o conteúdo rola nesta área e a barra de baixo fica fora dela, sem position
              fixed (no iPhone, o fixo saía do lugar ao puxar o fim da página). */}
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain lg:overflow-visible">
            <header className="flex h-16 items-center border-b border-linha px-5 sm:px-8 lg:hidden">
              <LogoOra largura={120} />
            </header>
            <main className="px-5 pt-6 pb-8 sm:px-8 lg:ml-[17rem] lg:px-12 lg:pt-12 lg:pb-16">
              <div className="mx-auto max-w-5xl">
                <AbasDaSecao />
                <Outlet />
              </div>
            </main>
          </div>
          <BarraInferior />
        </>
      )}
    </div>
  )
}
