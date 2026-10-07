import { BotaoBrilho, Cartao } from '@/components/ui'
import { contagem, janelaDaLive, PROFISSIONAIS } from '@/domain/lives'
import { formatarDataHora } from '@/lib/datas'
import { baixarIcs, gerarIcs } from '@/lib/ics'
import type { Live } from '../api/lives.api'
import { useLembrete } from '../hooks/useLives'
import { textos } from '../textos'
import { BotaoEntrar } from './BotaoEntrar'
import { Profissional } from './Profissional'

function adicionarNaAgenda(l: Live) {
  const inicio = new Date(l.data)
  const nome = l.profissional ? PROFISSIONAIS[l.profissional].nome : ''
  baixarIcs(
    `live-hora-${inicio.toISOString().slice(0, 10)}`,
    gerarIcs({
      uid: l.id,
      titulo: `Live ORA: ${l.tema}`,
      inicio,
      fim: new Date(inicio.getTime() + l.duracao_minutos * 60_000),
      descricao: nome ? textos.com(nome) : undefined,
      url: l.link_url,
    }),
  )
}

/** Destaque com borda dourada: profissional, tema, data, contagem, agenda, lembrete e entrar. */
export function ProximaLive({ live, agora }: { live: Live; agora: Date }) {
  const lembrete = useLembrete()
  const inicio = new Date(live.data)
  const aoVivo = janelaDaLive(inicio, live.duracao_minutos, agora) === 'aberta' && agora >= inicio
  const c = contagem(inicio, agora)
  return (
    <Cartao className="grid gap-5 border-2 border-dourado/70 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-10">
      <div className="flex flex-col gap-3">
        <p className="text-[11px] font-bold tracking-[0.08em] text-ocre uppercase">
          {textos.proxima}
        </p>
        <h2 className="text-[24px] leading-tight font-bold text-verde-escuro">{live.tema}</h2>
        <Profissional quem={live.profissional} />
        <p className="text-[15px] text-tinta">
          {formatarDataHora(inicio)} · {textos.duracao(live.duracao_minutos)}
        </p>
        <p className="text-[17px] font-bold text-terracota-escuro" aria-live="polite">
          {aoVivo ? textos.aoVivo : textos.falta(c.dias, c.horas, c.minutos)}
        </p>
      </div>
      <div className="flex flex-col gap-3">
        <BotaoEntrar live={live} agora={agora} />
        <div className="flex flex-wrap gap-2">
          <BotaoBrilho tom="cinza" onClick={() => adicionarNaAgenda(live)}>
            {textos.agenda}
          </BotaoBrilho>
          <BotaoBrilho
            tom={live.lembrete ? 'verde' : 'cinza'}
            aria-pressed={live.lembrete}
            disabled={lembrete.isPending}
            onClick={() => lembrete.mutate({ live: live.id, ligar: !live.lembrete })}
          >
            {live.lembrete ? textos.lembrando : textos.lembrar}
          </BotaoBrilho>
        </div>
        {live.lembrete && <p className="text-[13px] text-suave">{textos.lembreteAviso}</p>}
      </div>
    </Cartao>
  )
}
