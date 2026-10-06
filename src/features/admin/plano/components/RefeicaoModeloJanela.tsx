import { useRef } from 'react'
import { salvarRefeicao, type RefeicaoModelo } from '../api/cardapios.api'
import { useAcaoPlano } from '../hooks/usePlano'
import { lerItens } from '../schemas/plano'
import { tRefeicoes as t } from '../textos2'
import { RefeicaoJanela } from './RefeicaoJanela'

/** Janela da refeição modelo; "Salvar e continuar" em uma nova passa a editar a mesma. */
export function RefeicaoModeloJanela({
  refeicao,
  aoFechar,
}: {
  refeicao?: RefeicaoModelo
  aoFechar: () => void
}) {
  const salvar = useAcaoPlano(salvarRefeicao)
  const id = useRef(refeicao?.id)
  return (
    <RefeicaoJanela
      titulo={refeicao ? t.editar : t.nova}
      inicial={{
        nome: refeicao?.nome ?? '',
        tipo: refeicao?.tipo ?? 'cafe',
        horario: refeicao?.horario?.slice(0, 5) ?? '',
        itens: lerItens(refeicao?.itens),
        texto: '',
        observacao: refeicao?.observacao ?? '',
      }}
      aoSalvar={async (r) => {
        const salva = await salvar.mutateAsync({
          id: id.current,
          nome: r.nome,
          tipo: r.tipo ?? 'cafe',
          horario: r.horario || null,
          observacao: r.observacao,
          itens: r.itens,
        })
        id.current = salva.id
      }}
      aoFechar={aoFechar}
    />
  )
}
