import { useEffect, useRef, useState } from 'react'
import { nomeSemExtensao, tipoMime, validarArquivo, type TipoMaterial } from '@/domain/arquivos'
import { enviarComProgresso } from '@/lib/envio'
import { buscarMateriais } from '../api/conteudo.api'

export type ItemMaterial = {
  chave: string
  tipo: TipoMaterial
  caminho: string | null
  nome: string
  tamanho: number | null
  progresso: number | null
  falhou?: boolean
}

const extensao = (f: File) => {
  const mime = tipoMime(f.name, f.type)
  return mime === 'application/pdf'
    ? 'pdf'
    : mime.split('/')[1] === 'jpeg'
      ? 'jpg'
      : (mime.split('/')[1] ?? 'bin')
}

/** Materiais já salvos da aula, ao abrir para editar. */
function useCarregar(aulaId: string | undefined, setItens: (l: ItemMaterial[]) => void) {
  useEffect(() => {
    if (!aulaId) return
    buscarMateriais(aulaId).then((lista) =>
      setItens(
        lista.map((m) => ({
          chave: m.id,
          tipo: m.tipo as TipoMaterial,
          caminho: m.caminho,
          nome: m.nome,
          tamanho: m.tamanho,
          progresso: null,
        })),
      ),
    )
  }, [aulaId, setItens])
}

/** Confere e envia os arquivos escolhidos; devolve as recusas ("nome|motivo"). */
function enviarArquivos(
  arquivos: File[],
  pasta: string,
  incluir: (item: ItemMaterial) => void,
  mudar: (chave: string, p: Partial<ItemMaterial>) => void,
): string[] {
  const recusas: string[] = []
  for (const f of arquivos) {
    const v = validarArquivo(f, 'material')
    if (!v.ok) {
      recusas.push(`${f.name}|${v.motivo}`)
      continue
    }
    const chave = crypto.randomUUID()
    const caminho = `aulas/${pasta}/${chave}.${extensao(f)}`
    incluir({
      chave,
      tipo: v.tipo,
      caminho,
      nome: nomeSemExtensao(f.name),
      tamanho: f.size,
      progresso: 0,
    })
    enviarComProgresso('materiais', caminho, f, (pct) =>
      mudar(chave, { progresso: pct < 100 ? pct : null }),
    ).catch(() => mudar(chave, { falhou: true, progresso: null }))
  }
  return recusas
}

/** Lista de materiais do modal da aula: carrega os salvos, envia os novos com progresso, ordena e remove. */
export function useMateriais(aulaId?: string) {
  const [itens, setItens] = useState<ItemMaterial[]>([])
  const [removidos, setRemovidos] = useState<string[]>([])
  const [recusas, setRecusas] = useState<string[]>([])
  const pasta = useRef(aulaId ?? crypto.randomUUID())
  useCarregar(aulaId, setItens)
  const mudar = (chave: string, p: Partial<ItemMaterial>) =>
    setItens((l) => l.map((i) => (i.chave === chave ? { ...i, ...p } : i)))
  const adicionar = (arquivos: File[]) =>
    setRecusas(
      enviarArquivos(arquivos, pasta.current, (item) => setItens((l) => [...l, item]), mudar),
    )
  const remover = (chave: string) => {
    const item = itens.find((i) => i.chave === chave)
    if (item?.caminho && item.tipo !== 'link') setRemovidos((r) => [...r, item.caminho as string])
    setItens((l) => l.filter((i) => i.chave !== chave))
  }
  const mover = (de: number, para: number) =>
    setItens((l) => {
      if (para < 0 || para >= l.length) return l
      const copia = [...l]
      const [item] = copia.splice(de, 1)
      if (item) copia.splice(para, 0, item)
      return copia
    })
  const paraSalvar = itens
    .filter((i) => !i.falhou && i.caminho)
    .map((i) => ({
      tipo: i.tipo,
      caminho: i.caminho as string,
      nome: i.nome.trim() || 'Material',
      tamanho: i.tamanho,
    }))
  return {
    itens,
    recusas,
    enviando: itens.some((i) => i.progresso !== null),
    paraSalvar,
    removidos,
    adicionar,
    remover,
    mover,
    mudar,
  }
}

export type Materiais = ReturnType<typeof useMateriais>
