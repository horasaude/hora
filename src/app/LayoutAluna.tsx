import { Outlet } from 'react-router-dom'
import { LogoHora } from '@/components/ui'
import { useMeuPerfil, useRegistrarAcesso } from '@/features/auth'
import { PrimeiroAcesso } from '@/features/primeiro-acesso'
import { BarraInferior, BarraLateral } from './NavegacaoAluna'
import { textosAluna as t } from './textosAluna'

/** Área da aluna: barra lateral no computador, barra fixa embaixo no celular, e o primeiro acesso. */
export function LayoutAluna() {
  const perfil = useMeuPerfil()
  useRegistrarAcesso()
  const p = perfil.data
  const falta = p && p.papel !== 'admin' && (!p.apelido || !p.consentimento_saude_em)
  return (
    <div className="min-h-dvh bg-white text-tinta">
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
          <header className="flex h-16 items-center border-b border-linha px-5 sm:px-8 lg:hidden">
            <LogoHora largura={120} />
          </header>
          <main className="px-5 pt-6 pb-28 sm:px-8 lg:ml-[17rem] lg:px-12 lg:pt-12 lg:pb-16">
            <div className="mx-auto max-w-5xl">
              <Outlet />
            </div>
          </main>
          <BarraInferior />
        </>
      )}
    </div>
  )
}
