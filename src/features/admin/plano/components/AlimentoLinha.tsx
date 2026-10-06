import {
  buscarAlimento,
  duplicarAlimento,
  type Alimento,
  type AlimentoComMedidas,
  type Origem,
} from '../api/alimentos.api'
import { useAcaoPlano } from '../hooks/usePlano'
import { tAlimentos as t, textos } from '../textos'
import { MenuAcoes } from './MenuAcoes'

export type Janela =
  | { tipo: 'novo' }
  | { tipo: 'editar'; alimento: AlimentoComMedidas }
  | { tipo: 'remover'; alimento: Alimento }
  | null

/** Linha da tabela de alimentos: TACO só duplica; os próprios editam, duplicam e removem. */
export function Linha({ a, abrir }: { a: Alimento; abrir: (j: Janela) => void }) {
  const duplicar = useAcaoPlano(duplicarAlimento)
  const editar = async () => abrir({ tipo: 'editar', alimento: await buscarAlimento(a.id) })
  const proprio = a.origem === 'proprio'
  return (
    <tr
      className={`border-b border-[#F4F5F4] last:border-b-0 ${proprio ? 'cursor-pointer hover:bg-[#F8FAF9]' : ''}`}
      onClick={proprio ? editar : undefined}
    >
      <td className="px-3.5 py-3 font-bold text-tinta">{a.nome}</td>
      <td className="px-3.5 py-3 text-suave">{a.grupo}</td>
      <td className="px-3.5 py-3">{a.kcal === null ? '-' : Math.round(a.kcal)}</td>
      <td className="w-12 px-2 py-2">
        <MenuAcoes
          nome={a.nome}
          acoes={[
            ...(proprio ? [{ nome: textos.editar, aoEscolher: editar }] : []),
            { nome: textos.duplicar, aoEscolher: () => duplicar.mutate(a.id) },
            ...(proprio
              ? [
                  {
                    nome: textos.remover,
                    perigo: true,
                    aoEscolher: () => abrir({ tipo: 'remover', alimento: a }),
                  },
                ]
              : []),
          ]}
        />
      </td>
    </tr>
  )
}

/** Abas Meus alimentos e TACO. */
export function Abas({ origem, aoMudar }: { origem: Origem; aoMudar: (o: Origem) => void }) {
  return (
    <div role="tablist" aria-label={t.titulo} className="flex gap-1.5">
      {(['proprio', 'taco'] as const).map((o) => (
        <button
          key={o}
          type="button"
          role="tab"
          aria-selected={origem === o}
          onClick={() => aoMudar(o)}
          className={`min-h-9 rounded-full px-4 text-[13px] font-bold ${origem === o ? 'brilho brilho-verde' : 'border border-[#ECEFED] bg-white text-suave hover:bg-trilho'}`}
        >
          {t.abas[o]}
        </button>
      ))}
    </div>
  )
}
