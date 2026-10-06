import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Cartao } from '@/components/ui'
import { saudacaoPorHora } from '@/domain/saudacao'
import { aulaDeHoje } from '@/domain/trilha'
import { useMeuPerfil } from '@/features/auth'
import { useTrilha } from '@/features/trilha'
import { horaEmBrasilia } from '@/lib/datas'
import { AulaDeHoje, CartaoRanking, FaixaLive } from '../components/Cartoes'
import { Checkin } from '../components/Checkin'
import { useProximaLive } from '../hooks/useProximaLive'
import { textos } from '../textos'

/** Primeiro nome; sem nome, o apelido. */
function primeiroNome(nome?: string, apelido?: string | null) {
  return nome?.trim().split(/\s+/)[0] || apelido || ''
}

function Saudacao({ nome }: { nome: string }) {
  const [hora] = useState(() => horaEmBrasilia(new Date()))
  return (
    <header className="flex items-center justify-between gap-3">
      <h1 className="text-[1.9rem] leading-tight font-bold tracking-tight text-ora lg:text-[2.6rem]">
        {saudacaoPorHora(hora)}
        {nome && `, ${nome}`}
      </h1>
      {nome && (
        <span
          aria-hidden
          className="grid size-11 shrink-0 place-items-center rounded-full bg-terracota-suave font-semibold text-terracota-escuro lg:size-14 lg:text-lg"
        >
          {nome[0]?.toUpperCase()}
        </span>
      )}
    </header>
  )
}

/** Início da aluna: saudação, check-in, aula de hoje, próxima live e ranking. */
export function InicioPage() {
  const perfil = useMeuPerfil()
  const trilha = useTrilha()
  const live = useProximaLive()
  const nome = primeiroNome(perfil.data?.nome, perfil.data?.apelido)
  const aula = trilha.data ? aulaDeHoje(trilha.data.aulas) : null
  const semAcesso = trilha.isSuccess && trilha.data.dia === null
  return (
    <section className="flex flex-col gap-4 lg:gap-8">
      <Saudacao nome={nome} />
      {perfil.data?.papel === 'admin' && (
        <Link
          to="/app/admin"
          className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-ora px-5 text-sm font-semibold text-white lg:self-start"
        >
          {textos.painel}
        </Link>
      )}
      {semAcesso ? (
        <Cartao className="text-sm text-tinta">{textos.semAcesso}</Cartao>
      ) : (
        <div className="grid items-start gap-4 lg:grid-cols-2 lg:gap-6">
          <div className="flex flex-col gap-4 lg:gap-6">
            <Checkin />
            {aula && <AulaDeHoje aula={aula} />}
          </div>
          <div className="flex flex-col gap-4 lg:gap-6">
            {live.data && <FaixaLive live={live.data} />}
            <CartaoRanking />
          </div>
        </div>
      )}
    </section>
  )
}
