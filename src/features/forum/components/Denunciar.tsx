import { useState } from 'react'
import { BotaoBrilho, Janela } from '@/components/ui'
import { denunciar } from '../api/forum.api'
import { useAcaoForum } from '../hooks/useForum'
import { textos as t } from '../textos'

/** Denunciar dúvida ou resposta de outra aluna; o motivo é opcional. */
export function Denunciar({ topico, resposta }: { topico?: string; resposta?: string }) {
  const [aberta, setAberta] = useState(false)
  const [motivo, setMotivo] = useState('')
  const acao = useAcaoForum(denunciar)
  if (acao.isSuccess) return <span className="text-xs text-suave">{t.denunciada}</span>
  const enviar = () =>
    acao.mutate({ topico, resposta, motivo: motivo.trim() }, { onSuccess: () => setAberta(false) })
  return (
    <>
      <button
        type="button"
        onClick={() => setAberta(true)}
        className="text-xs text-suave underline-offset-4 hover:text-terracota-escuro hover:underline"
      >
        {t.denunciar}
      </button>
      {aberta && (
        <Janela
          titulo={t.denunciarTitulo}
          aoFechar={() => setAberta(false)}
          rotuloFechar={t.fechar}
          rodape={
            <>
              <BotaoBrilho tom="cinza" onClick={() => setAberta(false)}>
                {t.cancelar}
              </BotaoBrilho>
              <BotaoBrilho tom="coral" disabled={acao.isPending} onClick={enviar}>
                {t.denunciar}
              </BotaoBrilho>
            </>
          }
        >
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
          {acao.isError && (
            <p role="alert" className="mt-2 text-sm text-terracota-escuro">
              {t.erroEnviar}
            </p>
          )}
        </Janela>
      )}
    </>
  )
}
