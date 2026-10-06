import { useState } from 'react'
import { Janela } from '@/components/ui'
import type { Item } from '@/domain/nutricao'
import type { TipoRefeicao } from '../api/cardapios.api'
import { textos } from '../textos'
import { CamposConteudo, CamposTopo, RodapeRefeicao } from './RefeicaoCampos'

export type Rascunho = {
  nome: string
  tipo?: TipoRefeicao
  horario: string
  itens: Item[]
  texto: string
  observacao: string
}

type Props = {
  titulo: string
  inicial: Rascunho
  textoLivre?: boolean
  semHorario?: boolean
  aoSalvar: (r: Rascunho) => Promise<void> | void
  aoFechar: () => void
}

/** Janela da refeição: descrição, tipo (no modelo), horário, alimentos ou texto e observação. */
export function RefeicaoJanela({
  titulo,
  inicial,
  textoLivre,
  semHorario,
  aoSalvar,
  aoFechar,
}: Props) {
  const [r, setR] = useState(inicial)
  const [estado, setEstado] = useState<'' | 'salvando' | 'salvo' | 'erro' | 'nome'>('')
  const mudar = (p: Partial<Rascunho>) => {
    setR((x) => ({ ...x, ...p }))
    setEstado('')
  }
  const salvar = async (fechar: boolean) => {
    if (!r.nome.trim()) return setEstado('nome')
    setEstado('salvando')
    try {
      await aoSalvar({ ...r, nome: r.nome.trim() })
      if (fechar) aoFechar()
      else setEstado('salvo')
    } catch {
      setEstado('erro')
    }
  }
  return (
    <Janela
      larga
      titulo={titulo}
      aoFechar={aoFechar}
      rotuloFechar={textos.fechar}
      rodape={
        <RodapeRefeicao
          salvo={estado === 'salvo'}
          ocupado={estado === 'salvando'}
          aoCancelar={aoFechar}
          aoSalvar={salvar}
        />
      }
    >
      <div className="flex flex-col gap-5">
        <CamposTopo r={r} mudar={mudar} semHorario={semHorario} erroNome={estado === 'nome'} />
        <CamposConteudo r={r} mudar={mudar} textoLivre={textoLivre} />
        {estado === 'erro' && (
          <p role="alert" className="text-sm text-terracota-escuro">
            {textos.erro}
          </p>
        )}
      </div>
    </Janela>
  )
}
