import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { listaDeCompras } from '@/domain/listaCompras'
import type { Refeicao } from '@/domain/nutricao'
import { ingredientesDeReceitas, salvarCardapio, type CardapioLinha } from '../api/cardapios.api'
import { deCardapio, paraBanco, type FormCardapio } from '../cardapioForm'
import { tCardapios as t } from '../textos2'
import { useAcaoPlano } from './usePlano'

export const LISTA_CARDAPIOS = '/app/admin/plano/cardapios'

/** Estado do cardápio aberto e as ações (salvar, publicar, duplicar, gerar lista). */
export function useEditorCardapio(cardapio?: CardapioLinha) {
  const navegar = useNavigate()
  const [f, setF] = useState<FormCardapio>(() => deCardapio(cardapio))
  const [salvo, setSalvo] = useState(() => JSON.stringify(deCardapio(cardapio)))
  const [erro, setErro] = useState<'' | 'nome' | 'salvar'>('')
  const salvar = useAcaoPlano((x: FormCardapio) => salvarCardapio(paraBanco(x, cardapio?.id)))
  const duplicar = useAcaoPlano((x: FormCardapio) =>
    salvarCardapio(paraBanco({ ...x, titulo: t.copia(x.titulo), publicado: false })),
  )
  const mudar = (p: Partial<FormCardapio>) => {
    setF((x) => ({ ...x, ...p }))
    setErro('')
  }
  const mudarRefeicoes = (fn: (r: Refeicao[]) => Refeicao[]) =>
    setF((x) => ({ ...x, refeicoes: fn(x.refeicoes) }))
  const gravar = async (x: FormCardapio) => {
    if (!x.titulo.trim()) return setErro('nome')
    try {
      const linha = await salvar.mutateAsync(x)
      setF(x)
      setSalvo(JSON.stringify(x))
      if (!cardapio) navegar(`${LISTA_CARDAPIOS}/${linha.id}`, { replace: true })
    } catch {
      setErro('salvar')
    }
  }
  const gerarLista = async () => {
    const receitas = f.refeicoes.flatMap((r) =>
      r.itens
        .map((i) => i.opcoes[0])
        .filter((o) => o?.tipo === 'receita')
        .map((o) => o?.ref_id ?? ''),
    )
    mudar({
      lista: listaDeCompras(f.refeicoes, await ingredientesDeReceitas([...new Set(receitas)])),
    })
  }
  return {
    f,
    mudar,
    mudarRefeicoes,
    erro,
    alterado: JSON.stringify(f) !== salvo,
    salvando: salvar.isPending,
    gravar,
    gerarLista,
    duplicar: async () => navegar(`${LISTA_CARDAPIOS}/${(await duplicar.mutateAsync(f)).id}`),
  }
}
