import { Cartao } from '@/components/ui'
import { useLembreteAgua } from '../hooks/useLembrete'
import { usePreferenciasPush } from '../hooks/useNotificacoes'
import { textos } from '../textos'

const t = textos.notificacoes

function Opcao({
  rotulo,
  ligada,
  mudar,
}: {
  rotulo: string
  ligada: boolean
  mudar: (v: boolean) => void
}) {
  return (
    <label className="flex min-h-10 items-center justify-between gap-3 text-sm text-tinta">
      {rotulo}
      <input
        type="checkbox"
        checked={ligada}
        onChange={(e) => mudar(e.target.checked)}
        className="size-5 accent-[#2c4c44]"
      />
    </label>
  )
}

/** Minha conta: ativar as notificações neste celular e escolher água e lives. */
export function Notificacoes() {
  const l = useLembreteAgua()
  const { prefs, salvar } = usePreferenciasPush()
  if (!l.suporta) return null
  return (
    <Cartao className="flex flex-col gap-3 font-sistema">
      <h2 className="text-lg font-bold text-verde-escuro">{t.titulo}</h2>
      {l.instalar ? (
        <p className="text-sm text-suave">{textos.lembrete.instalar}</p>
      ) : !l.ligado || !prefs ? (
        <button
          type="button"
          disabled={l.ligar.isPending}
          onClick={() => l.ligar.mutate()}
          className="brilho brilho-verde inline-flex min-h-9 items-center self-start rounded-full px-4 text-[13px] font-bold"
        >
          {t.ativar}
        </button>
      ) : (
        <div className="flex flex-col divide-y divide-linha">
          <Opcao
            rotulo={t.agua}
            ligada={Boolean(prefs.lembrete_agua)}
            mudar={(v) => salvar.mutate({ lembrete_agua: v })}
          />
          <Opcao
            rotulo={t.live}
            ligada={Boolean(prefs.lembrete_live)}
            mudar={(v) => salvar.mutate({ lembrete_live: v })}
          />
        </div>
      )}
      {l.ligar.isError && <p className="text-sm text-terracota-escuro">{textos.lembrete.negado}</p>}
    </Cartao>
  )
}
