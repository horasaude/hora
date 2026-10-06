import { useConfiguracaoPublica } from '@/features/configuracao'
import { formatarData } from '@/lib/datas'
import { atualizadoEm, privacidade, termos, type Documento } from '../textos'

/** Texto do banco (editado no painel) quando já chegou; até lá, o texto do código. */
function useDocumento(tipo: 'termos' | 'privacidade', padrao: Documento): Documento {
  const doBanco = useConfiguracaoPublica()?.[tipo]
  if (!doBanco || doBanco.secoes.length === 0) return padrao
  return {
    titulo: padrao.titulo,
    atualizado: atualizadoEm(formatarData(doBanco.atualizado)),
    secoes: doBanco.secoes,
  }
}

function DocumentoPage({ doc }: { doc: Documento }) {
  return (
    <main className="min-h-dvh bg-creme">
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
        <h1 className="mt-10 font-titulo text-5xl text-ora uppercase">{doc.titulo}</h1>
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

export const TermosPage = () => <DocumentoPage doc={useDocumento('termos', termos)} />
export const PrivacidadePage = () => (
  <DocumentoPage doc={useDocumento('privacidade', privacidade)} />
)
