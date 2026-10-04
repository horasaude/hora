import { privacidade, termos, type Documento } from '../textos'

function DocumentoPage({ doc }: { doc: Documento }) {
  return (
    <main className="min-h-dvh bg-white">
      <article className="mx-auto max-w-2xl px-5 py-16">
        <a href="/" className="inline-flex min-h-11 items-center">
          <img
            src="/logo-ora.png"
            alt="ORA, voltar para a página"
            width={482}
            height={189}
            className="h-10 w-auto"
          />
        </a>
        <h1 className="mt-10 font-titulo text-5xl font-semibold text-ora">{doc.titulo}</h1>
        <p className="mt-2 text-sm text-suave">{doc.atualizado}</p>
        {doc.secoes.map((s) => (
          <section key={s.titulo} className="mt-10">
            <h2 className="text-xl font-bold text-ora">{s.titulo}</h2>
            <p className="mt-2 text-lg leading-relaxed text-tinta">{s.texto}</p>
          </section>
        ))}
      </article>
    </main>
  )
}

export const TermosPage = () => <DocumentoPage doc={termos} />
export const PrivacidadePage = () => <DocumentoPage doc={privacidade} />
