import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { nomeSemExtensao, tipoMime, validarArquivo } from '@/domain/arquivos'
import { enviarComProgresso } from '@/lib/envio'
import { textos } from '../textos'
import { registrarArquivo, removerArquivoAluna } from './arquivosAluna.api'

const t = textos.arquivos

/** Envia um arquivo para a pasta da aluna, com progresso, e registra na lista dela. */
export function useEnviarArquivo(perfil: string) {
  const cliente = useQueryClient()
  const [pct, setPct] = useState<number | null>(null)
  const [aviso, setAviso] = useState<string | null>(null)
  const atualizar = () => cliente.invalidateQueries({ queryKey: ['arquivos-aluna', perfil] })
  const remover = useMutation({ mutationFn: removerArquivoAluna, onSuccess: atualizar })
  const enviar = async (f: File) => {
    const v = validarArquivo(f, 'material')
    if (!v.ok) return setAviso(t.recusado(f.name, v.motivo))
    const ext = (tipoMime(f.name, f.type).split('/')[1] ?? 'bin')
      .replace('jpeg', 'jpg')
      .replace('msword', 'doc')
      .replace('vnd.openxmlformats-officedocument.wordprocessingml.document', 'docx')
    const caminho = `${perfil}/${crypto.randomUUID()}.${ext}`
    setAviso(null)
    setPct(0)
    try {
      await enviarComProgresso('arquivos_aluna', caminho, f, setPct)
      await registrarArquivo({
        perfil,
        nome: nomeSemExtensao(f.name).slice(0, 160),
        caminho,
        tipo: v.tipo,
        tamanho: f.size,
      })
      atualizar()
    } catch {
      setAviso(t.falhou)
    } finally {
      setPct(null)
    }
  }
  return { enviar, pct, aviso, remover }
}
