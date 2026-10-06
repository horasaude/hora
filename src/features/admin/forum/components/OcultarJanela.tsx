import { useId, useState } from 'react'
import { BotaoBrilho, Janela } from '@/components/ui'
import { ocultar } from '../api/forum.api'
import { useAcaoForumPainel } from '../hooks/useForumPainel'
import { t } from '../textos'

/** Ocultar dúvida ou resposta: pede o motivo. Ocultar a dúvida estorna os pontos dela. */
export function OcultarJanela({
  topico,
  resposta,
  aoFechar,
}: {
  topico?: string
  resposta?: string
  aoFechar: () => void
}) {
  const id = useId()
  const [motivo, setMotivo] = useState('')
  const [erro, setErro] = useState('')
  const acao = useAcaoForumPainel(ocultar)
  const enviar = (e: React.FormEvent) => {
    e.preventDefault()
    if (!motivo.trim()) return setErro(t.erroMotivo)
    acao.mutate(
      { topico: resposta ? undefined : topico, resposta, motivo: motivo.trim() },
      { onSuccess: aoFechar, onError: () => setErro(t.erro) },
    )
  }
  return (
    <Janela
      titulo={t.ocultarTitulo}
      aoFechar={aoFechar}
      rotuloFechar={t.fechar}
      rodape={
        <>
          <BotaoBrilho tom="cinza" onClick={aoFechar}>
            {t.cancelar}
          </BotaoBrilho>
          <BotaoBrilho tom="coral" type="submit" form={id} disabled={acao.isPending}>
            {t.ocultar}
          </BotaoBrilho>
        </>
      }
    >
      <form id={id} onSubmit={enviar} noValidate className="flex flex-col gap-2">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">{t.motivo}</span>
          <textarea
            rows={3}
            maxLength={300}
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            className="rounded-xl border border-linha bg-white px-4 py-3"
          />
        </label>
        {erro && (
          <p role="alert" className="text-sm text-terracota-escuro">
            {erro}
          </p>
        )}
      </form>
    </Janela>
  )
}
