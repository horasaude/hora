import { useState } from 'react'
import { BotaoBrilho } from '@/components/ui'
import { enviarPdfCardapio, linkPdfCardapio } from '../api/cardapioPdf.api'
import type { FormCardapio } from '../cardapioForm'
import { tCardapios as t } from '../textos2'
import { Bloco } from './BarraTopo'

type Props = { f: FormCardapio; mudar: (p: Partial<FormCardapio>) => void }

async function abrir(caminho: string) {
  const aba = window.open('', '_blank')
  const link = await linkPdfCardapio(caminho)
  if (aba && link) aba.location.href = link
  else aba?.close()
}

/** PDF do cardápio: a nutricionista envia, troca ou remove; vale depois de salvar o cardápio. */
export function PdfCardapio({ f, mudar }: Props) {
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState(false)
  async function enviar(arquivo: File) {
    setErro(false)
    if (arquivo.type !== 'application/pdf' || arquivo.size > 20 * 1024 * 1024) return setErro(true)
    setEnviando(true)
    try {
      mudar({ pdf_path: await enviarPdfCardapio(arquivo), pdf_nome: arquivo.name })
    } catch {
      setErro(true)
    } finally {
      setEnviando(false)
    }
  }
  return (
    <Bloco titulo={t.pdfCardapio}>
      {f.pdf_path ? (
        <button
          type="button"
          onClick={() => abrir(f.pdf_path)}
          className="self-start truncate text-left text-sm font-bold text-verde-escuro underline"
        >
          {f.pdf_nome || t.pdfCardapio}
        </button>
      ) : (
        <p className="text-sm text-suave">{t.pdfVazio}</p>
      )}
      <div className="flex flex-wrap gap-2">
        <label className="brilho brilho-dourado inline-flex min-h-9 cursor-pointer items-center rounded-full px-4 text-[13px] font-bold">
          {enviando ? t.enviandoPdf : f.pdf_path ? t.trocarPdf : t.enviarPdf}
          <input
            type="file"
            accept="application/pdf,.pdf"
            className="sr-only"
            disabled={enviando}
            onChange={(ev) => {
              const arquivo = ev.target.files?.[0]
              ev.target.value = ''
              if (arquivo) void enviar(arquivo)
            }}
          />
        </label>
        {f.pdf_path && !enviando && (
          <BotaoBrilho tom="coral" onClick={() => mudar({ pdf_path: '', pdf_nome: '' })}>
            {t.removerPdf}
          </BotaoBrilho>
        )}
      </div>
      {erro && (
        <p role="alert" className="text-sm text-terracota-escuro">
          {t.erroPdf}
        </p>
      )}
    </Bloco>
  )
}
