import { linkWhatsApp } from '@/lib/whatsapp'
import { Destaque } from '../components/Destaque'
import { useSituacaoPedido, type Fase } from '../hooks/useSituacaoPedido'
import { textos } from '../textos'

const t = textos.compra.obrigada

function Passos({ itens }: { itens: readonly string[] }) {
  return (
    <ol className="mt-10 flex flex-col">
      {itens.map((passo, i) => (
        <li key={passo} className="flex gap-5 border-t border-linha py-5 text-lg text-tinta">
          <span className="font-titulo text-4xl leading-none text-salvia">{i + 1}</span>
          {passo}
        </li>
      ))}
    </ol>
  )
}

function Conteudo({ fase }: { fase: Fase }) {
  if (fase === 'pendente' || fase === 'recusado') {
    const pendente = fase === 'pendente'
    return (
      <>
        <h1 className="mt-12 text-5xl text-ora sm:text-6xl">
          <Destaque texto={pendente ? t.pendenteTitulo : t.recusadoTitulo} />
        </h1>
        <p role="status" className="mt-8 text-lg text-tinta">
          {pendente ? t.pendente : t.recusado}
        </p>
        {!pendente && (
          <a
            href="/checkout"
            className="mt-6 inline-flex min-h-11 items-center font-semibold text-ora underline"
          >
            {t.tentar}
          </a>
        )}
      </>
    )
  }
  return (
    <>
      <h1 className="mt-12 text-6xl text-ora sm:text-7xl">
        <Destaque texto={t.titulo} />
      </h1>
      <Passos itens={fase === 'aprovado' ? t.aprovado : t.passos} />
    </>
  )
}

/** Depois do pagamento: mostra a situação real do pedido (?pedido=) ou os próximos passos. */
export function ObrigadaPage() {
  const fase = useSituacaoPedido()
  const whats = linkWhatsApp(import.meta.env.VITE_WHATSAPP_NUMERO, textos.whatsapp.mensagem)
  return (
    <main className="min-h-dvh bg-creme">
      <div className="mx-auto max-w-2xl px-5 py-16 sm:py-24">
        <img src="/logo-ora.png" alt="ORA" width={482} height={189} className="h-12 w-auto" />
        <Conteudo fase={fase} />
        {whats && (
          <p className="mt-8 text-lg text-tinta">
            {t.duvida}{' '}
            <a href={whats} className="font-semibold text-ora underline underline-offset-2">
              {textos.whatsapp.rotulo}
            </a>
          </p>
        )}
        <a href="/" className="mt-10 inline-flex min-h-11 items-center text-suave underline">
          {t.voltar}
        </a>
      </div>
    </main>
  )
}
