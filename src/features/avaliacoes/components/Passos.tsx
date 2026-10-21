import { textos } from '../textos'

/** Barrinhas do topo: uma por pergunta, verdes até a pergunta atual. */
export function Passos({ total, feitos }: { total: number; feitos: number }) {
  const pct = total > 0 ? Math.round((feitos / total) * 100) : 0
  return (
    <div
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={textos.progresso}
      className="flex gap-1"
    >
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={`h-[5px] flex-1 rounded-full ${i < feitos ? 'bg-verde-vivo' : 'bg-trilho'}`}
        />
      ))}
    </div>
  )
}

export function IconeSalvo() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className="size-4 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 4h11l3 3v13H5zM8 4v5h7V4M8 20v-6h8v6" />
    </svg>
  )
}
