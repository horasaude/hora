import { Cartao, LinkBrilho } from '@/components/ui'
import { useAvaliacoes } from '../hooks/useAvaliacoes'
import { textos } from '../textos'

/** Minha conta: atalho para as Avaliações, com quantas faltam responder. */
export function CartaoAvaliacoes() {
  const lista = (useAvaliacoes().data ?? []).filter((a) => a.perguntas.length > 0)
  if (lista.length === 0) return null
  const faltam = lista.filter((a) => !a.enviada_em).length
  return (
    <Cartao className="flex flex-wrap items-center justify-between gap-3 font-sistema">
      <div>
        <h2 className="text-lg font-bold text-verde-escuro">{textos.titulo}</h2>
        <p className="text-sm text-suave">
          {faltam ? textos.faltam(faltam) : textos.tudoRespondido}
        </p>
      </div>
      <LinkBrilho to="/app/avaliacoes" tom={faltam ? 'dourado' : 'cinza'}>
        {faltam ? textos.responder : textos.ver}
      </LinkBrilho>
    </Cartao>
  )
}
