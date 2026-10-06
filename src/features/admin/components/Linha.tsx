import { Link } from 'react-router-dom'
import { textos } from '../textos'
import { Ordem } from './Ordem'

type Props = {
  titulo: string
  detalhe?: string
  publicado: boolean
  para?: string
  aoPublicar: () => void
  aoSubir?: () => void
  aoDescer?: () => void
  ocupado?: boolean
}

/** Etiqueta de situação que também publica ou tira do ar ao clicar. */
export function BotaoSituacao({
  publicado,
  aoPublicar,
  ocupado,
}: Pick<Props, 'publicado' | 'aoPublicar' | 'ocupado'>) {
  return (
    <button
      type="button"
      onClick={aoPublicar}
      disabled={ocupado}
      aria-pressed={publicado}
      title={publicado ? textos.despublicar : textos.publicar}
      className={`inline-flex min-h-8 items-center rounded-full px-3 text-xs font-semibold whitespace-nowrap disabled:opacity-50 ${publicado ? 'bg-salvia-suave text-ora' : 'bg-ocre-suave text-[#80591c]'}`}
    >
      {publicado
        ? `${textos.publicado} · ${textos.despublicar}`
        : `${textos.rascunho} · ${textos.publicar}`}
    </button>
  )
}

/** Linha compacta dentro do cartão: título (abre a edição), situação e ordem. */
export function Linha({
  titulo,
  detalhe,
  publicado,
  para,
  aoPublicar,
  aoSubir,
  aoDescer,
  ocupado,
}: Props) {
  const conteudo = (
    <>
      <span className="block text-sm font-semibold text-tinta">{titulo}</span>
      {detalhe && <span className="block text-xs text-suave">{detalhe}</span>}
    </>
  )
  return (
    <li className="flex flex-col gap-1 py-2">
      {para ? (
        <Link to={para} className="block py-1 hover:underline">
          {conteudo}
        </Link>
      ) : (
        <div className="py-1">{conteudo}</div>
      )}
      <div className="flex items-center justify-between gap-2">
        <BotaoSituacao publicado={publicado} aoPublicar={aoPublicar} ocupado={ocupado} />
        {(aoSubir || aoDescer) && (
          <Ordem titulo={titulo} aoSubir={aoSubir} aoDescer={aoDescer} ocupado={ocupado} />
        )}
      </div>
    </li>
  )
}
