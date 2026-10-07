import { useState } from 'react'
import { BotaoBrilho, Janela } from '@/components/ui'
import { t } from '../textos'

/** Link de acesso para enviar à profissional (WhatsApp ou e-mail), com Copiar. */
export function LinkAcesso({
  nome,
  link,
  aoFechar,
}: {
  nome: string
  link: string
  aoFechar: () => void
}) {
  const [copiado, setCopiado] = useState(false)
  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(link)
      setCopiado(true)
    } catch {
      setCopiado(false)
    }
  }
  return (
    <Janela
      titulo={t.linkTitulo}
      aoFechar={aoFechar}
      rotuloFechar={t.fechar}
      rodape={
        <>
          <BotaoBrilho tom="cinza" onClick={aoFechar}>
            {t.fechar}
          </BotaoBrilho>
          <BotaoBrilho tom={copiado ? 'verde' : 'escuro'} onClick={copiar}>
            {copiado ? t.copiado : t.copiar}
          </BotaoBrilho>
        </>
      }
    >
      <div className="flex flex-col gap-3">
        <p className="text-sm text-tinta">{t.linkPronto(nome)}</p>
        <input
          readOnly
          aria-label={t.linkTitulo}
          value={link}
          onFocus={(e) => e.target.select()}
          className="min-h-12 rounded-xl border border-linha bg-trilho px-4 text-[13px] text-tinta"
        />
      </div>
    </Janela>
  )
}
