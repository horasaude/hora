import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Cartao, classeBrilho } from '@/components/ui'
import { saudacaoPorHora } from '@/domain/saudacao'
import { aulaDeHoje, aulasEmAndamento } from '@/domain/trilha'
import { useMeuPerfil } from '@/features/auth'
import { AvisoRespondida } from '@/features/forum'
import { useTrilha } from '@/features/trilha'
import { horaEmBrasilia } from '@/lib/datas'
import { CheckinHoje, useHoje } from '@/features/checkin'
import { CartaoDesafioAtivo } from '@/features/desafios'
import { LiveHoje } from '@/features/lives'
import { CartaoRankingInicio } from '@/features/ranking'
import { AulaDeHoje } from '../components/Cartoes'
import { Resumo } from '../components/Resumo'
import { textos } from '../textos'

/** Primeiro nome; sem nome, o apelido. */
function primeiroNome(nome?: string, apelido?: string | null) {
  return nome?.trim().split(/\s+/)[0] || apelido || ''
}

function Saudacao({ nome }: { nome: string }) {
  const [hora] = useState(() => horaEmBrasilia(new Date()))
  return (
    <header className="flex items-center justify-between gap-3">
      <h1 className="text-[28px] leading-tight font-bold text-verde-escuro lg:text-[30px]">
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

/** Início da aluna: saudação, resumo, check-in, aula de hoje, próxima live, ranking e desafio. */
export function InicioPage() {
  const hoje = useHoje()
  const perfil = useMeuPerfil()
  const trilha = useTrilha()
  const nome = primeiroNome(perfil.data?.nome, perfil.data?.apelido)
  const aula = trilha.data ? aulaDeHoje(aulasEmAndamento(trilha.data)) : null
  const semAcesso = trilha.isSuccess && trilha.data.dia === null
  return (
    <section className="flex flex-col gap-4 lg:gap-8">
      <Saudacao nome={nome} />
      {perfil.data?.papel === 'admin' && (
        <Link to="/app/admin" className={`${classeBrilho('escuro')} lg:self-start`}>
          {textos.painel}
        </Link>
      )}
      {semAcesso ? (
        <Cartao className="text-sm text-tinta">{textos.semAcesso}</Cartao>
      ) : (
        <>
          <Resumo />
          <div className="grid items-start gap-4 lg:grid-cols-[1.4fr_1fr] lg:gap-6">
            <div className="flex flex-col gap-4 lg:gap-6">
              <AvisoRespondida />
              <CheckinHoje />
              {aula && <AulaDeHoje aula={aula} />}
              <LiveHoje />
            </div>
            <div className="flex flex-col gap-4 lg:gap-6">
              <CartaoRankingInicio />
              <CartaoDesafioAtivo hoje={hoje} />
            </div>
          </div>
        </>
      )}
    </section>
  )
}
