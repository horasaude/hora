import { Link } from 'react-router-dom'
import { textos } from '../textos'
import { Secao } from './Secao'

export function Garantia() {
  const t = textos.garantia
  return (
    <Secao titulo={t.titulo}>
      <p className="text-lg">{t.texto}</p>
      <div className="mt-8 border-l-4 border-ocre pl-4">
        <p className="font-semibold text-tinta">{t.fidelidadeTitulo}</p>
        <p className="mt-1 text-suave">{t.fidelidadeTexto}</p>
      </div>
    </Secao>
  )
}

export function Perguntas() {
  const t = textos.perguntas
  return (
    <Secao titulo={t.titulo} fundo="areia">
      <div className="flex flex-col">
        {t.itens.map((item) => (
          <details key={item.p} className="group border-b border-linha py-4">
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 font-semibold text-tinta">
              {item.p}
              <span aria-hidden="true" className="text-xl text-salvia group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="mt-2 text-suave">{item.r}</p>
          </details>
        ))}
      </div>
    </Secao>
  )
}

export function Rodape() {
  const t = textos.rodape
  return (
    <footer className="bg-ora px-4 py-10 text-sm text-white/80">
      <div className="mx-auto flex max-w-2xl flex-col gap-3">
        <p className="font-titulo text-xl text-white">{t.marca}</p>
        <p>{t.cnpj}</p>
        <nav className="flex flex-wrap gap-x-6">
          <Link to="/termos" className="inline-flex min-h-11 items-center underline">
            {t.termos}
          </Link>
          <Link to="/privacidade" className="inline-flex min-h-11 items-center underline">
            {t.privacidade}
          </Link>
        </nav>
        <p>{t.direitos}</p>
      </div>
    </footer>
  )
}
