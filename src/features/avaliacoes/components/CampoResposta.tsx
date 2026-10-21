import { IconeCheck } from '@/components/ui'
import type { Pergunta } from '@/domain/anamnese'
import { textos } from '../textos'

const opcao = (escolhida: boolean) =>
  `flex min-h-14 w-full items-center gap-3 rounded-[18px] border-[1.5px] p-4 text-left text-[15px] font-bold transition ${escolhida ? 'border-verde-vivo bg-[#e2f4eb] text-verde-escuro' : 'border-linha bg-white text-tinta hover:border-verde-vivo/60'}`

/** Bolinha da opção: vazia, ou verde com o check quando escolhida. */
function Bolinha({ escolhida }: { escolhida: boolean }) {
  return (
    <span
      aria-hidden
      className={`grid size-5 shrink-0 place-items-center rounded-full border-2 ${escolhida ? 'border-verde-vivo bg-verde-vivo text-white' : 'border-linha'}`}
    >
      {escolhida && <IconeCheck className="size-3" />}
    </span>
  )
}

/** Resposta de uma pergunta: texto livre, Sim ou Não, ou uma das opções. */
export function CampoResposta({
  p,
  valor,
  aoMudar,
}: {
  p: Pergunta
  valor: string
  aoMudar: (v: string) => void
}) {
  if (p.tipo === 'texto')
    return (
      <textarea
        aria-label={p.texto}
        value={valor}
        maxLength={1000}
        rows={4}
        placeholder={textos.escreva}
        onChange={(e) => aoMudar(e.target.value)}
        className="w-full rounded-2xl border border-linha bg-white px-4 py-3 text-base focus:border-ora focus:outline-none"
      />
    )
  const opcoes: [string, string][] =
    p.tipo === 'sim_nao'
      ? [
          ['sim', textos.sim],
          ['nao', textos.nao],
        ]
      : p.opcoes.map((o) => [o, o])
  return (
    <div role="radiogroup" aria-label={p.texto} className="grid gap-2.5">
      {opcoes.map(([v, nome]) => (
        <button
          key={v}
          type="button"
          role="radio"
          aria-checked={valor === v}
          onClick={() => aoMudar(v)}
          className={opcao(valor === v)}
        >
          <Bolinha escolhida={valor === v} />
          {nome}
        </button>
      ))}
    </div>
  )
}
