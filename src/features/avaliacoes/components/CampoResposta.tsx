import type { Pergunta } from '@/domain/anamnese'
import { textos } from '../textos'

const opcao = (escolhida: boolean) =>
  `flex min-h-12 w-full items-center rounded-2xl border px-4 text-left text-base transition ${escolhida ? 'border-ora bg-[#EAF5EE] font-bold text-verde-escuro' : 'border-linha bg-white text-tinta'}`

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
    <div role="radiogroup" aria-label={p.texto} className="grid gap-2">
      {opcoes.map(([v, nome]) => (
        <button
          key={v}
          type="button"
          role="radio"
          aria-checked={valor === v}
          onClick={() => aoMudar(v)}
          className={opcao(valor === v)}
        >
          {nome}
        </button>
      ))}
    </div>
  )
}
