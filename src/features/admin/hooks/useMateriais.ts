import { useEffect, useRef, useState } from 'react'
import type { TipoMaterial } from '@/domain/arquivos'
import {
  buscarMateriais,
  buscarMateriaisApoio,
  buscarMateriaisComece,
  buscarMateriaisTema,
} from '../api/materiais.api'
import { enviarArquivos, type ItemMaterial } from './envioMateriais'

export type { ItemMaterial }

/** Materiais já salvos da aula (ou do Comece por aqui), ao abrir para editar. */
function useCarregar(aulaId: string | undefined, setItens: (l: ItemMaterial[]) => void) {
  useEffect(() => {
    if (!aulaId || aulaId === APOIO) return
    const busca =
      aulaId === COMECE
        ? buscarMateriaisComece()
        : aulaId.startsWith(TEMA)
          ? buscarMateriaisTema(aulaId.slice(TEMA.length))
          : aulaId.startsWith(APOIO)
            ? buscarMateriaisApoio(aulaId.slice(APOIO.length))
            : buscarMateriais(aulaId)
    busca.then((lista) =>
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

/** Id especial: os arquivos do Comece por aqui, guardados em comece/. */
export const COMECE = 'comece'
/** Prefixo dos arquivos de um tema: "tema:<id>", guardados em temas/<id>/. */
export const TEMA = 'tema:'
/** Prefixo dos anexos de um material de apoio (nutrição ou saúde): "apoio:<id>", guardados em apoio/. */
export const APOIO = 'apoio:'

/** Pasta no espaço materiais: comece/, temas/<id>/, apoio/<id>/ ou aulas/<id>/. */
function pastaDe(aulaId?: string): string {
  if (aulaId === COMECE) return COMECE
  if (aulaId?.startsWith(TEMA)) return `temas/${aulaId.slice(TEMA.length)}`
  if (aulaId?.startsWith(APOIO)) return `apoio/${aulaId.slice(APOIO.length) || crypto.randomUUID()}`
  return `aulas/${aulaId ?? crypto.randomUUID()}`
}

/** Link de vídeo ou página que entra na lista junto com os arquivos. */
const itemLink = (link: string, nome: string): ItemMaterial => ({
  chave: crypto.randomUUID(),
  tipo: 'link',
  caminho: link.trim(),
  nome: nome.trim() || 'Vídeo',
  tamanho: null,
  progresso: null,
})

/** Lista de materiais do modal da aula (ou do Comece por aqui): carrega os salvos, envia os novos com progresso, ordena e remove. */
export function useMateriais(aulaId?: string) {
  const [itens, setItens] = useState<ItemMaterial[]>([])
  const [removidos, setRemovidos] = useState<string[]>([])
  const [recusas, setRecusas] = useState<string[]>([])
  const pasta = useRef(pastaDe(aulaId))
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
  const adicionarLink = (link: string, nome: string) =>
    setItens((l) => [...l, itemLink(link, nome)])
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
    adicionarLink,
    remover,
    mover,
    mudar,
  }
}

export type Materiais = ReturnType<typeof useMateriais>
