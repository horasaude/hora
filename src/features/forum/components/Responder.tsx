import { useId, useState } from 'react'
import { BotaoBrilho } from '@/components/ui'
import { responder } from '../api/forum.api'
import { useAcaoForum } from '../hooks/useForum'
import { textos as t } from '../textos'

/** Campo de resposta na própria tela. No painel o botão diz Responder em verde escuro. */
export function Responder({ topico, rotulo = t.suaResposta }: { topico: string; rotulo?: string }) {
  const id = useId()
  const [texto, setTexto] = useState('')
  const [erro, setErro] = useState('')
  const acao = useAcaoForum(responder)
  const enviar = (e: React.FormEvent) => {
    e.preventDefault()
    if (!texto.trim()) return setErro(t.erroResposta)
    setErro('')
    acao.mutate(
      { topico, texto: texto.trim() },
      { onSuccess: () => setTexto(''), onError: () => setErro(t.erroEnviar) },
    )
  }
  return (
    <form onSubmit={enviar} noValidate className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium">
        {rotulo}
      </label>
      <textarea
        id={id}
        rows={3}
        maxLength={2000}
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        className="rounded-xl border border-linha bg-white px-4 py-3 text-[15px] focus:border-ora focus:outline-none"
      />
      {erro && (
        <p role="alert" className="text-sm text-terracota-escuro">
          {erro}
        </p>
      )}
      <BotaoBrilho type="submit" disabled={acao.isPending} className="self-end">
        {acao.isPending ? t.enviando : t.responder}
      </BotaoBrilho>
    </form>
  )
}
