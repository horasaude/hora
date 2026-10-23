import { useState } from 'react'
import { erroPergunta, novaPergunta, type Pergunta } from '@/domain/anamnese'
import { salvarAnamnese, type Anamnese, type AreaAnamnese } from '../api/anamnese.api'
import { t } from '../textos'
import { useAcaoTreinos } from './useTreinosPainel'

/** Estado da janela da anamnese: título, abertura, perguntas e o salvar (rascunho ou publicada). */
export function useAnamneseForm(x: Anamnese | undefined, area: AreaAnamnese, aoFechar: () => void) {
  const salvar = useAcaoTreinos(salvarAnamnese)
  const [titulo, setTitulo] = useState(x?.titulo ?? '')
  const [descricao, setDescricao] = useState(x?.descricao ?? '')
  const [perguntas, setPerguntas] = useState<Pergunta[]>(x?.perguntas ?? [novaPergunta()])
  const [erro, setErro] = useState('')
  const mudar = (i: number, campos: Partial<Pergunta>) =>
    setPerguntas((l) => l.map((p, j) => (j === i ? { ...p, ...campos } : p)))
  const mover = (i: number, d: number) =>
    setPerguntas((l) => {
      const nova = [...l]
      const [p] = nova.splice(i, 1)
      if (p) nova.splice(i + d, 0, p)
      return nova
    })
  const gravar = async (publicada: boolean) => {
    if (titulo.trim().length < 2) return setErro(t.erros.nome)
    if (perguntas.length === 0) return setErro(t.anamnese.semPerguntas)
    const ruim = perguntas.findIndex((p) => erroPergunta(p))
    const qual = perguntas[ruim]
    if (qual)
      return setErro(
        erroPergunta(qual) === 'texto'
          ? t.anamnese.erroTexto(ruim + 1)
          : t.anamnese.erroOpcoes(ruim + 1),
      )
    const limpas = perguntas.map((p) => ({
      ...p,
      texto: p.texto.trim(),
      opcoes: p.tipo === 'escolha' ? p.opcoes.map((o) => o.trim()).filter(Boolean) : [],
    }))
    try {
      await salvar.mutateAsync({
        id: x?.id,
        area: x?.area ?? area,
        titulo: titulo.trim(),
        descricao: descricao.trim(),
        perguntas: limpas,
        publicada,
      })
      aoFechar()
    } catch {
      setErro(t.erros.salvar)
    }
  }
  return {
    titulo,
    setTitulo,
    descricao,
    setDescricao,
    perguntas,
    mudar,
    mover,
    tirar: (i: number) => setPerguntas((l) => l.filter((_, j) => j !== i)),
    adicionar: () => setPerguntas((l) => [...l, novaPergunta()]),
    gravar,
    erro,
    salvando: salvar.isPending,
  }
}
