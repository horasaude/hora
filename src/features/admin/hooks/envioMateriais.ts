// Envio dos arquivos escolhidos no painel para o espaço materiais, com progresso.
import { nomeSemExtensao, tipoMime, validarArquivo, type TipoMaterial } from '@/domain/arquivos'
import { enviarComProgresso } from '@/lib/envio'

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
  if (mime === 'application/msword') return 'doc'
  if (mime.includes('wordprocessingml')) return 'docx'
  return mime === 'application/pdf'
    ? 'pdf'
    : mime.split('/')[1] === 'jpeg'
      ? 'jpg'
      : (mime.split('/')[1] ?? 'bin')
}

export /** Confere e envia os arquivos escolhidos; devolve as recusas ("nome|motivo"). */
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
    const caminho = `${pasta}/${chave}.${extensao(f)}`
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
