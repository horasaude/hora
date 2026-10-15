import { useLembreteAgua } from '../hooks/useLembrete'
import { textos } from '../textos'

const t = textos.lembrete

/** Ligar ou desligar o lembrete de beber água no celular. */
export function LembreteAgua() {
  const l = useLembreteAgua()
  if (!l.suporta) return null
  if (l.instalar) return <p className="text-xs text-suave">{t.instalar}</p>
  const ocupado = l.ligar.isPending || l.desligar.isPending
  return (
    <div className="flex flex-wrap items-center gap-2 text-xs">
      {l.ligado ? (
        <>
          <span className="font-bold text-[#2F7DB8]">{t.ligado}</span>
          <button
            type="button"
            disabled={ocupado}
            onClick={() => l.desligar.mutate()}
            className="text-suave underline"
          >
            {t.desligar}
          </button>
        </>
      ) : (
        <button
          type="button"
          disabled={ocupado}
          onClick={() => l.ligar.mutate()}
          className="inline-flex min-h-8 items-center rounded-full border border-[#4A9BD8] bg-white px-3 font-bold text-[#2F7DB8]"
        >
          {t.ligar}
        </button>
      )}
      {l.ligar.isError && <span className="w-full text-terracota-escuro">{t.negado}</span>}
    </div>
  )
}
