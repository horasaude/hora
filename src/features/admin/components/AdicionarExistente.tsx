import { useState, type ReactNode } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { BotaoBrilho, Janela } from '@/components/ui'
import { listarCardapios } from '../plano/api/cardapios.api'
import { listarTreinos } from '../treinos/api/treinos.api'
import { usarCardapio, usarTreino } from '../api/usarExistente.api'
import { useTemas } from '../hooks/usePainel'
import { doTema as t } from '../textos/doTema'

type Item = { id: string; titulo: string; tema_id: string | null }
type Props = { temaId: string; aoFechar: () => void; criar: ReactNode }

const semAcento = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

function Escolher(
  p: Props & { titulo: string; itens?: Item[]; usar: (id: string) => Promise<void> },
) {
  const temas = useTemas().data ?? []
  const cliente = useQueryClient()
  const [busca, setBusca] = useState('')
  const [indo, setIndo] = useState<string | null>(null)
  const [erro, setErro] = useState(false)
  const nomeTema = (id: string | null) => temas.find((x) => x.id === id)?.titulo ?? t.semTema
  const lista = (p.itens ?? []).filter(
    (i) => i.tema_id !== p.temaId && semAcento(i.titulo).includes(semAcento(busca)),
  )
  const usar = async (id: string) => {
    setIndo(id)
    setErro(false)
    try {
      await p.usar(id)
      await cliente.invalidateQueries()
      p.aoFechar()
    } catch {
      setErro(true)
      setIndo(null)
    }
  }
  return (
    <Janela titulo={p.titulo} aoFechar={p.aoFechar} rotuloFechar={t.fechar} rodape={p.criar}>
      <input
        aria-label={t.buscar}
        placeholder={t.buscar}
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        className="min-h-11 w-full rounded-xl border border-linha bg-white px-4 text-sm"
      />
      {erro && (
        <p role="alert" className="text-sm text-terracota-escuro">
          {t.erroAdicionar}
        </p>
      )}
      {p.itens && lista.length === 0 ? (
        <p className="py-6 text-center text-sm text-suave">{t.nenhumExistente}</p>
      ) : (
        <ul className="flex max-h-[55vh] flex-col divide-y divide-linha overflow-y-auto">
          {lista.map((i) => (
            <li key={i.id} className="flex items-center gap-3 py-2.5 text-sm">
              <span className="min-w-0 flex-1">
                <span className="block font-semibold text-tinta">{i.titulo}</span>
                <span className="text-xs text-suave">{nomeTema(i.tema_id)}</span>
              </span>
              <BotaoBrilho tamanho="sm" disabled={indo !== null} onClick={() => usar(i.id)}>
                {indo === i.id ? t.adicionando : t.adicionar}
              </BotaoBrilho>
            </li>
          ))}
        </ul>
      )}
    </Janela>
  )
}

/** Cardápios que a nutricionista já tem: escolhe um para este tema ou cria um novo. */
export function AdicionarCardapio(p: Props) {
  const q = useQuery({ queryKey: ['cardapios', '', ''], queryFn: () => listarCardapios('', '') })
  const itens = q.data?.map((c) => ({ id: c.id, titulo: c.titulo, tema_id: c.tema_id }))
  return (
    <Escolher
      {...p}
      titulo={t.adicionarCardapio}
      itens={itens}
      usar={(id) => usarCardapio(id, p.temaId)}
    />
  )
}

/** Treinos que já existem: escolhe um para este tema ou cria um novo. */
export function AdicionarTreino(p: Props) {
  const q = useQuery({ queryKey: ['treinos-todos'], queryFn: listarTreinos })
  const itens = q.data?.map((x) => ({ id: x.id, titulo: x.nome, tema_id: x.tema_id }))
  return (
    <Escolher
      {...p}
      titulo={t.adicionarTreino}
      itens={itens}
      usar={(id) => usarTreino(id, p.temaId)}
    />
  )
}
