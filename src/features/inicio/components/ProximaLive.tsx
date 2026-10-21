import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Cartao } from '@/components/ui'
import { janelaDaLive, nomesDasProfissionais, PROFISSIONAIS } from '@/domain/lives'
import { LiveHoje, useLives } from '@/features/lives'
import { diaEmBrasilia, diaSemanaEHora } from '@/lib/datas'
import { textos } from '../textos'
import { IconeSeta } from './Icones'

const maiuscula = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

/** Próxima live: foto da profissional, tema, dia e hora. Com live hoje, o cartão dourado com Entrar. */
export function ProximaLive() {
  const lives = useLives()
  const [agora] = useState(() => new Date())
  const proxima = (lives.data ?? []).find(
    (l) => janelaDaLive(new Date(l.data), l.duracao_minutos, agora) !== 'encerrada',
  )
  if (!proxima) return null
  const quando = new Date(proxima.data)
  const ehHoje = diaEmBrasilia(quando) === diaEmBrasilia(agora)
  const primeira = proxima.profissionais[0]
  const foto = proxima.capa ?? (primeira ? PROFISSIONAIS[primeira].foto : null)
  const quem = nomesDasProfissionais(proxima.profissionais)
  return (
    <section className="flex flex-col gap-2.5">
      <h2 className="text-[15px] font-bold text-tinta">{textos.live.titulo}</h2>
      {ehHoje ? (
        <LiveHoje />
      ) : (
        <Link to="/app/lives">
          <Cartao className="flex items-center gap-3 p-4 transition hover:shadow-menu">
            {foto && (
              <img
                src={foto}
                alt=""
                className="size-[52px] shrink-0 rounded-2xl object-cover"
                loading="lazy"
              />
            )}
            <span className="min-w-0 flex-1">
              <span className="block text-[15px] font-bold text-tinta">{proxima.tema}</span>
              <span className="block text-[13px] text-suave">
                {maiuscula(diaSemanaEHora(quando))}
                {quem && ` · ${quem}`}
              </span>
            </span>
            <IconeSeta className="size-5 shrink-0 text-suave" />
          </Cartao>
        </Link>
      )}
    </section>
  )
}
