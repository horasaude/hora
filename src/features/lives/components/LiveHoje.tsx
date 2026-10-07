import { Link } from 'react-router-dom'
import { janelaDaLive } from '@/domain/lives'
import { diaEmBrasilia, diaSemanaEHora } from '@/lib/datas'
import type { Live } from '../api/lives.api'
import { useAgora, useLives } from '../hooks/useLives'
import { textos } from '../textos'
import { BotaoEntrar } from './BotaoEntrar'

const hora = (d: Date) =>
  new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)

function CartaoHoje({ live, agora }: { live: Live; agora: Date }) {
  return (
    <div className="flex flex-col gap-3 rounded-[22px] border-2 border-dourado/70 bg-white p-5 shadow-cartao">
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

/** Faixa ocre clara da próxima live; leva para Comunidade > Lives. */
function FaixaProxima({ live }: { live: Live }) {
  return (
    <Link
      to="/app/lives"
      className="self-start rounded-[14px] bg-[#F6EBD3] px-4 py-2.5 text-[14px] font-bold text-[#7A5617] transition hover:brightness-[0.97]"
    >
      {textos.faixa(diaSemanaEHora(new Date(live.data)), live.tema)}
    </Link>
  )
}

/** Início: um aviso só. Com live hoje, o card dourado com Entrar; sem, a faixa da próxima live. */
export function LiveHoje() {
  const lives = useLives()
  const agora = useAgora()
  const hoje = diaEmBrasilia(agora)
  const abertas = (lives.data ?? []).filter(
    (l) => janelaDaLive(new Date(l.data), l.duracao_minutos, agora) !== 'encerrada',
  )
  const deHoje = abertas.find((l) => diaEmBrasilia(new Date(l.data)) === hoje)
  if (deHoje) return <CartaoHoje live={deHoje} agora={agora} />
  const proxima = abertas[0]
  return proxima ? <FaixaProxima live={proxima} /> : null
}
