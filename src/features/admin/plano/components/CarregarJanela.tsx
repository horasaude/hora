import { useState } from 'react'
import { BotaoBrilho, Janela } from '@/components/ui'
import { useCardapios, useRefeicoes } from '../hooks/usePlano'
import { textos, TIPOS_REFEICAO } from '../textos'
import { CampoBusca } from './Ferramentas'

type Opcao = { id: string; nome: string; detalhe: string }

function Lista({ opcoes, aoEscolher }: { opcoes: Opcao[]; aoEscolher: (id: string) => void }) {
  if (opcoes.length === 0) return <p className="text-[13px] text-suave">{textos.semResultado}</p>
  return (
    <ul className="flex max-h-[50vh] flex-col overflow-y-auto rounded-xl border border-[#ECEFED]">
      {opcoes.map((o) => (
        <li key={o.id} className="border-b border-[#F4F5F4] last:border-b-0">
          <button
            type="button"
            onClick={() => aoEscolher(o.id)}
            className="flex w-full justify-between gap-3 px-3.5 py-2.5 text-left text-[13px] hover:bg-[#F8FAF9]"
          >
            <span className="font-bold text-tinta">{o.nome}</span>
            <span className="text-suave">{o.detalhe}</span>
          </button>
        </li>
      ))}
    </ul>
  )
}

type Props = {
  titulo: string
  tipo: 'modelo' | 'cardapio'
  aviso?: string
  aoEscolher: (id: string) => void
  aoFechar: () => void
}

/** Escolher uma refeição modelo ou um cardápio salvo para carregar. */
export function CarregarJanela({ titulo, tipo, aviso, aoEscolher, aoFechar }: Props) {
  const [busca, setBusca] = useState('')
  const modelos = useRefeicoes(tipo === 'modelo' ? busca : '', '')
  const cardapios = useCardapios(tipo === 'cardapio' ? busca : '', '')
  const opcoes: Opcao[] =
    tipo === 'modelo'
      ? (modelos.data ?? []).map((m) => ({
          id: m.id,
          nome: m.nome,
          detalhe: TIPOS_REFEICAO[m.tipo],
        }))
      : (cardapios.data ?? []).map((c) => ({ id: c.id, nome: c.titulo, detalhe: c.objetivo }))
  return (
    <Janela
      titulo={titulo}
      aoFechar={aoFechar}
      rotuloFechar={textos.fechar}
      rodape={
        <BotaoBrilho tom="cinza" onClick={aoFechar}>
          {textos.cancelar}
        </BotaoBrilho>
      }
    >
      <div className="flex flex-col gap-3">
        {aviso && <p className="text-[13px] text-[#B87508]">{aviso}</p>}
        <CampoBusca valor={busca} aoMudar={setBusca} />
        <Lista
          opcoes={opcoes}
          aoEscolher={(id) => {
            aoEscolher(id)
            aoFechar()
          }}
        />
      </div>
    </Janela>
  )
}
