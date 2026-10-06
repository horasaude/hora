/** Botão liga/desliga; ligado fica em vidro verde. */
export function Interruptor({
  ligado,
  rotulo,
  aoMudar,
  ocupado,
}: {
  ligado: boolean
  rotulo: string
  aoMudar: () => void
  ocupado?: boolean
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={ligado}
      aria-label={rotulo}
      disabled={ocupado}
      onClick={(e) => {
        e.stopPropagation()
        aoMudar()
      }}
      className={`relative h-6 w-11 shrink-0 rounded-full transition disabled:opacity-50 ${ligado ? 'brilho brilho-verde' : 'bg-[#D5DBD8]'}`}
    >
      <span
        className={`absolute top-0.5 size-5 rounded-full bg-white shadow transition-all ${ligado ? 'left-[22px]' : 'left-0.5'}`}
      />
    </button>
  )
}
