import { Link } from 'react-router-dom'
import { textos } from '../textos'

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

const botao =
  'grid size-11 place-items-center rounded-xl border border-linha bg-white text-ora disabled:opacity-30'

function Ordem({
  titulo,
  aoSubir,
  aoDescer,
  ocupado,
}: Pick<Props, 'titulo' | 'aoSubir' | 'aoDescer' | 'ocupado'>) {
  return (
    <div className="flex flex-col gap-1">
      <button
        type="button"
        aria-label={`${textos.subir}: ${titulo}`}
        onClick={aoSubir}
        disabled={!aoSubir || ocupado}
        className={botao}
      >
        <span className="mt-1 size-2.5 rotate-45 border-t-2 border-l-2 border-current" />
      </button>
      <button
        type="button"
        aria-label={`${textos.descer}: ${titulo}`}
        onClick={aoDescer}
        disabled={!aoDescer || ocupado}
        className={botao}
      >
        <span className="mb-1 size-2.5 rotate-45 border-r-2 border-b-2 border-current" />
      </button>
    </div>
  )
}

function Situacao({
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
      className={`mt-1 inline-flex min-h-9 items-center gap-2 rounded-full px-3 text-xs font-semibold ${publicado ? 'bg-salvia-suave text-ora' : 'bg-creme text-suave'}`}
    >
      <span className={`size-2 rounded-full ${publicado ? 'bg-salvia' : 'bg-suave/50'}`} />
      {publicado
        ? `${textos.publicado} · ${textos.despublicar}`
        : `${textos.rascunho} · ${textos.publicar}`}
    </button>
  )
}

/** Linha de lista: título (abre a edição), situação, publicar e mudar a ordem. */
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
      <span className="block font-semibold text-ora">{titulo}</span>
      {detalhe && <span className="block text-xs text-suave">{detalhe}</span>}
    </>
  )
  return (
    <li className="flex items-center gap-3 rounded-2xl bg-white p-3">
      <div className="min-w-0 flex-1">
        {para ? (
          <Link to={para} className="block min-h-11 py-1">
            {conteudo}
          </Link>
        ) : (
          <div className="py-1">{conteudo}</div>
        )}
        <Situacao publicado={publicado} aoPublicar={aoPublicar} ocupado={ocupado} />
      </div>
      {(aoSubir || aoDescer) && (
        <Ordem titulo={titulo} aoSubir={aoSubir} aoDescer={aoDescer} ocupado={ocupado} />
      )}
    </li>
  )
}
