import { linkWhatsApp } from '@/lib/whatsapp'
import { Destaque } from '../components/Destaque'
import { textos } from '../textos'

const t = textos.compra.obrigada

/** Para onde o Mercado Pago devolve depois do pagamento (back_url de cada link). */
export function ObrigadaPage() {
  const whats = linkWhatsApp(import.meta.env.VITE_WHATSAPP_NUMERO, textos.whatsapp.mensagem)
  return (
    <main className="min-h-dvh bg-areia">
      <div className="mx-auto max-w-2xl px-5 py-16 sm:py-24">
        <img src="/logo-ora.png" alt="ORA" width={482} height={189} className="h-12 w-auto" />
        <h1 className="mt-12 font-titulo text-5xl leading-[1.02] font-semibold text-ora sm:text-6xl">
          <Destaque texto={t.titulo} />
        </h1>
        <ol className="mt-10 flex flex-col">
          {t.passos.map((passo, i) => (
            <li key={passo} className="flex gap-5 border-t border-linha py-5 text-lg text-tinta">
              <span className="font-titulo text-3xl leading-none font-semibold text-terracota">
                {i + 1}
              </span>
              {passo}
            </li>
          ))}
        </ol>
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
