import { linkWhatsApp } from '@/lib/whatsapp'
import { WHATSAPP_SUPORTE } from '@/lib/contato'

const TEXTOS = {
  config: {
    titulo: 'O ORA está em manutenção',
    texto: 'Já estamos resolvendo. Tente de novo em alguns minutos.',
  },
  geral: {
    titulo: 'Algo não carregou direito',
    texto: 'Pode ser a internet oscilando ou uma versão nova do ORA chegando.',
  },
  recarregar: 'Recarregar',
  suporte: 'Falar com o suporte',
}

/** Tela simples no lugar da página em branco: falta de configuração ou erro inesperado ao carregar. */
export function TelaErro({ tipo }: { tipo: 'config' | 'geral' }) {
  const t = TEXTOS[tipo]
  const whats = linkWhatsApp(WHATSAPP_SUPORTE, 'Oi! O ORA não abriu para mim.')
  return (
    <main className="grid min-h-dvh place-items-center bg-white px-6 font-sistema">
      <div className="flex max-w-sm flex-col items-center gap-4 text-center">
        <img src="/logo-ora.svg" alt="ORA" className="h-12 w-auto" />
        <h1 className="text-2xl font-bold text-verde-escuro">{t.titulo}</h1>
        <p className="text-base text-suave">{t.texto}</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="brilho brilho-verde inline-flex min-h-10 items-center rounded-full px-6 text-sm font-bold"
        >
          {TEXTOS.recarregar}
        </button>
        {whats && (
          <a
            href={whats}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-bold text-ora underline"
          >
            {TEXTOS.suporte}
          </a>
        )}
      </div>
    </main>
  )
}
