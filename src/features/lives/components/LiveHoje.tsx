import { Link } from 'react-router-dom'
import { diaEmBrasilia } from '@/lib/datas'
import { janelaDaLive } from '@/domain/lives'
import { useAgora, useLives } from '../hooks/useLives'
import { textos } from '../textos'
import { BotaoEntrar } from './BotaoEntrar'

const hora = (d: Date) =>
  new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)

/** Início: card dourado pequeno quando há live hoje, com a hora e Entrar na janela. */
export function LiveHoje() {
  const lives = useLives()
  const agora = useAgora()
  const hoje = diaEmBrasilia(agora)
  const live = lives.data?.find(
    (l) =>
      diaEmBrasilia(new Date(l.data)) === hoje &&
      janelaDaLive(new Date(l.data), l.duracao_minutos, agora) !== 'encerrada',
  )
  if (!live) return null
  return (
    <div className="flex flex-col gap-3 rounded-[22px] border-2 border-dourado/70 bg-ocre-suave/50 p-5">
      <Link
        to="/app/lives"
        className="text-[17px] font-bold text-verde-escuro underline-offset-2 hover:underline"
      >
        {textos.hoje(hora(new Date(live.data)))}
      </Link>
      <p className="-mt-2 text-sm text-tinta">{live.tema}</p>
      <BotaoEntrar live={live} agora={agora} />
    </div>
  )
}
