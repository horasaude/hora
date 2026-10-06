import { Link } from 'react-router-dom'
import { Cartao } from '@/components/ui'
import { useMeuPerfil, useSair } from '@/features/auth'
import { textos } from '../textos'

/** Perfil: nome e apelido; atalho do painel para admin; sair. Edição chega numa próxima etapa. */
export function PerfilPage() {
  const perfil = useMeuPerfil()
  const sair = useSair()
  const p = perfil.data
  return (
    <section className="flex flex-col gap-4 lg:max-w-lg">
      <h1 className="text-[1.9rem] leading-tight font-bold tracking-tight text-ora lg:text-[2.6rem]">
        {textos.titulo}
      </h1>
      <Cartao>
        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
          <dt className="text-suave">{textos.nome}</dt>
          <dd className="text-tinta">{p?.nome}</dd>
          <dt className="text-suave">{textos.apelido}</dt>
          <dd className="text-tinta">{p?.apelido}</dd>
        </dl>
      </Cartao>
      {p?.papel === 'admin' && (
        <Link
          to="/app/admin"
          className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-ora text-sm font-semibold text-white"
        >
          {textos.painel}
        </Link>
      )}
      <button
        type="button"
        onClick={() => sair.mutate()}
        disabled={sair.isPending}
        className="min-h-12 rounded-2xl border border-linha text-sm font-semibold text-tinta"
      >
        {sair.isPending ? textos.saindo : textos.sair}
      </button>
    </section>
  )
}
