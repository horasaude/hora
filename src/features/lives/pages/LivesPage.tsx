import { Carregando, Cartao, ErroCarregar, Vazio } from '@/components/ui'
import { janelaDaLive, PROFISSIONAIS } from '@/domain/lives'
import { formatarDataHora } from '@/lib/datas'
import type { Live } from '../api/lives.api'
import { Gravacoes } from '../components/Gravacoes'
import { ProximaLive } from '../components/ProximaLive'
import { useAgora, useLives } from '../hooks/useLives'
import { textos } from '../textos'

const encerrada = (l: Live, agora: Date) =>
  janelaDaLive(new Date(l.data), l.duracao_minutos, agora) === 'encerrada'

function Agendadas({ lives }: { lives: Live[] }) {
  if (lives.length === 0) return null
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-[19px] font-bold text-verde-escuro">{textos.agendadas}</h2>
      <ul className="grid gap-3 sm:grid-cols-2">
        {lives.map((l) => (
          <li key={l.id}>
            <Cartao className="flex flex-col gap-1 py-4">
              <span className="text-[15px] font-bold text-tinta">{l.tema}</span>
              <span className="text-[13px] text-suave">
                {[
                  formatarDataHora(new Date(l.data)),
                  l.profissional && PROFISSIONAIS[l.profissional].nome,
                ]
                  .filter(Boolean)
                  .join(' · ')}
              </span>
            </Cartao>
          </li>
        ))}
      </ul>
    </section>
  )
}

/** Lives: a próxima em destaque, as outras da agenda e as gravações. */
export function LivesPage() {
  const lives = useLives()
  const agora = useAgora()
  const todas = lives.data ?? []
  const futuras = todas.filter((l) => !encerrada(l, agora))
  const passadas = todas.filter((l) => encerrada(l, agora)).reverse()
  const [proxima, ...depois] = futuras
  return (
    <section className="flex flex-col gap-6 lg:gap-8">
      <h1 className="text-[28px] leading-tight font-bold text-verde-escuro lg:text-[30px]">
        {textos.titulo}
      </h1>
      {lives.isPending ? (
        <Carregando texto={textos.carregando} />
      ) : lives.isError ? (
        <ErroCarregar texto={textos.erro} tentar={textos.tentar} aoTentar={() => lives.refetch()} />
      ) : (
        <>
          {proxima ? (
            <ProximaLive live={proxima} agora={agora} />
          ) : (
            <Vazio>{textos.semAgendada}</Vazio>
          )}
          <Agendadas lives={depois} />
          <section className="flex flex-col gap-3">
            <h2 className="text-[19px] font-bold text-verde-escuro">{textos.gravacoes}</h2>
            <Gravacoes lives={passadas} />
          </section>
        </>
      )}
    </section>
  )
}
