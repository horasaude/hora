import { Link } from 'react-router-dom'
import { Cartao, classeBrilho } from '@/components/ui'
import { useMeuPerfil, useSair } from '@/features/auth'
import { textos } from '../textos'

/** Perfil: nome e apelido; atalho do painel para admin; sair. Edição chega numa próxima etapa. */
export function PerfilPage() {
  const perfil = useMeuPerfil()
  const sair = useSair()
  const p = perfil.data
  return (
    <section className="flex flex-col gap-4 lg:max-w-lg">
      <h1 className="text-[28px] leading-tight font-bold text-verde-escuro lg:text-[30px]">
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
        <Link to="/app/admin" className={`${classeBrilho('escuro', 'lg')} self-start`}>
          {textos.painel}
        </Link>
      )}
      <button
        type="button"
        onClick={() => sair.mutate()}
        disabled={sair.isPending}
        className={`${classeBrilho('cinza', 'lg')} self-start`}
      >
        {sair.isPending ? textos.saindo : textos.sair}
      </button>
    </section>
  )
}
