import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  duplicarReceita,
  removerReceita,
  salvarReceita,
  type ReceitaCompleta,
} from '../api/receitas.api'
import { deReceita, paraBanco, type FormReceita } from '../receitaForm'
import { useAcaoPlano } from './usePlano'

export const LISTA_RECEITAS = '/app/admin/plano/receitas'

/** Estado da receita aberta e as ações (salvar, publicar, duplicar, remover). */
export function useEditorReceita(receita?: ReceitaCompleta) {
  const navegar = useNavigate()
  const [f, setF] = useState<FormReceita>(() => deReceita(receita))
  const [salvo, setSalvo] = useState(() => JSON.stringify(deReceita(receita)))
  const [erro, setErro] = useState<'' | 'nome' | 'salvar'>('')
  const salvar = useAcaoPlano((x: FormReceita) => {
    const { dados, itens } = paraBanco(x, receita?.id)
    return salvarReceita(dados, itens)
  })
  const duplicar = useAcaoPlano((nome: string) => duplicarReceita(receita as ReceitaCompleta, nome))
  const remover = useAcaoPlano(() => removerReceita(receita as ReceitaCompleta))
  const mudar = (p: Partial<FormReceita>) => {
    setF((x) => ({ ...x, ...p }))
    setErro('')
  }
  const gravar = async (x: FormReceita) => {
    if (!x.nome.trim()) return setErro('nome')
    try {
      const id = await salvar.mutateAsync(x)
      setF(x)
      setSalvo(JSON.stringify(x))
      if (!receita) navegar(`${LISTA_RECEITAS}/${id}`, { replace: true })
    } catch {
      setErro('salvar')
    }
  }
  return {
    f,
    mudar,
    erro,
    alterado: JSON.stringify(f) !== salvo,
    salvando: salvar.isPending,
    gravar,
    duplicar: async () =>
      navegar(`${LISTA_RECEITAS}/${await duplicar.mutateAsync(`${f.nome} (cópia)`)}`),
    remover: async () => {
      await remover.mutateAsync(undefined)
      navegar(LISTA_RECEITAS)
    },
  }
}
